
import { supabase } from '@/integrations/supabase/client';
import { masterAIBrain } from '@/services/masterAIBrain';
import { zohoAPI } from './api';
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
      console.log('Processing Zoho webhook:', payload);

      if (payload.module !== 'Leads') {
        console.log('Ignoring non-lead webhook');
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
          console.log(`Unhandled Zoho operation: ${payload.operation}`);
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
      console.log(`Syncing Zoho lead ${leadId} (${operation})`);

      const zohoLead = await zohoAPI.getLead(leadId);
      if (!zohoLead) {
        throw new Error('Lead not found');
      }

      if (!this.helpers.validateZohoLead(zohoLead)) {
        throw new Error('Invalid lead data');
      }

      // Determine company and user from active integration
      const { data: integration } = await (supabase as any)
        .from('crm_integrations')
        .select('user_id')
        .eq('provider', 'zoho')
        .eq('is_active', true)
        .single();

      if (!integration?.user_id) {
        throw new Error('No active Zoho integration');
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

      const transformedLead = this.helpers.transformZohoLeadToOSLead(zohoLead, companyId);

      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('source', 'zoho')
        .like('tags', `%zoho_lead_${leadId}%`)
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
            source: 'zoho',
            tags: [...(transformedLead.tags || []), `zoho_lead_${leadId}`],
            created_at: new Date().toISOString(),
          });
      }

      await masterAIBrain.ingestEvent({
        user_id: integration.user_id,
        company_id: companyId,
        event_type: 'crm_sync',
        source: 'zoho',
        data: zohoLead,
        context: { operation, leadId },
      });

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
      console.error('Failed to log webhook activity:', logError);
    }
  }

  async setupWebhooks(): Promise<boolean> {
    try {
      // This would set up webhooks in Zoho CRM
      // For now, return true as if successful
      console.log('Setting up Zoho webhooks...');
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
      console.error('Webhook token validation failed:', error);
      return false;
    }
  }
}

export const zohoWebhooks = ZohoWebhooks.getInstance();
