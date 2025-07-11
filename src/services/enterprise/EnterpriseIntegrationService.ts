
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { AccessControlService } from '@/services/security/accessControlService';
import { EncryptionService } from '@/services/security/encryptionService';

interface IntegrationConfig {
  id: string;
  name: string;
  type: 'crm' | 'erp' | 'marketing' | 'analytics' | 'communication' | 'storage';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  credentials: {
    encrypted: string;
    keyId: string;
  };
  endpoints: {
    baseUrl: string;
    authUrl?: string;
    webhookUrl?: string;
  };
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    burstLimit: number;
  };
  lastSync: Date;
  syncFrequency: number; // minutes
  healthCheck: {
    lastCheck: Date;
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
  };
}

interface SyncJob {
  id: string;
  integrationId: string;
  type: 'full' | 'incremental' | 'real-time';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  recordsProcessed: number;
  recordsErrored: number;
  metadata: Record<string, any>;
}

export class EnterpriseIntegrationService {
  private static instance: EnterpriseIntegrationService;
  private integrations: Map<string, IntegrationConfig> = new Map();
  private activeSyncs: Map<string, SyncJob> = new Map();
  private rateLimiters: Map<string, { count: number; resetTime: Date }> = new Map();

  static getInstance(): EnterpriseIntegrationService {
    if (!EnterpriseIntegrationService.instance) {
      EnterpriseIntegrationService.instance = new EnterpriseIntegrationService();
    }
    return EnterpriseIntegrationService.instance;
  }

  async initialize(): Promise<void> {
    logger.info('Initializing Enterprise Integration Service', {}, 'enterprise');
    
    try {
      await this.loadIntegrations();
      await this.startHealthCheckMonitoring();
      await this.startSyncScheduler();
      
      logger.info('Enterprise Integration Service initialized successfully', {}, 'enterprise');
    } catch (error) {
      logger.error('Failed to initialize Enterprise Integration Service:', error, 'enterprise');
      throw error;
    }
  }

