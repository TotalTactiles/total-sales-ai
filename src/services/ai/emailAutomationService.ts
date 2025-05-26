
import { supabase } from '@/integrations/supabase/client';
import { masterAIBrain } from '@/services/masterAIBrain';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'sequence' | 'one_off' | 'follow_up';
  variables: string[];
  companyId: string;
}

export interface EmailSequence {
  id: string;
  name: string;
  emails: EmailTemplate[];
  delays: number[]; // hours between emails
  isActive: boolean;
  companyId: string;
}

export interface EmailAutomationRule {
  id: string;
  trigger: 'lead_created' | 'lead_updated' | 'call_completed' | 'email_opened' | 'custom';
  conditions: Record<string, any>;
  action: 'send_email' | 'start_sequence' | 'schedule_follow_up';
  emailTemplateId?: string;
  sequenceId?: string;
  delay?: number;
  companyId: string;
}

export class EmailAutomationService {
  async createEmailTemplate(template: Omit<EmailTemplate, 'id'>, companyId: string): Promise<EmailTemplate> {
    try {
      const { data, error } = await supabase
        .from('email_sequences')
        .insert({
          name: template.name,
          subject_template: template.subject,
          body_template: template.body,
          delay_hours: 0,
          is_active: true,
          company_id: companyId
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        subject: data.subject_template,
        body: data.body_template,
        type: template.type,
        variables: template.variables,
        companyId: data.company_id
      };
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  }

  async generateEmailFromTemplate(
    templateId: string, 
    variables: Record<string, string>,
    leadContext?: any
  ): Promise<{ subject: string; body: string }> {
    try {
      // Get template
      const { data: template, error } = await supabase
        .from('email_sequences')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error || !template) {
        throw new Error('Template not found');
      }

      // Use AI to enhance the email with context
      await masterAIBrain.ingestEvent({
        user_id: variables.userId || 'system',
        company_id: variables.companyId || 'system',
        event_type: 'ai_output',
        source: 'email_automation',
        data: {
          action: 'generate_email',
          templateId,
          leadContext,
          variables
        }
      });

      // Replace variables in template
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
        metadata,
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

      // Log to AI brain for learning
      await masterAIBrain.ingestEvent({
        user_id: metadata.userId || 'system',
        company_id: metadata.companyId || 'system',
        event_type: 'email_interaction',
        source: 'automation_scheduler',
        data: {
          action: 'scheduled',
          to,
          subject,
          sendAt: sendAt.toISOString(),
          metadata
        }
      });

      return data.id;
    } catch (error) {
      console.error('Error scheduling email:', error);
      throw error;
    }
  }

  async processScheduledEmails(): Promise<void> {
    try {
      const now = new Date();
      
      // Get scheduled emails that are ready to send
      const { data: scheduledEmails, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('type', 'email_scheduled')
        .lte('payload->sendAt', now.toISOString())
        .eq('payload->status', 'scheduled');

      if (error) throw error;

      for (const emailLog of scheduledEmails || []) {
        try {
          const payload = this.extractEmailPayload(emailLog.payload);
          
          // Send email via Gmail
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

          // Update status
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

          // Log result to AI brain
          await masterAIBrain.ingestEvent({
            user_id: payload.metadata?.userId || 'system',
            company_id: payload.metadata?.companyId || 'system',
            event_type: 'email_interaction',
            source: 'automation_processor',
            data: {
              action: data.success ? 'sent' : 'failed',
              to: payload.to,
              subject: payload.subject,
              messageId: data.messageId,
              error: data.error
            }
          });

        } catch (error) {
          console.error('Error processing scheduled email:', error);
          
          // Mark as failed
          const payload = this.extractEmailPayload(emailLog.payload);
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

  async createAutomationRule(rule: Omit<EmailAutomationRule, 'id'>, companyId: string): Promise<EmailAutomationRule> {
    try {
      const rulePayload = { ...rule, companyId };

      const { data, error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'automation_rule',
          event_summary: `Email automation rule: ${rule.trigger}`,
          payload: rulePayload,
          visibility: 'admin_only',
          company_id: companyId
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        ...rule,
        companyId
      };
    } catch (error) {
      console.error('Error creating automation rule:', error);
      throw error;
    }
  }

  async evaluateAutomationTriggers(
    trigger: EmailAutomationRule['trigger'],
    eventData: Record<string, any>
  ): Promise<void> {
    try {
      // Get active automation rules for this trigger
      const { data: rules, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('type', 'automation_rule');

      if (error) throw error;

      for (const ruleLog of rules || []) {
        const rule = this.extractAutomationRule(ruleLog.payload);
        
        if (rule && rule.trigger === trigger && this.evaluateConditions(rule.conditions, eventData)) {
          await this.executeAutomationAction(rule, eventData);
        }
      }
    } catch (error) {
      console.error('Error evaluating automation triggers:', error);
    }
  }

  private extractEmailPayload(payload: any): any {
    // Simple extraction without complex type checking
    if (!payload || typeof payload !== 'object') {
      return { to: '', subject: '', body: '', metadata: {} };
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

  private extractAutomationRule(payload: any): EmailAutomationRule | null {
    // Simple extraction without complex type checking
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    // Check for required fields
    if (!payload.trigger || !payload.conditions || !payload.action) {
      return null;
    }

    return {
      id: String(payload.id || ''),
      trigger: payload.trigger,
      conditions: payload.conditions || {},
      action: payload.action,
      emailTemplateId: payload.emailTemplateId ? String(payload.emailTemplateId) : undefined,
      sequenceId: payload.sequenceId ? String(payload.sequenceId) : undefined,
      delay: payload.delay ? Number(payload.delay) : undefined,
      companyId: String(payload.companyId || '')
    };
  }

  private evaluateConditions(conditions: Record<string, any>, eventData: Record<string, any>): boolean {
    // Simple condition evaluation - can be enhanced
    return Object.entries(conditions).every(([key, expectedValue]) => {
      return eventData[key] === expectedValue;
    });
  }

  private async executeAutomationAction(
    rule: EmailAutomationRule,
    eventData: Record<string, any>
  ): Promise<void> {
    try {
      switch (rule.action) {
        case 'send_email':
          if (rule.emailTemplateId) {
            const email = await this.generateEmailFromTemplate(
              rule.emailTemplateId,
              eventData,
              eventData.leadContext
            );
            
            const sendAt = rule.delay 
              ? new Date(Date.now() + rule.delay * 60 * 60 * 1000)
              : new Date();
            
            await this.scheduleEmail(
              eventData.email,
              email.subject,
              email.body,
              sendAt,
              { 
                automationRuleId: rule.id,
                companyId: rule.companyId,
                ...eventData 
              }
            );
          }
          break;
          
        case 'start_sequence':
          if (rule.sequenceId) {
            // Implementation for email sequences
            console.log('Starting email sequence:', rule.sequenceId);
          }
          break;
          
        case 'schedule_follow_up':
          // Implementation for follow-up scheduling
          console.log('Scheduling follow-up');
          break;
      }

      // Log automation execution
      await masterAIBrain.ingestEvent({
        user_id: eventData.userId || 'system',
        company_id: eventData.companyId || rule.companyId || 'system',
        event_type: 'ai_output',
        source: 'email_automation',
        data: {
          action: 'automation_executed',
          ruleId: rule.id,
          trigger: rule.trigger,
          eventData
        }
      });

    } catch (error) {
      console.error('Error executing automation action:', error);
    }
  }
}

export const emailAutomationService = new EmailAutomationService();
