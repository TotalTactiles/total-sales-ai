
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export interface CRMIntegration {
  id: string;
  name: string;
  type: 'zoho' | 'clickup' | 'salesforce' | 'hubspot';
  isConnected: boolean;
  lastSync?: string;
  credentials?: any;
}

export interface CRMSyncResult {
  success: boolean;
  leadsImported: number;
  tasksImported: number;
  errors: string[];
}

export class CRMIntegrationService {
  private static instance: CRMIntegrationService;
  private integrations: CRMIntegration[] = [];

  static getInstance(): CRMIntegrationService {
    if (!CRMIntegrationService.instance) {
      CRMIntegrationService.instance = new CRMIntegrationService();
    }
    return CRMIntegrationService.instance;
  }

  async getIntegrations(): Promise<CRMIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      this.integrations = data || [];
      return this.integrations;
    } catch (error) {
      logger.error('Failed to fetch CRM integrations', error, 'crm');
      return [];
    }
  }

  async connectZohoCRM(credentials: { clientId: string; clientSecret: string; refreshToken: string }): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('zoho-crm-connect', {
        body: { credentials }
      });

      if (error) throw error;

      if (data.success) {
        await this.saveIntegration({
          name: 'Zoho CRM',
          type: 'zoho',
          isConnected: true,
          credentials: data.encryptedCredentials
        });
        
        toast.success('Zoho CRM connected successfully');
        logger.info('Zoho CRM integration connected', {}, 'crm');
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Failed to connect Zoho CRM', error, 'crm');
      toast.error('Failed to connect Zoho CRM');
      return false;
    }
  }

  async connectClickUp(apiKey: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('clickup-connect', {
        body: { apiKey }
      });

      if (error) throw error;

      if (data.success) {
        await this.saveIntegration({
          name: 'ClickUp',
          type: 'clickup',
          isConnected: true,
          credentials: data.encryptedCredentials
        });
        
        toast.success('ClickUp connected successfully');
        logger.info('ClickUp integration connected', {}, 'crm');
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Failed to connect ClickUp', error, 'crm');
      toast.error('Failed to connect ClickUp');
      return false;
    }
  }

  async syncCRMData(integrationId: string): Promise<CRMSyncResult> {
    try {
      const integration = this.integrations.find(i => i.id === integrationId);
      if (!integration) {
        throw new Error('Integration not found');
      }

      const { data, error } = await supabase.functions.invoke('crm-sync', {
        body: { 
          integrationId,
          integrationType: integration.type 
        }
      });

      if (error) throw error;

      const result: CRMSyncResult = {
        success: data.success,
        leadsImported: data.leadsImported || 0,
        tasksImported: data.tasksImported || 0,
        errors: data.errors || []
      };

      if (result.success) {
        toast.success(`Synced ${result.leadsImported} leads and ${result.tasksImported} tasks`);
        logger.info('CRM sync completed', result, 'crm');
      } else {
        toast.error('CRM sync completed with errors');
      }

      return result;
    } catch (error) {
      logger.error('CRM sync failed', error, 'crm');
      toast.error('CRM sync failed');
      return {
        success: false,
        leadsImported: 0,
        tasksImported: 0,
        errors: [error.message || 'Unknown error']
      };
    }
  }

  async disconnectIntegration(integrationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('crm_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;

      this.integrations = this.integrations.filter(i => i.id !== integrationId);
      toast.success('Integration disconnected');
      logger.info('CRM integration disconnected', { integrationId }, 'crm');
      return true;
    } catch (error) {
      logger.error('Failed to disconnect integration', error, 'crm');
      toast.error('Failed to disconnect integration');
      return false;
    }
  }

  private async saveIntegration(integration: Omit<CRMIntegration, 'id'>): Promise<void> {
    const { data, error } = await supabase
      .from('crm_integrations')
      .insert({
        ...integration,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;

    this.integrations.push(data);
  }

  getConnectedIntegrations(): CRMIntegration[] {
    return this.integrations.filter(i => i.isConnected);
  }
}

export const crmIntegrationService = CRMIntegrationService.getInstance();
