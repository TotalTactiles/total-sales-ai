import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  scopes: string[];
  authUrl?: string;
  connected: boolean;
  account?: string;
}

export interface OAuthConnectionStatus {
  provider: string;
  connected: boolean;
  email?: string;
  account?: string;
  accessToken?: string;
  lastSync?: Date;
}

export class UnifiedOAuthService {
  private static instance: UnifiedOAuthService;

  static getInstance(): UnifiedOAuthService {
    if (!UnifiedOAuthService.instance) {
      UnifiedOAuthService.instance = new UnifiedOAuthService();
    }
    return UnifiedOAuthService.instance;
  }

  async connectProvider(providerId: string): Promise<{ success: boolean; authUrl?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('unified-oauth', {
        body: { action: 'getAuthUrl', provider: providerId }
      });

      if (error) throw error;

      if (data.authUrl) {
        // Open OAuth window
        const authWindow = window.open(
          data.authUrl,
          `${providerId}-auth`,
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        return new Promise((resolve) => {
          const checkClosed = setInterval(() => {
            if (authWindow?.closed) {
              clearInterval(checkClosed);
              // Check connection status after window closes
              setTimeout(() => {
                this.checkConnectionStatus(providerId).then((status) => {
                  if (status.connected) {
                    toast.success(`${providerId} connected successfully!`);
                    resolve({ success: true });
                  } else {
                    toast.error(`${providerId} connection was not completed`);
                    resolve({ success: false });
                  }
                });
              }, 1000);
            }
          }, 1000);

          // Timeout after 5 minutes
          setTimeout(() => {
            clearInterval(checkClosed);
            if (authWindow && !authWindow.closed) {
              authWindow.close();
            }
            toast.error(`${providerId} connection timed out`);
            resolve({ success: false });
          }, 300000);
        });
      }

      return { success: false };
    } catch (error) {
      logger.error(`Failed to connect ${providerId}:`, error);
      toast.error(`Failed to connect ${providerId}`);
      return { success: false };
    }
  }

  async checkConnectionStatus(providerId: string): Promise<OAuthConnectionStatus> {
    try {
      const { data, error } = await supabase.functions.invoke('unified-oauth', {
        body: { action: 'checkStatus', provider: providerId }
      });

      if (error) throw error;

      return {
        provider: providerId,
        connected: data.connected || false,
        email: data.email,
        account: data.account,
        lastSync: data.lastSync ? new Date(data.lastSync) : undefined
      };
    } catch (error) {
      logger.error(`Failed to check ${providerId} status:`, error);
      return {
        provider: providerId,
        connected: false
      };
    }
  }

  async disconnectProvider(providerId: string): Promise<{ success: boolean }> {
    try {
      const { data, error } = await supabase.functions.invoke('unified-oauth', {
        body: { action: 'disconnect', provider: providerId }
      });

      if (error) throw error;

      toast.success(`${providerId} disconnected successfully`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to disconnect ${providerId}:`, error);
      toast.error(`Failed to disconnect ${providerId}`);
      return { success: false };
    }
  }

  async syncProviderData(providerId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('unified-oauth', {
        body: { action: 'sync', provider: providerId }
      });

      if (error) throw error;

      toast.success(`${providerId} data synced successfully`);
      return data;
    } catch (error) {
      logger.error(`Failed to sync ${providerId} data:`, error);
      toast.error(`Failed to sync ${providerId} data`);
      throw error;
    }
  }

  getProviderConfig(): OAuthProvider[] {
    return [
      {
        id: 'gmail',
        name: 'Gmail',
        icon: '📧',
        scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
        connected: false
      },
      {
        id: 'outlook',
        name: 'Outlook',
        icon: '📮',
        scopes: ['https://graph.microsoft.com/Mail.Read'],
        connected: false
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: '💼',
        scopes: ['r_liteprofile', 'r_organization_social'],
        connected: false
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: '📘',
        scopes: ['pages_read_engagement', 'pages_show_list'],
        connected: false
      },
      {
        id: 'twitter',
        name: 'Twitter/X',
        icon: '🐦',
        scopes: ['tweet.read', 'users.read'],
        connected: false
      },
      {
        id: 'instagram',
        name: 'Instagram',
        icon: '📷',
        scopes: ['instagram_basic', 'instagram_manage_insights'],
        connected: false
      }
    ];
  }
}

export const unifiedOAuthService = UnifiedOAuthService.getInstance();
