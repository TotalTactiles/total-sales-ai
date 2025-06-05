import { logger } from '@/utils/logger';

import { clickUpAuth } from './auth';
import { clickUpAPI } from './api';
import { clickUpWebhooks } from './webhooks';
import { ClickUpHelpers } from './helpers';
import { ClickUpErrorHandler } from './errorHandler';
import { supabase } from '@/integrations/supabase/client';

export interface ClickUpIntegrationStatus {
  connected: boolean;
  lastSync?: Date;
  totalTasks: number;
  syncErrors: number;
  rateLimitStatus?: {
    limited: boolean;
    resetTime?: Date;
  };
}

export class ClickUpCRMIntegration {
  private static instance: ClickUpCRMIntegration;
  private helpers = new ClickUpHelpers();
  private errorHandler = new ClickUpErrorHandler();
  private syncInterval?: NodeJS.Timeout;
  private trackedListIds: string[] = [];

  static getInstance(): ClickUpCRMIntegration {
    if (!ClickUpCRMIntegration.instance) {
      ClickUpCRMIntegration.instance = new ClickUpCRMIntegration();
    }
    return ClickUpCRMIntegration.instance;
  }

  async getStatus(): Promise<ClickUpIntegrationStatus> {
    try {
      const connected = await clickUpAuth.isAuthenticated();
      
      if (!connected) {
        return {
          connected: false,
          totalTasks: 0,
          syncErrors: 0
        };
      }

      // Use type assertion for new tables
      const { data: syncData } = await (supabase as any)
        .from('integration_logs')
        .select('*')
        .eq('provider', 'clickup')
        .order('created_at', { ascending: false })
        .limit(1);

      const { data: errorData, count: errorCount } = await (supabase as any)
        .from('error_logs')
        .select('*', { count: 'exact' })
        .eq('provider', 'clickup')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: leadsData, count: totalTasks } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .eq('source', 'clickup');

      return {
        connected: true,
        lastSync: syncData?.[0] ? new Date(syncData[0].created_at) : undefined,
        totalTasks: totalTasks || 0,
        syncErrors: errorCount || 0
      };
    } catch (error) {
      logger.error('Error getting ClickUp integration status:', error);
      return {
        connected: false,
        totalTasks: 0,
        syncErrors: 0
      };
    }
  }

  async connectWithOAuth(): Promise<{ success: boolean; authUrl?: string; error?: string }> {
    try {
      const authUrl = clickUpAuth.generateAuthUrl();
      return {
        success: true,
        authUrl
      };
    } catch (error) {
      await this.errorHandler.logError(error, 'OAuth connection initiation');
      return {
        success: false,
        error: error.message || 'Failed to initiate ClickUp OAuth connection'
      };
    }
  }

  async connectWithPersonalToken(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      await clickUpAuth.setPersonalAccessToken(token);
      
      const connectionTest = await clickUpAPI.testConnection();
      if (!connectionTest) {
        throw new Error('Connection test failed');
      }

      await this.discoverAndSetupLists();
      this.startAutoSync();

      return { success: true };
    } catch (error) {
      await this.errorHandler.handleConnectionError(error);
      return {
        success: false,
        error: error.message || 'Failed to connect with Personal Access Token'
      };
    }
  }

  async handleAuthCallback(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      await clickUpAuth.exchangeCodeForTokens(code);
      
      const connectionTest = await clickUpAPI.testConnection();
      if (!connectionTest) {
        throw new Error('Connection test failed');
      }

      await this.discoverAndSetupLists();
      this.startAutoSync();

      return { success: true };
    } catch (error) {
      await this.errorHandler.handleConnectionError(error);
      return {
        success: false,
        error: error.message || 'Failed to complete ClickUp authentication'
      };
    }
  }

  private async discoverAndSetupLists(): Promise<void> {
    try {
      logger.info('Discovering ClickUp workspaces and lists...');
      
      const teams = await clickUpAPI.getTeams();
      let allLists: any[] = [];

      for (const team of teams) {
        const spaces = await clickUpAPI.getSpaces(team.id);
        
        for (const space of spaces) {
          const lists = await clickUpAPI.getLists(space.id);
          allLists = allLists.concat(lists);
        }
      }

      // Identify lists that might contain leads
      const leadLists = this.helpers.identifyLeadLists(allLists);
      this.trackedListIds = leadLists.map(list => list.id);

      logger.info(`Found ${leadLists.length} potential lead lists:`, leadLists.map(l => l.name));

      // Setup webhooks for lead lists
      if (this.trackedListIds.length > 0) {
        await clickUpWebhooks.setupWebhooks(this.trackedListIds);
      }
    } catch (error) {
      logger.error('Error discovering ClickUp lists:', error);
      throw error;
    }
  }

  async disconnect(): Promise<{ success: boolean; error?: string }> {
    try {
      await clickUpAuth.disconnect();
      this.stopAutoSync();
      this.trackedListIds = [];
      
      return { success: true };
    } catch (error) {
      await this.errorHandler.logError(error, 'Disconnection');
      return {
        success: false,
        error: error.message || 'Failed to disconnect from ClickUp'
      };
    }
  }

  async syncTasks(fullSync: boolean = false): Promise<{ success: boolean; synced: number; errors: number }> {
    try {
      logger.info('Starting ClickUp task sync...');
      
      if (this.trackedListIds.length === 0) {
        logger.warn('No tracked lists found for ClickUp sync');
        return { success: true, synced: 0, errors: 0 };
      }

      let syncedCount = 0;
      let errorCount = 0;
      
      const lastSyncTime = fullSync ? undefined : await this.getLastSyncTime();
      const tasks = await clickUpAPI.getRecentTasks(this.trackedListIds, lastSyncTime);
      
      logger.info(`Found ${tasks.length} tasks to sync from ClickUp`);
      
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

      for (const task of tasks) {
        try {
          if (!this.helpers.validateClickUpTask(task)) {
            logger.warn('Invalid ClickUp task data:', task);
            errorCount++;
            continue;
          }

          const transformedLead = this.helpers.transformClickUpTaskToOSLead(task, profile.company_id);
          
          const { data: existingLead } = await supabase
            .from('leads')
            .select('id')
            .eq('source', 'clickup')
            .like('tags', `%clickup_task_${task.id}%`)
            .single();

          if (existingLead) {
            await supabase
              .from('leads')
              .update({
                ...transformedLead,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingLead.id);
          } else {
            await supabase
              .from('leads')
              .insert({
                ...transformedLead,
                source: 'clickup',
                tags: [...(transformedLead.tags || []), `clickup_task_${task.id}`]
              });
          }

          syncedCount++;
        } catch (taskError) {
          logger.error(`Error syncing task ${task.id}:`, taskError);
          await this.errorHandler.handleSyncError(task.id, taskError);
          errorCount++;
        }
      }

      await this.updateLastSyncTime();

      logger.info(`ClickUp sync completed: ${syncedCount} synced, ${errorCount} errors`);

      return {
        success: true,
        synced: syncedCount,
        errors: errorCount
      };
    } catch (error) {
      logger.error('ClickUp sync failed:', error);
      await this.errorHandler.logError(error, 'Task sync');
      return {
        success: false,
        synced: 0,
        errors: 1
      };
    }
  }

  private async getLastSyncTime(): Promise<Date | undefined> {
    try {
      // Use type assertion for new table
      const { data } = await (supabase as any)
        .from('integration_sync_status')
        .select('last_sync')
        .eq('provider', 'clickup')
        .single();

      return data?.last_sync ? new Date(data.last_sync) : undefined;
    } catch {
      return undefined;
    }
  }

  private async updateLastSyncTime(): Promise<void> {
    try {
      // Use type assertion for new table
      await (supabase as any)
        .from('integration_sync_status')
        .upsert({
          provider: 'clickup',
          last_sync: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      logger.error('Failed to update last sync time:', error);
    }
  }

  startAutoSync(intervalMinutes: number = 15): void {
    this.stopAutoSync();
    
    this.syncInterval = setInterval(async () => {
      logger.info('Running automated ClickUp sync...');
      await this.syncTasks(false);
    }, intervalMinutes * 60 * 1000);

    logger.info(`ClickUp auto-sync started with ${intervalMinutes}-minute intervals`);
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
      logger.info('ClickUp auto-sync stopped');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      return await clickUpAPI.testConnection();
    } catch (error) {
      await this.errorHandler.handleConnectionError(error);
      return false;
    }
  }

  getTrackedListIds(): string[] {
    return [...this.trackedListIds];
  }

  async setTrackedLists(listIds: string[]): Promise<void> {
    this.trackedListIds = [...listIds];
    
    // Setup webhooks for new lists
    if (this.trackedListIds.length > 0) {
      await clickUpWebhooks.setupWebhooks(this.trackedListIds);
    }
  }
}

export const clickUpCRMIntegration = ClickUpCRMIntegration.getInstance();

export { clickUpAuth } from './auth';
export { clickUpAPI } from './api';
export { clickUpWebhooks } from './webhooks';
export { ClickUpHelpers } from './helpers';
export { ClickUpErrorHandler } from './errorHandler';
