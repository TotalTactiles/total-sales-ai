import { supabase } from '@/integrations/supabase/client';
import { 
  AutomationFlow, 
  AutomationExecution, 
  AutomationAction, 
  AutomationResult,
  AutomationLimits,
  DEFAULT_AUTOMATION_LIMITS,
  AutomationLog
} from './types/automationTypes';

// JSON-compatible interfaces for database storage
interface JsonAutomationFlow {
  id: string;
  createdBy: string;
  createdAt: string;
  name: string;
  trigger: {
    type: string;
    conditions: Array<{
      field: string;
      operator: string;
      value: string | number | boolean;
    }>;
    delay?: number;
  };
  actions: Array<{
    id: string;
    type: string;
    content: string;
    delay?: number;
    conditions?: Array<{
      field: string;
      operator: string;
      value: string | number | boolean;
    }>;
    metadata?: Record<string, string>;
  }>;
  isActive: boolean;
  companyId: string;
  industry?: string;
  metadata: Record<string, string>;
}

interface JsonAutomationExecution {
  id: string;
  flowId: string;
  leadId?: string;
  userId: string;
  companyId: string;
  status: string;
  currentActionIndex: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  logs: Array<{
    timestamp: string;
    action: string;
    status: string;
    message: string;
    data?: Record<string, any>;
  }>;
}

export class NativeAutomationEngine {
  private limits: AutomationLimits = DEFAULT_AUTOMATION_LIMITS;

  async createAutomationFlow(
    flow: Omit<AutomationFlow, 'id'>
  ): Promise<AutomationResult> {
    try {
      // Check user limits
      const canCreate = await this.checkUserLimits(flow.createdBy, flow.companyId);
      if (!canCreate.success) {
        return canCreate;
      }

      // Validate flow structure
      const validation = this.validateFlow(flow);
      if (!validation.success) {
        return validation;
      }

      // Create JSON-compatible flow data
      const flowData: JsonAutomationFlow = {
        id: crypto.randomUUID(),
        createdBy: flow.createdBy,
        createdAt: new Date().toISOString(),
        name: flow.name,
        trigger: {
          type: flow.trigger.type,
          conditions: flow.trigger.conditions.map(c => ({
            field: c.field,
            operator: c.operator,
            value: c.value
          })),
          delay: flow.trigger.delay
        },
        actions: flow.actions.map(a => ({
          id: a.id,
          type: a.type,
          content: a.content,
          delay: a.delay,
          conditions: a.conditions?.map(c => ({
            field: c.field,
            operator: c.operator,
            value: c.value
          })),
          metadata: a.metadata || {}
        })),
        isActive: flow.isActive,
        companyId: flow.companyId,
        industry: flow.industry || '',
        metadata: flow.metadata || {}
      };

      // Store in database
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .insert({
          type: 'automation_flow',
          event_summary: `Created automation flow: ${flow.name}`,
          payload: flowData as any,
          company_id: flow.companyId,
          visibility: 'admin_only'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Automation flow created successfully',
        data: { flowId: data.id }
      };

    } catch (error) {
      console.error('Error creating automation flow:', error);
      return {
        success: false,
        message: 'Failed to create automation flow'
      };
    }
  }

  async executeFlow(
    flowId: string,
    triggerData: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      // Get flow configuration
      const flow = await this.getFlow(flowId);
      if (!flow) {
        return { success: false, message: 'Flow not found' };
      }

      // Check execution limits
      const canExecute = await this.checkExecutionLimits(userId, companyId);
      if (!canExecute.success) {
        return canExecute;
      }

      // Create execution record
      const execution: Omit<AutomationExecution, 'id'> = {
        flowId,
        leadId: triggerData.leadId,
        userId,
        companyId,
        status: 'pending',
        currentActionIndex: 0,
        startedAt: new Date(),
        logs: []
      };

      const executionId = await this.createExecution(execution);

      // Execute actions sequentially
      const result = await this.executeActions(
        executionId,
        flow.actions,
        triggerData,
        userId,
        companyId
      );

      return result;

    } catch (error) {
      console.error('Error executing flow:', error);
      return {
        success: false,
        message: 'Flow execution failed'
      };
    }
  }

