import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { withRetry } from '@/utils/withRetry';

export class EmailSchedulingService {
  async scheduleEmail(
    to: string,
    subject: string,
    body: string,
    sendAt: Date,
    metadata: Record<string, any> = {}
  ): Promise<string> {
    try {
      const emailPayload = {
        to,
        subject,
        body,
        sendAt: sendAt.toISOString(),
        metadata: this.sanitizeMetadata(metadata),
        status: 'scheduled'
      };

      const { data, error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'email_scheduled',
          event_summary: `Email scheduled for ${to}`,
          payload: emailPayload,
          visibility: 'admin_only',
          company_id: metadata.companyId || 'system'
        })
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      logger.error('Error scheduling email:', error);
      throw error;
    }
  }

  async processScheduledEmails(): Promise<void> {
    try {
      const now = new Date();
      
      const { data: scheduledEmails, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('type', 'email_scheduled')
        .lte('payload->sendAt', now.toISOString());

      if (error) throw error;

      for (const emailLog of scheduledEmails || []) {
        try {
          const payload = this.safeExtractEmailPayload(emailLog.payload);
          
          if (payload.status !== 'scheduled') continue;

          const { data, error: sendError } = await withRetry(
            () =>
              supabase.functions.invoke('gmail-send', {
                body: {
                  to: payload.to,
                  subject: payload.subject,
                  body: payload.body,
                  leadId: payload.metadata?.leadId,
                  leadName: payload.metadata?.leadName
                }
              }),
            'gmail-send'
          );

          if (sendError) throw sendError;

          const updatedPayload = {
            ...payload,
            status: data.success ? 'sent' : 'failed',
            sentAt: new Date().toISOString(),
            messageId: data.messageId,
            error: data.error
          };

          await supabase
            .from('ai_brain_logs')
            .update({ payload: updatedPayload })
            .eq('id', emailLog.id);

        } catch (error) {
          logger.error('Error processing scheduled email:', error);
          
          const payload = this.safeExtractEmailPayload(emailLog.payload);
          const failedPayload = {
            ...payload,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          };

          await supabase
            .from('ai_brain_logs')
            .update({ payload: failedPayload })
            .eq('id', emailLog.id);
        }
      }
    } catch (error) {
      logger.error('Error processing scheduled emails:', error);
    }
  }

  private safeExtractEmailPayload(payload: any): any {
    if (!payload || typeof payload !== 'object') {
      return { 
        to: '', 
        subject: '', 
        body: '', 
        metadata: {}, 
        status: 'pending' 
      };
    }
    
    return {
      to: String(payload.to || ''),
      subject: String(payload.subject || ''),
      body: String(payload.body || ''),
      sendAt: payload.sendAt,
      metadata: payload.metadata || {},
      status: payload.status || 'pending'
    };
  }

  private sanitizeMetadata(metadata: Record<string, any>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    Object.keys(metadata).forEach(key => {
      sanitized[key] = String(metadata[key] || '');
    });
    return sanitized;
  }
}

export const emailSchedulingService = new EmailSchedulingService();
