
import { toast } from 'sonner';
import { zohoCRMIntegration } from './zohoCRM';
import { clickUpCRMIntegration } from './clickupCRM';
import { realTimeLeadSync } from './realTimeLeadSync';
import { crmDataMapper } from './crmDataMapper';

export interface CRMProvider {
  id: string;
  name: string;
  service: any;
  isActive: boolean;
}

export class CRMOrchestrator {
  private static instance: CRMOrchestrator;
  private providers: CRMProvider[] = [];
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): CRMOrchestrator {
    if (!CRMOrchestrator.instance) {
      CRMOrchestrator.instance = new CRMOrchestrator();
    }
    return CRMOrchestrator.instance;
  }

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    this.providers = [
      {
        id: 'zoho',
        name: 'Zoho CRM',
        service: zohoCRMIntegration,
        isActive: false
      },
      {
        id: 'clickup',
        name: 'ClickUp',
        service: clickUpCRMIntegration,
        isActive: false
      }
    ];
  }

  async initializeAllIntegrations(companyId: string): Promise<void> {
    console.log('🚀 Initializing CRM integrations for company:', companyId);

    for (const provider of this.providers) {
      try {
        const status = await provider.service.getStatus();
        provider.isActive = status.connected;
        
        if (provider.isActive) {
          console.log(`✅ ${provider.name} is connected and active`);
          
          // Start auto-sync for connected providers
          this.startAutoSync(provider.id, companyId);
        } else {
          console.log(`⚠️ ${provider.name} is not connected`);
        }
      } catch (error) {
        console.error(`❌ Error checking ${provider.name} status:`, error);
        provider.isActive = false;
      }
    }

    // Enable real-time sync
    await realTimeLeadSync.enableRealTimeSync(companyId);
    
    console.log('🎯 CRM orchestrator initialization complete');
  }

  async connectProvider(providerId: string): Promise<{ success: boolean; authUrl?: string; error?: string }> {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) {
      return { success: false, error: 'Provider not found' };
    }

    try {
      const result = await provider.service.connect();
      
      if (result.success) {
        provider.isActive = true;
        toast.success(`${provider.name} connection initiated`);
      }
      
      return result;
    } catch (error) {
      console.error(`Error connecting ${provider.name}:`, error);
      return { success: false, error: error.message };
    }
  }

  async disconnectProvider(providerId: string): Promise<{ success: boolean; error?: string }> {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) {
      return { success: false, error: 'Provider not found' };
    }

    try {
      const result = await provider.service.disconnect();
      
      if (result.success) {
        provider.isActive = false;
        this.stopAutoSync(providerId);
        toast.success(`${provider.name} disconnected`);
      }
      
      return result;
    } catch (error) {
      console.error(`Error disconnecting ${provider.name}:`, error);
      return { success: false, error: error.message };
    }
  }

  async syncProvider(providerId: string, companyId: string, fullSync: boolean = false): Promise<any> {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider || !provider.isActive) {
      throw new Error(`Provider ${providerId} not found or not active`);
    }

    try {
      console.log(`🔄 Starting sync for ${provider.name}...`);
      
      let syncResult;
      if (providerId === 'zoho') {
        syncResult = await provider.service.syncLeads(fullSync);
      } else if (providerId === 'clickup') {
        syncResult = await provider.service.syncTasks(fullSync);
      } else {
        throw new Error(`Sync not implemented for ${providerId}`);
      }

      console.log(`✅ ${provider.name} sync completed:`, syncResult);
      return syncResult;
    } catch (error) {
      console.error(`❌ Error syncing ${provider.name}:`, error);
      throw error;
    }
  }

  async syncAllProviders(companyId: string): Promise<{ success: boolean; results: any[] }> {
    const results = [];
    let overallSuccess = true;

    console.log('🔄 Starting sync for all active providers...');

    for (const provider of this.providers) {
      if (!provider.isActive) {
        console.log(`⏭️ Skipping ${provider.name} - not active`);
        continue;
      }

      try {
        const result = await this.syncProvider(provider.id, companyId, false);
        results.push({
          provider: provider.name,
          success: true,
          result
        });
      } catch (error) {
        console.error(`❌ Failed to sync ${provider.name}:`, error);
        results.push({
          provider: provider.name,
          success: false,
          error: error.message
        });
        overallSuccess = false;
      }
    }

    console.log('🎯 All provider sync completed. Overall success:', overallSuccess);
    return { success: overallSuccess, results };
  }

  private startAutoSync(providerId: string, companyId: string, intervalMinutes: number = 15): void {
    // Clear any existing interval
    this.stopAutoSync(providerId);

    const interval = setInterval(async () => {
      try {
        console.log(`⏰ Auto-sync triggered for ${providerId}`);
        await this.syncProvider(providerId, companyId, false);
      } catch (error) {
        console.error(`❌ Auto-sync failed for ${providerId}:`, error);
      }
    }, intervalMinutes * 60 * 1000);

    this.syncIntervals.set(providerId, interval);
    console.log(`⚡ Auto-sync started for ${providerId} (${intervalMinutes}min intervals)`);
  }

  private stopAutoSync(providerId: string): void {
    const interval = this.syncIntervals.get(providerId);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(providerId);
      console.log(`⏹️ Auto-sync stopped for ${providerId}`);
    }
  }

  getProviderStatus(): CRMProvider[] {
    return [...this.providers];
  }

  getActiveProviders(): CRMProvider[] {
    return this.providers.filter(p => p.isActive);
  }

  async testAllConnections(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};

    for (const provider of this.providers) {
      try {
        results[provider.id] = await provider.service.testConnection();
      } catch (error) {
        console.error(`Connection test failed for ${provider.name}:`, error);
        results[provider.id] = false;
      }
    }

    return results;
  }

  // Future CRM integration method
  async addCustomCRM(config: {
    id: string;
    name: string;
    apiUrl: string;
    authType: 'oauth' | 'api_key' | 'basic';
    mappingConfig: any;
  }): Promise<void> {
    // This method would allow adding future CRMs dynamically
    console.log('🔮 Custom CRM integration coming soon:', config.name);
    toast.info(`${config.name} integration will be available soon`);
  }
}

export const crmOrchestrator = CRMOrchestrator.getInstance();