  private async executeActions(
    executionId: string,
    actions: AutomationAction[],
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    const logs: AutomationLog[] = [];
    
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      
      try {
        // Update execution status
        await this.updateExecutionProgress(executionId, i, 'running');

        // Apply delay if specified
        if (action.delay && action.delay > 0) {
          await this.scheduleActionDelay(action.delay);
        }

        // Execute the action
        const actionResult = await this.executeAction(action, context, userId, companyId);
        
        logs.push({
          timestamp: new Date(),
          action: `${action.type}:${action.id}`,
          status: actionResult.success ? 'success' : 'error',
          message: actionResult.message,
          data: actionResult.data
        });

        if (!actionResult.success) {
          await this.updateExecutionStatus(executionId, 'failed', actionResult.message, logs);
          return {
            success: false,
            message: `Action ${i + 1} failed: ${actionResult.message}`,
            warnings: logs.filter(l => l.status === 'warning').map(l => l.message)
          };
        }

      } catch (error) {
        const errorMessage = `Action ${i + 1} error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        logs.push({
          timestamp: new Date(),
          action: `${action.type}:${action.id}`,
          status: 'error',
          message: errorMessage
        });

        await this.updateExecutionStatus(executionId, 'failed', errorMessage, logs);
        return { success: false, message: errorMessage };
      }
    }

    // Mark execution as completed
    await this.updateExecutionStatus(executionId, 'completed', 'All actions completed successfully', logs);
    
    return {
      success: true,
      message: 'Flow executed successfully',
      data: { executedActions: actions.length },
      warnings: logs.filter(l => l.status === 'warning').map(l => l.message)
    };
  }

  private async executeAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    switch (action.type) {
      case 'email':
        return this.executeEmailAction(action, context, userId, companyId);
      case 'sms':
        return this.executeSmsAction(action, context, userId, companyId);
      case 'task':
        return this.executeTaskAction(action, context, userId, companyId);
      case 'note':
        return this.executeNoteAction(action, context, userId, companyId);
      case 'call':
        return this.executeCallAction(action, context, userId, companyId);
      case 'calendar':
        return this.executeCalendarAction(action, context, userId, companyId);
      default:
        return { success: false, message: `Unknown action type: ${action.type}` };
    }
  }

  private async executeEmailAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      // Use Gmail integration for email sending
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

  private async executeSmsAction(
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

  private async executeTaskAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      // Create task in notifications table
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

  private async executeNoteAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      // Create JSON-compatible log data
      const logData = {
        leadId: context.leadId,
        note: this.replaceVariables(action.content, context),
        automationAction: action.id
      };

      // Store note in ai_brain_logs
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

  private async executeCallAction(
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

      // Schedule call notification instead of auto-dialing
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

  private async executeCalendarAction(
    action: AutomationAction,
    context: Record<string, any>,
    userId: string,
    companyId: string
  ): Promise<AutomationResult> {
    try {
      // Create calendar event via Google Calendar API
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

  private async checkUserLimits(userId: string, companyId: string): Promise<AutomationResult> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('id')
        .eq('type', 'automation_flow')
        .eq('company_id', companyId);

      if (error) throw error;

      const flowCount = data?.length || 0;
      if (flowCount >= this.limits.maxFlowsPerUser) {
        return {
          success: false,
          message: `Flow limit exceeded. Maximum ${this.limits.maxFlowsPerUser} flows allowed per user.`
        };
      }

      return { success: true, message: 'Limits check passed' };

    } catch (error) {
      return { success: false, message: 'Failed to check user limits' };
    }
  }

  private validateFlow(flow: Omit<AutomationFlow, 'id'>): AutomationResult {
    if (flow.actions.length > this.limits.maxActionsPerFlow) {
      return {
        success: false,
        message: `Too many actions. Maximum ${this.limits.maxActionsPerFlow} actions allowed per flow.`
      };
    }

    if (!flow.name || flow.name.trim().length === 0) {
      return { success: false, message: 'Flow name is required' };
    }

    if (!flow.trigger.type) {
      return { success: false, message: 'Flow trigger type is required' };
    }

    return { success: true, message: 'Flow validation passed' };
  }

  private async checkExecutionLimits(userId: string, companyId: string): Promise<AutomationResult> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('id')
        .eq('type', 'automation_execution')
        .eq('company_id', companyId)
        .gte('timestamp', oneHourAgo.toISOString());

      if (error) throw error;

      const executionCount = data?.length || 0;
      if (executionCount >= this.limits.maxExecutionsPerHour) {
        return {
          success: false,
          message: `Execution limit exceeded. Maximum ${this.limits.maxExecutionsPerHour} executions per hour.`
        };
      }

      return { success: true, message: 'Execution limits check passed' };

    } catch (error) {
      return { success: false, message: 'Failed to check execution limits' };
    }
  }

  private async getFlow(flowId: string): Promise<AutomationFlow | null> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('id', flowId)
        .eq('type', 'automation_flow')
        .single();

      if (error || !data) return null;

      return data.payload as unknown as AutomationFlow;

    } catch (error) {
      console.error('Error getting flow:', error);
      return null;
    }
  }

  private async createExecution(execution: Omit<AutomationExecution, 'id'>): Promise<string> {
    const executionData: JsonAutomationExecution = {
      id: crypto.randomUUID(),
      flowId: execution.flowId,
      leadId: execution.leadId,
      userId: execution.userId,
      companyId: execution.companyId,
      status: execution.status,
      currentActionIndex: execution.currentActionIndex,
      startedAt: execution.startedAt.toISOString(),
      logs: execution.logs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        action: log.action,
        status: log.status,
        message: log.message,
        data: log.data
      }))
    };

    const { data, error } = await supabase
      .from('ai_brain_logs')
      .insert({
        type: 'automation_execution',
        event_summary: `Automation execution started`,
        payload: executionData as any,
        company_id: execution.companyId,
        visibility: 'admin_only'
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  private async updateExecutionProgress(executionId: string, actionIndex: number, status: string): Promise<void> {
    const updateData = {
      currentActionIndex: actionIndex,
      status,
      updatedAt: new Date().toISOString()
    };

    await supabase
      .from('ai_brain_logs')
      .update({
        payload: updateData
      })
      .eq('id', executionId);
  }

  private async updateExecutionStatus(
    executionId: string,
    status: string,
    message: string,
    logs: AutomationLog[]
  ): Promise<void> {
    const updateData = {
      status,
      completedAt: new Date().toISOString(),
      errorMessage: status === 'failed' ? message : undefined,
      logs: logs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        action: log.action,
        status: log.status,
        message: log.message,
        data: log.data
      }))
    };

    await supabase
      .from('ai_brain_logs')
      .update({
        payload: updateData as any
      })
      .eq('id', executionId);
  }

  private async scheduleActionDelay(hours: number): Promise<void> {
    // For immediate execution in development, we'll use a short delay
    // In production, this would integrate with a proper job scheduler
    const delayMs = Math.min(hours * 60 * 60 * 1000, 5000); // Max 5 seconds for demo
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }
}

export const nativeAutomationEngine = new NativeAutomationEngine();
