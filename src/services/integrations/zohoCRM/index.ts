
import { zohoAuth } from './auth';
import { zohoAPI } from './api';
import { zohoWebhooks } from './webhooks';
import { ZohoHelpers } from './helpers';
import { ZohoErrorHandler } from './errorHandler';
import { supabase } from '@/integrations/supabase/client';

export interface ZohoIntegrationStatus {
  connected: boolean;
  lastSync?: Date;
  totalLeads: number;
  syncErrors: number;
  rateLimitStatus?: {
    limited: boolean;
    resetTime?: Date;
  };
}

export class ZohoCRMIntegration {
  private static instance: ZohoCRMIntegration;
  private helpers = new ZohoHelpers();
  private errorHandler = new ZohoErrorHandler();
  private syncInterval?: NodeJS.Timeout;

  static getInstance(): ZohoCRMIntegration {
    if (!ZohoCRMIntegration.instance) {
      ZohoCRMIntegration.instance = new ZohoCRMIntegration();
    }
    return ZohoCRMIntegration.instance;
  }

  async getStatus(): Promise<ZohoIntegrationStatus> {
    try {
      const connected = await zohoAuth.isAuthenticated();
      
      if (!connected) {
        return {
          connected: false,
          totalLeads: 0,
          syncErrors: 0
        };
      }

      // Get sync statistics
      const { data: syncData } = await supabase
        .from('integration_logs')
        .select('*')
        .eq('provider', 'zoho')
        .order('created_at', { ascending: false })
        .limit(1);

      const { data: errorData, count: errorCount } = await supabase
        .from('error_logs')
        .select('*', { count: 'exact' })
        .eq('provider', 'zoho')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: leadsData, count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .eq('source', 'zoho');

      return {
        connected: true,
        lastSync: syncData?.[0] ? new Date(syncData[0].created_at) : undefined,
        totalLeads: totalLeads || 0,
        syncErrors: errorCount || 0
      };
    } catch (error) {
      console.error('Error getting Zoho integration status:', error);
      return {
        connected: false,
        totalLeads: 0,
        syncErrors: 0
      };
    }
  }

  async connect(): Promise<{ success: boolean; authUrl?: string; error?: string }> {
    try {
      const authUrl = zohoAuth.generateAuthUrl();
      return {
        success: true,
        authUrl
      };
    } catch (error) {
      await this.errorHandler.logError(error, 'Connection initiation');
      return {
        success: false,
        error: error.message || 'Failed to initiate Zoho connection'
      };
    }
  }

  async handleAuthCallback(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      await zohoAuth.exchangeCodeForTokens(code);
      
      // Test the connection
      const connectionTest = await zohoAPI.testConnection();
      if (!connectionTest) {
        throw new Error('Connection test failed');
      }

      // Setup webhooks
      await zohoWebhooks.setupWebhooks();

      // Start automatic sync
      this.startAutoSync();

      return { success: true };
    } catch (error) {
      await this.errorHandler.handleConnectionError(error);
      return {
        success: false,
        error: error.message || 'Failed to complete Zoho authentication'
      };
    }
  }

  async disconnect(): Promise<{ success: boolean; error?: string }> {
    try {
      await zohoAuth.disconnect();
      this.stopAutoSync();
      
      return { success: true };
    } catch (error) {
      await this.errorHandler.logError(error, 'Disconnection');
      return {
        success: false,
        error: error.message || 'Failed to disconnect from Zoho'
      };
    }
  }

  async syncLeads(fullSync: boolean = false): Promise<{ success: boolean; synced: number; errors: number }> {
    try {
      console.log('Starting Zoho lead sync...');
      
      let syncedCount = 0;
      let errorCount = 0;
      
      // Get the last sync time for incremental sync
      const lastSyncTime = fullSync ? undefined : await this.getLastSyncTime();
      
      // Fetch leads from Zoho
      const leads = await zohoAPI.getRecentLeads(lastSyncTime);
      
      console.log(`Found ${leads.length} leads to sync from Zoho`);
      
      // Get current user's company ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) {
        throw new Error('User company not found');
      }

      // Process each lead
      for (const zohoLead of leads) {
        try {
          // Validate and transform the lead
          if (!this.helpers.validateZohoLead(zohoLead)) {
            console.warn('Invalid Zoho lead data:', zohoLead);
            errorCount++;
            continue;
          }

          const transformedLead = this.helpers.transformZohoLeadToOSLead(zohoLead, profile.company_id);
          
          // Check if lead already exists
          const { data: existingLead } = await supabase
            .from('leads')
            .select('id')
            .eq('source_id', zohoLead.id)
            .eq('source', 'zoho')
            .single();

          if (existingLead) {
            // Update existing lead
            await supabase
              .from('leads')
              .update({
                ...transformedLead,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingLead.id);
          } else {
            // Create new lead
            await supabase
              .from('leads')
              .insert({
                ...transformedLead,
                source_id: zohoLead.id,
                source: 'zoho'
              });
          }

          syncedCount++;
        } catch (leadError) {
          console.error(`Error syncing lead ${zohoLead.id}:`, leadError);
          await this.errorHandler.handleSyncError(zohoLead.id, leadError);
          errorCount++;
        }
      }

      // Update last sync time
      await this.updateLastSyncTime();

      console.log(`Zoho sync completed: ${syncedCount} synced, ${errorCount} errors`);

      return {
        success: true,
        synced: syncedCount,
        errors: errorCount
      };
    } catch (error) {
      console.error('Zoho sync failed:', error);
      await this.errorHandler.logError(error, 'Lead sync');
      return {
        success: false,
        synced: 0,
        errors: 1
      };
    }
  }

  private async getLastSyncTime(): Promise<Date | undefined> {
    try {
      const { data } = await supabase
        .from('integration_sync_status')
        .select('last_sync')
        .eq('provider', 'zoho')
        .single();

      return data?.last_sync ? new Date(data.last_sync) : undefined;
    } catch {
      return undefined;
    }
  }

  private async updateLastSyncTime(): Promise<void> {
    try {
      await supabase
        .from('integration_sync_status')
        .upsert({
          provider: 'zoho',
          last_sync: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to update last sync time:', error);
    }
  }

  startAutoSync(intervalMinutes: number = 15): void {
    this.stopAutoSync(); // Clear any existing interval
    
    this.syncInterval = setInterval(async () => {
      console.log('Running automated Zoho sync...');
      await this.syncLeads(false);
    }, intervalMinutes * 60 * 1000);

    console.log(`Zoho auto-sync started with ${intervalMinutes}-minute intervals`);
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
      console.log('Zoho auto-sync stopped');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      return await zohoAPI.testConnection();
    } catch (error) {
      await this.errorHandler.handleConnectionError(error);
      return false;
    }
  }
}

export const zohoCRMIntegration = ZohoCRMIntegration.getInstance();

// Export all the individual components
export { zohoAuth } from './auth';
export { zohoAPI } from './api';
export { zohoWebhooks } from './webhooks';
export { ZohoHelpers } from './helpers';
export { ZohoErrorHandler } from './errorHandler';
