
import { supabase } from '@/integrations/supabase/client';
import { nativeAutomationEngine } from './automationEngine';
import { 
  EmailTemplate, 
  AutomationFlow, 
  AutomationAction, 
  AutomationResult,
  JsonAutomationFlow
} from './types/automationTypes';

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
    variables: Record<string, string>,
    leadContext?: Record<string, any>
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
        metadata,
        status: 'scheduled'
      };

      const { data, error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'email_scheduled',
          event_summary: `Email scheduled for ${to}`,
          payload: emailPayload as any,
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

  async createEmailAutomationFlow(
    name: string,
    trigger: string,
    conditions: Record<string, any>,
    templateId: string,
    delay: number = 0,
    companyId: string,
    userId: string
  ): Promise<AutomationResult> {
    try {
      const emailAction: AutomationAction = {
        id: crypto.randomUUID(),
        type: 'email',
        content: `Email from template ${templateId}`,
        delay,
        metadata: {
          templateId,
          body: 'Email content will be generated from template'
        }
      };

      const flow: Omit<AutomationFlow, 'id'> = {
        name,
        trigger: {
          type: trigger as any,
          conditions: Object.entries(conditions).map(([field, value]) => ({
            field,
            operator: 'equals' as const,
            value
          }))
        },
        actions: [emailAction],
        isActive: true,
        companyId,
        createdBy: userId
      };

      return await nativeAutomationEngine.createAutomationFlow(flow);

    } catch (error) {
      console.error('Error creating email automation flow:', error);
      return {
        success: false,
        message: 'Failed to create email automation flow'
      };
    }
  }

  async processScheduledEmails(): Promise<void> {
    try {
      const now = new Date();
      
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
            .update({ payload: updatedPayload as any })
            .eq('id', emailLog.id);

        } catch (error) {
          console.error('Error processing scheduled email:', error);
          
          const payload = this.extractEmailPayload(emailLog.payload);
          const failedPayload = {
            ...payload,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          };

          await supabase
            .from('ai_brain_logs')
            .update({ payload: failedPayload as any })
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
      const { data: flows, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('type', 'automation_flow');

      if (error) throw error;

      for (const flowLog of flows || []) {
        const flow = this.extractFlowData(flowLog.payload);
        
        if (flow && flow.trigger.type === trigger && flow.isActive) {
          const conditionsMatch = this.evaluateConditions(flow.trigger.conditions, eventData);
          
          if (conditionsMatch) {
            await nativeAutomationEngine.executeFlow(
              flowLog.id,
              eventData,
              eventData.userId || 'system',
              eventData.companyId || 'system'
            );
          }
        }
      }
    } catch (error) {
      console.error('Error evaluating automation triggers:', error);
    }
  }

  private extractEmailPayload(payload: any): any {
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

  private extractFlowData(payload: any): JsonAutomationFlow | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    try {
      return {
        id: String(payload.id || ''),
        name: String(payload.name || ''),
        trigger: payload.trigger || { type: 'custom', conditions: [] },
        actions: Array.isArray(payload.actions) ? payload.actions : [],
        isActive: Boolean(payload.isActive),
        companyId: String(payload.companyId || ''),
        createdBy: String(payload.createdBy || ''),
        industry: payload.industry ? String(payload.industry) : undefined,
        metadata: payload.metadata || {},
        createdAt: payload.createdAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error extracting flow data:', error);
      return null;
    }
  }

  private evaluateConditions(conditions: any[], eventData: Record<string, any>): boolean {
    if (!Array.isArray(conditions)) return true;
    
    return conditions.every(condition => {
      if (!condition || typeof condition !== 'object') return false;
      
      const { field, operator, value } = condition;
      const eventValue = eventData[field];

      switch (operator) {
        case 'equals':
          return eventValue === value;
        case 'contains':
          return String(eventValue).includes(String(value));
        case 'greater_than':
          return Number(eventValue) > Number(value);
        case 'less_than':
          return Number(eventValue) < Number(value);
        case 'exists':
          return eventValue !== undefined && eventValue !== null;
        default:
          return false;
      }
    });
  }
}

export const emailAutomationService = new EmailAutomationService();
