
import { supabase } from '@/integrations/supabase/client';
import { AutomationExecution, AutomationLog, AutomationAction, AutomationResult } from '../types/automationTypes';
import { actionExecutors } from './actionExecutors';

export class ExecutionManager {
  async createExecution(execution: Omit<AutomationExecution, 'id'>): Promise<string> {
    const executionData = {
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
        payload: executionData,
        company_id: execution.companyId,
        visibility: 'admin_only'
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateExecutionProgress(executionId: string, actionIndex: number, status: string): Promise<void> {
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

  async updateExecutionStatus(
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
        payload: updateData
      })
      .eq('id', executionId);
  }

  async executeActions(
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
        await this.updateExecutionProgress(executionId, i, 'running');

        if (action.delay && action.delay > 0) {
          await this.scheduleActionDelay(action.delay);
        }

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
        return actionExecutors.executeEmailAction(action, context, userId, companyId);
      case 'sms':
        return actionExecutors.executeSmsAction(action, context, userId, companyId);
      case 'task':
        return actionExecutors.executeTaskAction(action, context, userId, companyId);
      case 'note':
        return actionExecutors.executeNoteAction(action, context, userId, companyId);
      case 'call':
        return actionExecutors.executeCallAction(action, context, userId, companyId);
      case 'calendar':
        return actionExecutors.executeCalendarAction(action, context, userId, companyId);
      default:
        return { success: false, message: `Unknown action type: ${action.type}` };
    }
  }

  private async scheduleActionDelay(hours: number): Promise<void> {
    const delayMs = Math.min(hours * 60 * 60 * 1000, 5000);
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }
}

export const executionManager = new ExecutionManager();
