
import { supabase } from '@/integrations/supabase/client';
import { AutomationAction, AutomationResult } from '../types/automationTypes';

export class ActionExecutors {
  async executeEmailAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('gmail-send', {
        body: {
          to: context.email || context.leadEmail,
          subject: this.replaceVariables(action.content, context),
          body: this.replaceVariables(action.metadata?.body || action.content, context),
          leadId: context.leadId,
          leadName: context.leadName || context.name
        }
      });

      if (error) throw error;

      return {
        success: data.success,
        message: data.success ? 'Email sent successfully' : 'Email failed to send',
        data: { messageId: data.messageId }
      };

    } catch (error) {
      return {
        success: false,
        message: `Email action failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async executeSmsAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      if (!context.phone) {
        return {
          success: false,
          message: 'SMS action skipped: No phone number available'
        };
      }

      const { data, error } = await supabase.functions.invoke('twilio-sms', {
        body: {
          to: context.phone,
          message: this.replaceVariables(action.content, context),
          leadId: context.leadId
        }
      });

      if (error) throw error;

      return {
        success: true,
        message: 'SMS sent successfully',
        data: { messageId: data.messageId }
      };

    } catch (error) {
      return {
        success: false,
        message: `SMS action failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async executeTaskAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          company_id: companyId,
          type: 'task',
          title: 'Automated Task',
          message: this.replaceVariables(action.content, context),
          metadata: {
            leadId: context.leadId,
            automationAction: action.id,
            priority: action.metadata?.priority || 'medium'
          }
        });

      if (error) throw error;

      return {
        success: true,
        message: 'Task created successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: `Task action failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async executeNoteAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      const logData = {
        leadId: context.leadId,
        note: this.replaceVariables(action.content, context),
        automationAction: action.id
      };

      const { error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'automation_note',
          event_summary: `Automation note: ${action.content.substring(0, 50)}...`,
          payload: logData,
          company_id: companyId,
          visibility: 'admin_only'
        });

      if (error) throw error;

      return {
        success: true,
        message: 'Note added successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: `Note action failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async executeCallAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      if (!context.phone) {
        return {
          success: false,
          message: 'Call action skipped: No phone number available'
        };
      }

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          company_id: companyId,
          type: 'call_reminder',
          title: 'Automated Call Reminder',
          message: `Call ${context.name || 'lead'}: ${this.replaceVariables(action.content, context)}`,
          metadata: {
            leadId: context.leadId,
            phone: context.phone,
            automationAction: action.id
          }
        });

      if (error) throw error;

      return {
        success: true,
        message: 'Call reminder scheduled successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: `Call action failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async executeCalendarAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: {
          summary: this.replaceVariables(action.content, context),
          description: action.metadata?.description || '',
          start: action.metadata?.startTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          duration: action.metadata?.duration || 30,
          attendees: context.email ? [context.email] : []
        }
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Calendar event created successfully',
        data: { eventId: data.eventId }
      };

    } catch (error) {
      return {
        success: false,
        message: `Calendar action failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private replaceVariables(template: string, context: Record<string, any>): string {
    let result = template;
    Object.entries(context).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value || ''));
    });
    return result;
  }
}

export const actionExecutors = new ActionExecutors();
