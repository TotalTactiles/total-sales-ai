
import { supabase } from '@/integrations/supabase/client';
import { masterAIBrain } from '@/services/masterAIBrain';
import { clickUpAPI } from './api';
import { ClickUpErrorHandler } from './errorHandler';
import { ClickUpHelpers } from './helpers';
import crypto from 'crypto';

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
  private helpers = new ClickUpHelpers();

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

      const task = await clickUpAPI.getTask(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      // Determine integration user/company
      const { data: integration } = await (supabase as any)
        .from('crm_integrations')
        .select('user_id')
        .eq('provider', 'clickup')
        .eq('is_active', true)
        .single();

      if (!integration?.user_id) {
        throw new Error('No active ClickUp integration');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', integration.user_id)
        .single();

      const companyId = profile?.company_id;
      if (!companyId) {
        throw new Error('Company not found');
      }

      const transformedLead = this.helpers.transformClickUpTaskToOSLead(task, companyId);

      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('source', 'clickup')
        .like('tags', `%clickup_task_${taskId}%`)
        .single();

      if (existing) {
        await supabase
          .from('leads')
          .update({
            ...transformedLead,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('leads')
          .insert({
            ...transformedLead,
            source: 'clickup',
            tags: [...(transformedLead.tags || []), `clickup_task_${taskId}`],
            created_at: new Date().toISOString(),
          });
      }

      await masterAIBrain.ingestEvent({
        user_id: integration.user_id,
        company_id: companyId,
        event_type: 'crm_sync',
        source: 'clickup',
        data: task,
        context: { operation, taskId },
      });

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
      const secret = process.env.CLICKUP_WEBHOOK_SECRET;
      if (!secret || !signature) return false;

      const computed = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return computed === signature;
    } catch (error) {
      console.error('Webhook signature validation failed:', error);
      return false;
    }
  }
}

export const clickUpWebhooks = ClickUpWebhooks.getInstance();
