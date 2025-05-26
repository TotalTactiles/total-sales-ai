
import { supabase } from '@/integrations/supabase/client';
import { automationFlowService } from './automationFlowService';

// Simple email template interface
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  industry?: string;
  companyId: string;
}

// Simple automation result interface
export interface AutomationResult {
  success: boolean;
  message: string;
  data?: any;
  warnings?: string[];
}

export class EmailAutomationService {
  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .insert({
          name: template.name,
          subject_template: template.subject,
          body_template: template.body,
          delay_hours: 0,
          is_active: true,
          company_id: template.companyId
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        subject: data.subject_template,
        body: data.body_template,
        variables: template.variables,
        industry: template.industry,
        companyId: data.company_id
      };
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  }

  async generateEmailFromTemplate(
    templateId: string, 
    variables: Record<string, string>
  ): Promise<{ subject: string; body: string }> {
    try {
      const { data: template, error } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error || !template) {
        throw new Error('Template not found');
      }

      let subject = template.subject_template;
      let body = template.body_template;

      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        subject = subject.replace(new RegExp(placeholder, 'g'), value);
        body = body.replace(new RegExp(placeholder, 'g'), value);
      });

      return { subject, body };
    } catch (error) {
      console.error('Error generating email from template:', error);
      throw error;
    }
  }

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
      console.error('Error scheduling email:', error);
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

          const { data, error: sendError } = await supabase.functions.invoke('gmail-send', {
            body: {
              to: payload.to,
              subject: payload.subject,
              body: payload.body,
              leadId: payload.metadata?.leadId,
              leadName: payload.metadata?.leadName
            }
          });

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
          console.error('Error processing scheduled email:', error);
          
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
      console.error('Error processing scheduled emails:', error);
    }
  }

  async evaluateAutomationTriggers(
    trigger: string,
    eventData: Record<string, any>
  ): Promise<void> {
    try {
      // Convert to FlowExecutionContext format
      const flowContext = {
        userId: String(eventData.userId || 'system'),
        companyId: String(eventData.companyId || 'system'),
        timestamp: new Date().toISOString(),
        leadId: String(eventData.leadId || ''),
        email: String(eventData.email || ''),
        phone: String(eventData.phone || ''),
        name: String(eventData.name || '')
      };

      await automationFlowService.evaluateFlowTriggers(trigger, flowContext);
    } catch (error) {
      console.error('Error evaluating automation triggers:', error);
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

export const emailAutomationService = new EmailAutomationService();
