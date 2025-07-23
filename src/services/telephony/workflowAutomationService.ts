
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WorkflowTrigger {
  id: string;
  name: string;
  type: 'call_completed' | 'sms_received' | 'lead_status_change' | 'missed_call' | 'recording_transcribed';
  conditions: Record<string, any>;
  actions: WorkflowAction[];
  is_active: boolean;
}

export interface WorkflowAction {
  type: 'send_sms' | 'schedule_call' | 'update_lead' | 'create_task' | 'send_email' | 'webhook';
  parameters: Record<string, any>;
  delay_minutes?: number;
}

export interface WorkflowExecution {
  id: string;
  trigger_id: string;
  lead_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  executed_actions: string[];
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export class WorkflowAutomationService {
  static async createWorkflow(
    companyId: string,
    workflow: Omit<WorkflowTrigger, 'id'>
  ): Promise<WorkflowTrigger | null> {
    try {
      const { data, error } = await supabase
        .from('workflow_triggers')
        .insert({
          company_id: companyId,
          ...workflow
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating workflow:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating workflow:', error);
      return null;
    }
  }

  static async executeWorkflow(
    triggerId: string,
    leadId: string,
    triggerData: Record<string, any>
  ): Promise<WorkflowExecution | null> {
    try {
      // Get workflow definition
      const { data: workflow, error: workflowError } = await supabase
        .from('workflow_triggers')
        .select('*')
        .eq('id', triggerId)
        .eq('is_active', true)
        .single();

      if (workflowError || !workflow) {
        console.error('Workflow not found or inactive:', workflowError);
        return null;
      }

      // Check if conditions are met
      const conditionsMet = this.evaluateConditions(workflow.conditions, triggerData);
      if (!conditionsMet) {
        console.log('Workflow conditions not met');
        return null;
      }

      // Create execution record
      const { data: execution, error: executionError } = await supabase
        .from('workflow_executions')
        .insert({
          trigger_id: triggerId,
          lead_id: leadId,
          status: 'running',
          executed_actions: []
        })
        .select()
        .single();

      if (executionError) {
        console.error('Error creating workflow execution:', executionError);
        return null;
      }

      // Execute actions
      const executedActions: string[] = [];
      for (const action of workflow.actions) {
        try {
          if (action.delay_minutes && action.delay_minutes > 0) {
            // Schedule action for later execution
            await this.scheduleAction(execution.id, action, action.delay_minutes);
          } else {
            // Execute immediately
            await this.executeAction(action, leadId, triggerData);
          }
          executedActions.push(action.type);
        } catch (actionError) {
          console.error(`Error executing action ${action.type}:`, actionError);
          await supabase
            .from('workflow_executions')
            .update({
              status: 'failed',
              error_message: `Failed to execute action: ${action.type}`,
              executed_actions: executedActions
            })
            .eq('id', execution.id);
          return execution;
        }
      }

      // Update execution as completed
      await supabase
        .from('workflow_executions')
        .update({
          status: 'completed',
          executed_actions: executedActions,
          completed_at: new Date().toISOString()
        })
        .eq('id', execution.id);

      return { ...execution, executed_actions: executedActions };
    } catch (error) {
      console.error('Error executing workflow:', error);
      return null;
    }
  }

  static async executeAction(
    action: WorkflowAction,
    leadId: string,
    triggerData: Record<string, any>
  ): Promise<void> {
    switch (action.type) {
      case 'send_sms':
        await this.sendSMSAction(action.parameters, leadId);
        break;
      case 'schedule_call':
        await this.scheduleCallAction(action.parameters, leadId);
        break;
      case 'update_lead':
        await this.updateLeadAction(action.parameters, leadId);
        break;
      case 'create_task':
        await this.createTaskAction(action.parameters, leadId);
        break;
      case 'send_email':
        await this.sendEmailAction(action.parameters, leadId);
        break;
      case 'webhook':
        await this.callWebhookAction(action.parameters, leadId, triggerData);
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  private static async sendSMSAction(parameters: any, leadId: string): Promise<void> {
    const { data: lead } = await supabase
      .from('leads')
      .select('phone, name')
      .eq('id', leadId)
      .single();

    if (!lead?.phone) return;

    await supabase.functions.invoke('send-sms', {
      body: {
        to: lead.phone,
        message: parameters.message.replace('{{leadName}}', lead.name),
        leadId: leadId
      }
    });
  }

  private static async scheduleCallAction(parameters: any, leadId: string): Promise<void> {
    const scheduledTime = new Date();
    scheduledTime.setMinutes(scheduledTime.getMinutes() + (parameters.delay_minutes || 60));

    await supabase
      .from('scheduled_tasks')
      .insert({
        lead_id: leadId,
        task_type: 'call',
        scheduled_for: scheduledTime.toISOString(),
        parameters: parameters
      });
  }

  private static async updateLeadAction(parameters: any, leadId: string): Promise<void> {
    await supabase
      .from('leads')
      .update(parameters.updates)
      .eq('id', leadId);
  }

  private static async createTaskAction(parameters: any, leadId: string): Promise<void> {
    await supabase
      .from('tasks')
      .insert({
        lead_id: leadId,
        title: parameters.title,
        description: parameters.description,
        due_date: parameters.due_date,
        priority: parameters.priority || 'medium'
      });
  }

  private static async sendEmailAction(parameters: any, leadId: string): Promise<void> {
    const { data: lead } = await supabase
      .from('leads')
      .select('email, name')
      .eq('id', leadId)
      .single();

    if (!lead?.email) return;

    await supabase.functions.invoke('send-email', {
      body: {
        to: lead.email,
        subject: parameters.subject.replace('{{leadName}}', lead.name),
        html: parameters.html.replace('{{leadName}}', lead.name),
        leadId: leadId
      }
    });
  }

  private static async callWebhookAction(
    parameters: any,
    leadId: string,
    triggerData: Record<string, any>
  ): Promise<void> {
    await fetch(parameters.url, {
      method: parameters.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(parameters.headers || {})
      },
      body: JSON.stringify({
        leadId,
        triggerData,
        ...parameters.data
      })
    });
  }

  private static evaluateConditions(
    conditions: Record<string, any>,
    triggerData: Record<string, any>
  ): boolean {
    // Simple condition evaluation - can be enhanced with more complex logic
    for (const [key, expectedValue] of Object.entries(conditions)) {
      const actualValue = triggerData[key];
      
      if (typeof expectedValue === 'object' && expectedValue.operator) {
        const { operator, value } = expectedValue;
        switch (operator) {
          case 'equals':
            if (actualValue !== value) return false;
            break;
          case 'not_equals':
            if (actualValue === value) return false;
            break;
          case 'greater_than':
            if (actualValue <= value) return false;
            break;
          case 'less_than':
            if (actualValue >= value) return false;
            break;
          case 'contains':
            if (!actualValue || !actualValue.includes(value)) return false;
            break;
          default:
            return false;
        }
      } else {
        if (actualValue !== expectedValue) return false;
      }
    }
    return true;
  }

  private static async scheduleAction(
    executionId: string,
    action: WorkflowAction,
    delayMinutes: number
  ): Promise<void> {
    const scheduledTime = new Date();
    scheduledTime.setMinutes(scheduledTime.getMinutes() + delayMinutes);

    await supabase
      .from('scheduled_workflow_actions')
      .insert({
        execution_id: executionId,
        action_type: action.type,
        action_parameters: action.parameters,
        scheduled_for: scheduledTime.toISOString(),
        status: 'pending'
      });
  }

  // Built-in workflow templates
  static getWorkflowTemplates(): Partial<WorkflowTrigger>[] {
    return [
      {
        name: 'Follow-up Missed Calls',
        type: 'missed_call',
        conditions: { call_duration: { operator: 'less_than', value: 10 } },
        actions: [
          {
            type: 'send_sms',
            parameters: {
              message: 'Hi {{leadName}}, I just tried calling you. When would be a good time to connect?'
            },
            delay_minutes: 5
          }
        ]
      },
      {
        name: 'Post-Call Follow-up',
        type: 'call_completed',
        conditions: { call_duration: { operator: 'greater_than', value: 300 } },
        actions: [
          {
            type: 'send_email',
            parameters: {
              subject: 'Thanks for the call, {{leadName}}',
              html: 'Hi {{leadName}},<br><br>Thanks for taking the time to speak with me today. I\'ll follow up on the next steps we discussed.<br><br>Best regards'
            },
            delay_minutes: 60
          }
        ]
      },
      {
        name: 'SMS Response Auto-Reply',
        type: 'sms_received',
        conditions: { message_content: { operator: 'contains', value: 'info' } },
        actions: [
          {
            type: 'send_sms',
            parameters: {
              message: 'Thanks for your interest! I\'ll send you more information shortly.'
            }
          }
        ]
      }
    ];
  }
}
