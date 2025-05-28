
export interface BaseIntegrationStatus {
  connected: boolean;
  lastSync?: Date;
  syncErrors: number;
  rateLimitStatus?: {
    limited: boolean;
    resetTime?: Date;
  };
}

export interface ZohoIntegrationStatus extends BaseIntegrationStatus {
  totalLeads: number;
}

export interface ClickUpIntegrationStatus extends BaseIntegrationStatus {
  totalTasks: number;
}

export interface BaseIntegrationService {
  getStatus(): Promise<BaseIntegrationStatus>;
  disconnect(): Promise<{ success: boolean; error?: string }>;
}

export interface ZohoIntegrationService extends BaseIntegrationService {
  getStatus(): Promise<ZohoIntegrationStatus>;
  connect(): Promise<{ success: boolean; authUrl?: string; error?: string }>;
  syncLeads(fullSync: boolean): Promise<{ success: boolean; synced: number; errors: number }>;
}

export interface ClickUpIntegrationService extends BaseIntegrationService {
  getStatus(): Promise<ClickUpIntegrationStatus>;
  connectWithOAuth(): Promise<{ success: boolean; authUrl?: string; error?: string }>;
  connectWithPersonalToken(token: string): Promise<{ success: boolean; error?: string }>;
  syncTasks(fullSync: boolean): Promise<{ success: boolean; synced: number; errors: number }>;
}

export type CRMIntegrationStatus = ZohoIntegrationStatus | ClickUpIntegrationStatus;
export type CRMIntegrationService = ZohoIntegrationService | ClickUpIntegrationService;
