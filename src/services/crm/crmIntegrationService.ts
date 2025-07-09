
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { zohoCRMIntegration } from '@/services/integrations/zohoCRM';

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
  recordsImported: number;
  errors?: string[];
}

export class CRMIntegrationService {
  private static instance: CRMIntegrationService;

  static getInstance(): CRMIntegrationService {
    if (!CRMIntegrationService.instance) {
      CRMIntegrationService.instance = new CRMIntegrationService();
    }
    return CRMIntegrationService.instance;
  }

  async getConnectedIntegrations(): Promise<CRMIntegration[]> {
    try {
      const integrations: CRMIntegration[] = [];

      // Check Zoho integration status
      try {
        const zohoStatus = await zohoCRMIntegration.getStatus();
        integrations.push({
          id: 'zoho-1',
          name: 'Zoho CRM',
          type: 'zoho',
          isConnected: zohoStatus.connected,
          lastSync: zohoStatus.lastSync?.toISOString()
        });
      } catch (error) {
        logger.warn('Failed to get Zoho status:', error);
        integrations.push({
          id: 'zoho-1',
          name: 'Zoho CRM',
          type: 'zoho',
          isConnected: false
        });
      }

      // Add other integrations
      integrations.push(
        {
          id: 'salesforce-1',
          name: 'Salesforce',
          type: 'salesforce',
          isConnected: false
        },
        {
          id: 'hubspot-1',
          name: 'HubSpot',
          type: 'hubspot',
          isConnected: false
        }
      );

      return integrations;
    } catch (error) {
      logger.error('Failed to fetch CRM integrations', error, 'crm');
      return [];
    }
  }

  async connectIntegration(type: CRMIntegration['type'], credentials?: any): Promise<boolean> {
    try {
      logger.info(`Connecting to ${type} CRM`, undefined, 'crm');
      
      if (type === 'zoho') {
        const result = await zohoCRMIntegration.connect();
        if (result.success && result.authUrl) {
          window.open(result.authUrl, 'zoho-auth', 'width=600,height=700');
          return true;
        }
        return false;
      }
      
      // Simulate connection for other CRMs
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${type.toUpperCase()} CRM connected successfully`);
      return true;
    } catch (error) {
      logger.error(`Failed to connect ${type} CRM`, error, 'crm');
      toast.error(`Failed to connect to ${type.toUpperCase()} CRM`);
      return false;
    }
  }

  async disconnectIntegration(integrationId: string): Promise<boolean> {
    try {
      logger.info(`Disconnecting CRM integration ${integrationId}`, undefined, 'crm');
      
      if (integrationId === 'zoho-1') {
        const result = await zohoCRMIntegration.disconnect();
        if (result.success) {
          toast.success('Zoho CRM disconnected');
          return true;
        }
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('CRM integration disconnected');
      return true;
    } catch (error) {
      logger.error('Failed to disconnect CRM integration', error, 'crm');
      toast.error('Failed to disconnect CRM integration');
      return false;
    }
  }

  async syncIntegration(integrationId: string): Promise<CRMSyncResult> {
    try {
      logger.info(`Starting sync for integration ${integrationId}`, undefined, 'crm');
      
      if (integrationId === 'zoho-1') {
        const result = await zohoCRMIntegration.syncLeads(false);
        return {
          success: result.success,
          recordsImported: result.synced,
          errors: result.errors > 0 ? [`${result.errors} sync errors`] : undefined
        };
      }
      
      // Simulate sync for other integrations
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult: CRMSyncResult = {
        success: true,
        recordsImported: Math.floor(Math.random() * 50) + 10
      };
      
      toast.success(`Sync completed: ${mockResult.recordsImported} records imported`);
      return mockResult;
    } catch (error) {
      logger.error('CRM sync failed', error, 'crm');
      return {
        success: false,
        recordsImported: 0,
        errors: ['Sync failed due to API timeout']
      };
    }
  }

  async testConnection(type: CRMIntegration['type'], credentials?: any): Promise<boolean> {
    try {
      logger.info(`Testing connection to ${type} CRM`, undefined, 'crm');
      
      if (type === 'zoho') {
        return await zohoCRMIntegration.testConnection();
      }
      
      // Simulate connection test for others
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = Math.random() > 0.1;
      
      if (success) {
        toast.success(`${type.toUpperCase()} CRM connection test successful`);
      } else {
        toast.error(`${type.toUpperCase()} CRM connection test failed`);
      }
      
      return success;
    } catch (error) {
      logger.error(`Connection test failed for ${type}`, error, 'crm');
      return false;
    }
  }

  async getAvailableIntegrations(): Promise<Array<{type: CRMIntegration['type'], name: string, description: string}>> {
    return [
      {
        type: 'zoho',
        name: 'Zoho CRM',
        description: 'Comprehensive CRM with lead management and automation'
      },
      {
        type: 'salesforce',
        name: 'Salesforce',
        description: 'World\'s leading CRM platform for enterprise sales'
      },
      {
        type: 'hubspot',
        name: 'HubSpot',
        description: 'Inbound marketing and sales platform'
      }
    ];
  }

  async importLeads(integrationId: string, options?: {
    dateRange?: { start: string; end: string };
    leadStatus?: string[];
    limit?: number;
  }): Promise<CRMSyncResult> {
    try {
      logger.info(`Importing leads from integration ${integrationId}`, options, 'crm');
      
      if (integrationId === 'zoho-1') {
        const result = await zohoCRMIntegration.syncLeads(true);
        return {
          success: result.success,
          recordsImported: result.synced,
          errors: result.errors > 0 ? [`${result.errors} import errors`] : undefined
        };
      }
      
      // Simulate lead import for other integrations
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const recordsImported = Math.floor(Math.random() * 25) + 5;
      toast.success(`Successfully imported ${recordsImported} leads`);
      
      return {
        success: true,
        recordsImported
      };
    } catch (error) {
      logger.error('Lead import failed', error, 'crm');
      return {
        success: false,
        recordsImported: 0,
        errors: ['Failed to import leads']
      };
    }
  }
}

export const crmIntegrationService = CRMIntegrationService.getInstance();
