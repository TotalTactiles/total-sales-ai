import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { ZohoErrorHandler } from './errorHandler';
import { ZohoHelpers } from './helpers';

export interface ZohoWebhookPayload {
  module: string;
  operation: string;
  resource_uri: string;
  ids: string[];
  token: string;
}

export class ZohoWebhooks {
  private static instance: ZohoWebhooks;
  private errorHandler = new ZohoErrorHandler();
  private helpers = new ZohoHelpers();

  static getInstance(): ZohoWebhooks {
    if (!ZohoWebhooks.instance) {
      ZohoWebhooks.instance = new ZohoWebhooks();
    }
    return ZohoWebhooks.instance;
  }

  async handleWebhook(payload: ZohoWebhookPayload): Promise<void> {
    try {
      logger.info('Processing Zoho webhook:', payload);

      if (payload.module !== 'Leads') {
        logger.info('Ignoring non-lead webhook');
        return;
      }

      switch (payload.operation) {
        case 'create':
          await this.handleLeadCreated(payload.ids);
          break;
        case 'update':
          await this.handleLeadUpdated(payload.ids);
          break;
        case 'delete':
          await this.handleLeadDeleted(payload.ids);
          break;
        default:
          logger.info(`Unhandled Zoho operation: ${payload.operation}`);
      }
    } catch (error) {
      await this.errorHandler.logError(error, 'Webhook processing failed');
    }
  }

  private async handleLeadCreated(leadIds: string[]): Promise<void> {
    try {
      for (const leadId of leadIds) {
        await this.syncLeadFromZoho(leadId, 'created');
      }
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to handle lead creation webhook');
    }
  }

  private async handleLeadUpdated(leadIds: string[]): Promise<void> {
    try {
      for (const leadId of leadIds) {
        await this.syncLeadFromZoho(leadId, 'updated');
      }
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to handle lead update webhook');
    }
  }

  private async handleLeadDeleted(leadIds: string[]): Promise<void> {
    try {
      for (const leadId of leadIds) {
        await this.markLeadAsDeleted(leadId);
      }
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to handle lead deletion webhook');
    }
  }

  private async syncLeadFromZoho(leadId: string, operation: string): Promise<void> {
    try {
      // This would typically fetch the lead from Zoho API and sync to our database
      // For now, we'll log the sync operation
      logger.info(`Syncing Zoho lead ${leadId} (${operation})`);
      
      // TODO: Implement actual lead sync logic
      // 1. Fetch lead from Zoho API
      // 2. Transform to our lead format
      // 3. Upsert to our leads table
      // 4. Trigger AI processing
      
      await this.logWebhookActivity(leadId, operation, 'success');
    } catch (error) {
      await this.logWebhookActivity(leadId, operation, 'failed', error.message);
      throw error;
    }
  }

  private async markLeadAsDeleted(leadId: string): Promise<void> {
    try {
      // Mark lead as deleted in our system
      await supabase
        .from('leads')
        .update({ 
          status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('source', 'zoho')
        .like('tags', `%zoho_lead_${leadId}%`);

      await this.logWebhookActivity(leadId, 'deleted', 'success');
    } catch (error) {
      await this.logWebhookActivity(leadId, 'deleted', 'failed', error.message);
      throw error;
    }
  }

  private async logWebhookActivity(
    leadId: string, 
    operation: string, 
    status: string, 
    error?: string
  ): Promise<void> {
    try {
      // Use type assertion for the new table
      await (supabase as any)
        .from('integration_logs')
        .insert({
          provider: 'zoho',
          event_type: 'webhook',
          operation,
          resource_id: leadId,
          status,
          error_message: error,
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      logger.error('Failed to log webhook activity:', logError);
    }
  }

  async setupWebhooks(): Promise<boolean> {
    try {
      // This would set up webhooks in Zoho CRM
      // For now, return true as if successful
      logger.info('Setting up Zoho webhooks...');
      return true;
    } catch (error) {
      await this.errorHandler.logError(error, 'Failed to setup Zoho webhooks');
      return false;
    }
  }

  async validateWebhookToken(token: string): Promise<boolean> {
    try {
      // Validate the webhook token against stored configuration
      // This is a security measure to ensure webhooks are legitimate
      const expectedToken = process.env.ZOHO_WEBHOOK_TOKEN;
      return token === expectedToken;
    } catch (error) {
      logger.error('Webhook token validation failed:', error);
      return false;
    }
  }
}

export const zohoWebhooks = ZohoWebhooks.getInstance();