  async registerIntegration(config: Omit<IntegrationConfig, 'id' | 'lastSync' | 'healthCheck'>): Promise<string> {
    const integrationId = `integration-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Encrypt credentials
    const encryptedCredentials = await EncryptionService.encryptSensitiveData(
      JSON.stringify(config.credentials)
    );

    const integration: IntegrationConfig = {
      ...config,
      id: integrationId,
      credentials: {
        encrypted: encryptedCredentials,
        keyId: 'default'
      },
      lastSync: new Date(),
      healthCheck: {
        lastCheck: new Date(),
        status: 'healthy',
        responseTime: 0
      }
    };

    this.integrations.set(integrationId, integration);

    // Store in database
    await supabase
      .from('enterprise_integrations')
      .insert({
        integration_id: integrationId,
        name: integration.name,
        type: integration.type,
        provider: integration.provider,
        status: integration.status,
        config: {
          endpoints: integration.endpoints,
          rateLimits: integration.rateLimits,
          syncFrequency: integration.syncFrequency
        },
        encrypted_credentials: encryptedCredentials,
        last_sync: integration.lastSync.toISOString(),
        health_status: integration.healthCheck.status
      });

    logger.info(`Integration registered: ${integration.name}`, { integrationId }, 'enterprise');
    return integrationId;
  }

  async executeSync(integrationId: string, syncType: 'full' | 'incremental' = 'incremental'): Promise<string> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error(`Integration not found: ${integrationId}`);
    }

    // Check rate limits
    if (!this.checkRateLimit(integrationId)) {
      throw new Error('Rate limit exceeded for integration');
    }

    const syncJob: SyncJob = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      integrationId,
      type: syncType,
      status: 'pending',
      startTime: new Date(),
      recordsProcessed: 0,
      recordsErrored: 0,
      metadata: {}
    };

    this.activeSyncs.set(syncJob.id, syncJob);

    try {
      syncJob.status = 'running';
      
      // Decrypt credentials
      const credentials = JSON.parse(
        await EncryptionService.decryptSensitiveData(integration.credentials.encrypted)
      );

      // Execute sync based on integration type
      const result = await this.performSync(integration, credentials, syncType);
      
      syncJob.status = 'completed';
      syncJob.endTime = new Date();
      syncJob.recordsProcessed = result.processed;
      syncJob.recordsErrored = result.errors;
      syncJob.metadata = result.metadata;

      // Update integration last sync
      integration.lastSync = new Date();
      await this.updateIntegrationStatus(integrationId, 'active');

      logger.info(`Sync completed: ${syncJob.id}`, {
        integrationId,
        recordsProcessed: result.processed,
        duration: syncJob.endTime.getTime() - syncJob.startTime.getTime()
      }, 'enterprise');

      return syncJob.id;

    } catch (error) {
      syncJob.status = 'failed';
      syncJob.endTime = new Date();
      
      await this.updateIntegrationStatus(integrationId, 'error');
      
      logger.error(`Sync failed: ${syncJob.id}`, error, 'enterprise');
      throw error;
    } finally {
      this.activeSyncs.delete(syncJob.id);
    }
  }

  private async performSync(
    integration: IntegrationConfig, 
    credentials: any, 
    syncType: string
  ): Promise<{ processed: number; errors: number; metadata: Record<string, any> }> {
    
    const startTime = Date.now();
    let processed = 0;
    let errors = 0;
    const metadata: Record<string, any> = {};

    try {
      switch (integration.type) {
        case 'crm':
          const crmResult = await this.syncCRMData(integration, credentials, syncType);
          processed = crmResult.processed;
          errors = crmResult.errors;
          metadata.crmSync = crmResult.metadata;
          break;

        case 'erp':
          const erpResult = await this.syncERPData(integration, credentials, syncType);
          processed = erpResult.processed;
          errors = erpResult.errors;
          metadata.erpSync = erpResult.metadata;
          break;

        case 'marketing':
          const marketingResult = await this.syncMarketingData(integration, credentials, syncType);
          processed = marketingResult.processed;
          errors = marketingResult.errors;
          metadata.marketingSync = marketingResult.metadata;
          break;

        default:
          throw new Error(`Unsupported integration type: ${integration.type}`);
      }

      metadata.syncDuration = Date.now() - startTime;
      metadata.syncType = syncType;
      
      return { processed, errors, metadata };

    } catch (error) {
      logger.error(`Sync error for ${integration.name}:`, error, 'enterprise');
      throw error;
    }
  }

  private async syncCRMData(integration: IntegrationConfig, credentials: any, syncType: string) {
    // Mock CRM sync implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      processed: Math.floor(Math.random() * 1000) + 100,
      errors: Math.floor(Math.random() * 10),
      metadata: {
        contacts: Math.floor(Math.random() * 500),
        deals: Math.floor(Math.random() * 200),
        activities: Math.floor(Math.random() * 300)
      }
    };
  }

  private async syncERPData(integration: IntegrationConfig, credentials: any, syncType: string) {
    // Mock ERP sync implementation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      processed: Math.floor(Math.random() * 500) + 50,
      errors: Math.floor(Math.random() * 5),
      metadata: {
        customers: Math.floor(Math.random() * 200),
        orders: Math.floor(Math.random() * 150),
        products: Math.floor(Math.random() * 100)
      }
    };
  }

  private async syncMarketingData(integration: IntegrationConfig, credentials: any, syncType: string) {
    // Mock Marketing sync implementation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      processed: Math.floor(Math.random() * 800) + 200,
      errors: Math.floor(Math.random() * 15),
      metadata: {
        campaigns: Math.floor(Math.random() * 50),
        leads: Math.floor(Math.random() * 400),
        events: Math.floor(Math.random() * 100)
      }
    };
  }

  private checkRateLimit(integrationId: string): boolean {
    const integration = this.integrations.get(integrationId);
    if (!integration) return false;

    const now = new Date();
    const rateLimiter = this.rateLimiters.get(integrationId);

    if (!rateLimiter || now > rateLimiter.resetTime) {
      this.rateLimiters.set(integrationId, {
        count: 1,
        resetTime: new Date(now.getTime() + 60000) // 1 minute
      });
      return true;
    }

    if (rateLimiter.count >= integration.rateLimits.requestsPerMinute) {
      return false;
    }

    rateLimiter.count++;
    return true;
  }

  private async loadIntegrations(): Promise<void> {
    try {
      const { data: integrations, error } = await supabase
        .from('enterprise_integrations')
        .select('*');

      if (error) throw error;

      for (const integration of integrations || []) {
        const config: IntegrationConfig = {
          id: integration.integration_id,
          name: integration.name,
          type: integration.type,
          provider: integration.provider,
          status: integration.status,
          credentials: {
            encrypted: integration.encrypted_credentials,
            keyId: 'default'
          },
          endpoints: integration.config.endpoints,
          rateLimits: integration.config.rateLimits,
          syncFrequency: integration.config.syncFrequency,
          lastSync: new Date(integration.last_sync),
          healthCheck: {
            lastCheck: new Date(),
            status: integration.health_status,
            responseTime: 0
          }
        };

        this.integrations.set(config.id, config);
      }

      logger.info(`Loaded ${this.integrations.size} integrations`, {}, 'enterprise');
    } catch (error) {
      logger.error('Failed to load integrations:', error, 'enterprise');
    }
  }

  private async startHealthCheckMonitoring(): Promise<void> {
    setInterval(async () => {
      for (const [id, integration] of this.integrations) {
        try {
          await this.performHealthCheck(integration);
        } catch (error) {
          logger.error(`Health check failed for ${integration.name}:`, error, 'enterprise');
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private async performHealthCheck(integration: IntegrationConfig): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Mock health check - in real implementation, ping the actual service
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const responseTime = Date.now() - startTime;
      integration.healthCheck = {
        lastCheck: new Date(),
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime
      };

      await this.updateIntegrationHealth(integration.id, integration.healthCheck.status);
      
    } catch (error) {
      integration.healthCheck = {
        lastCheck: new Date(),
        status: 'down',
        responseTime: Date.now() - startTime
      };

      await this.updateIntegrationHealth(integration.id, 'down');
      throw error;
    }
  }

  private async startSyncScheduler(): Promise<void> {
    setInterval(async () => {
      for (const [id, integration] of this.integrations) {
        if (integration.status !== 'active') continue;

        const timeSinceLastSync = Date.now() - integration.lastSync.getTime();
        const syncInterval = integration.syncFrequency * 60 * 1000; // Convert to milliseconds

        if (timeSinceLastSync >= syncInterval) {
          try {
            await this.executeSync(id, 'incremental');
          } catch (error) {
            logger.error(`Scheduled sync failed for ${integration.name}:`, error, 'enterprise');
          }
        }
      }
    }, 60 * 1000); // Check every minute
  }

  private async updateIntegrationStatus(integrationId: string, status: string): Promise<void> {
    await supabase
      .from('enterprise_integrations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('integration_id', integrationId);
  }

  private async updateIntegrationHealth(integrationId: string, healthStatus: string): Promise<void> {
    await supabase
      .from('enterprise_integrations')
      .update({ 
        health_status: healthStatus, 
        last_health_check: new Date().toISOString() 
      })
      .eq('integration_id', integrationId);
  }

  async getIntegrations(): Promise<IntegrationConfig[]> {
    return Array.from(this.integrations.values());
  }

  async getIntegration(id: string): Promise<IntegrationConfig | null> {
    return this.integrations.get(id) || null;
  }

  async getActiveSyncs(): Promise<SyncJob[]> {
    return Array.from(this.activeSyncs.values());
  }

  async getSyncHistory(integrationId?: string, limit: number = 50): Promise<SyncJob[]> {
    try {
      let query = supabase
        .from('integration_sync_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (integrationId) {
        query = query.eq('integration_id', integrationId);
      }

      const { data: jobs, error } = await query;
      if (error) throw error;

      return jobs?.map(job => ({
        id: job.sync_job_id,
        integrationId: job.integration_id,
        type: job.sync_type,
        status: job.status,
        startTime: new Date(job.started_at),
        endTime: job.completed_at ? new Date(job.completed_at) : undefined,
        recordsProcessed: job.records_processed || 0,
        recordsErrored: job.records_errored || 0,
        metadata: job.metadata || {}
      })) || [];

    } catch (error) {
      logger.error('Failed to get sync history:', error, 'enterprise');
      return [];
    }
  }
}

export const enterpriseIntegrationService = EnterpriseIntegrationService.getInstance();
