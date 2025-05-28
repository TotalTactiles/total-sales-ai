
import { supabase } from '@/integrations/supabase/client';
import { ClickUpErrorHandler } from './errorHandler';

export interface ClickUpWebhookPayload {
  event: string;
  task_id?: string;
  list_id?: string;
  webhook_id: string;
  history_items: Array<{
    id: string;
    type: number;
    date: string;
    field: string;
    parent_id: string;
    data: any;
    source: any;
    user: {
      id: string;
      username: string;
      email: string;
    };
  }>;
}

export class ClickUpWebhooks {
  private static instance: ClickUpWebhooks;
  private errorHandler = new ClickUpErrorHandler();

  static getInstance(): ClickUpWebhooks {
    if (!ClickUpWebhooks.instance) {
      ClickUpWebhooks.instance = new ClickUpWebhooks();
    }
    return ClickUpWebhooks.instance;
  }

  async handleWebhook(payload: ClickUpWebhookPayload): Promise<void> {
    try {
      console.log('Processing ClickUp webhook:', payload);

      switch (payload.event) {
        case 'taskCreated':
          await this.handleTaskCreated(payload.task_id);
          break;
        case 'taskUpdated':
          await this.handleTaskUpdated(payload.task_id, payload.history_items);
          break;
        case 'taskDeleted':
          await this.handleTaskDeleted(payload.task_id);
          break;
        case 'taskStatusUpdated':
          await this.handleTaskStatusUpdated(payload.task_id, payload.history_items);
          break;
        default:
          console.log(`Unhandled ClickUp event: ${payload.event}`);
      }
    } catch (error) {
      await this.errorHandler.logError(error, 'Webhook processing failed');
    }
  }

  private async handleTaskCreated(taskId?: string): Promise<void> {
    try {
      if (!taskId) return;
      
      console.log(`Handling ClickUp task creation: ${taskId}`);
      await this.syncTaskFromClickUp(taskId, 'created');
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to handle task creation webhook');
    }
  }

  private async handleTaskUpdated(taskId?: string, historyItems?: any[]): Promise<void> {
    try {
      if (!taskId) return;
      
      console.log(`Handling ClickUp task update: ${taskId}`);
      await this.syncTaskFromClickUp(taskId, 'updated');
      
      // Log specific field changes
      if (historyItems) {
        for (const item of historyItems) {
          console.log(`Field ${item.field} changed:`, item.data);
        }
      }
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to handle task update webhook');
    }
  }

  private async handleTaskDeleted(taskId?: string): Promise<void> {
    try {
      if (!taskId) return;
      
      console.log(`Handling ClickUp task deletion: ${taskId}`);
      await this.markTaskAsDeleted(taskId);
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to handle task deletion webhook');
    }
  }

  private async handleTaskStatusUpdated(taskId?: string, historyItems?: any[]): Promise<void> {
    try {
      if (!taskId) return;
      
      console.log(`Handling ClickUp task status update: ${taskId}`);
      
      // Find status change in history
      const statusChange = historyItems?.find(item => item.field === 'status');
      if (statusChange) {
        console.log(`Status changed to: ${statusChange.data?.status?.status}`);
      }
      
      await this.syncTaskFromClickUp(taskId, 'status_updated');
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to handle task status update webhook');
    }
  }

  private async syncTaskFromClickUp(taskId: string, operation: string): Promise<void> {
    try {
      console.log(`Syncing ClickUp task ${taskId} (${operation})`);
      
      // TODO: Implement actual task sync logic
      // 1. Fetch task from ClickUp API
      // 2. Transform to our lead format
      // 3. Upsert to our leads table
      // 4. Trigger AI processing
      
      await this.logWebhookActivity(taskId, operation, 'success');
    } catch (error) {
      await this.logWebhookActivity(taskId, operation, 'failed', error.message);
      throw error;
    }
  }

  private async markTaskAsDeleted(taskId: string): Promise<void> {
    try {
      await supabase
        .from('leads')
        .update({ 
          status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('source', 'clickup')
        .like('tags', `%clickup_task_${taskId}%`);

      await this.logWebhookActivity(taskId, 'deleted', 'success');
    } catch (error) {
      await this.logWebhookActivity(taskId, 'deleted', 'failed', error.message);
      throw error;
    }
  }

  private async logWebhookActivity(
    taskId: string, 
    operation: string, 
    status: string, 
    error?: string
  ): Promise<void> {
    try {
      // Use type assertion for the new table
      await (supabase as any)
        .from('integration_logs')
        .insert({
          provider: 'clickup',
          event_type: 'webhook',
          operation,
          resource_id: taskId,
          status,
          error_message: error,
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log webhook activity:', logError);
    }
  }

  async setupWebhooks(listIds: string[]): Promise<boolean> {
    try {
      console.log('Setting up ClickUp webhooks for lists:', listIds);
      
      // TODO: Implement webhook setup via ClickUp API
      // This would create webhooks for each list to monitor task changes
      
      return true;
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to setup ClickUp webhooks');
      return false;
    }
  }

  async validateWebhookSignature(payload: string, signature: string): Promise<boolean> {
    try {
      // TODO: Implement webhook signature validation
      // ClickUp includes a signature header for security
      return true;
    } catch (error) {
      console.error('Webhook signature validation failed:', error);
      return false;
    }
  }
}

export const clickUpWebhooks = ClickUpWebhooks.getInstance();
