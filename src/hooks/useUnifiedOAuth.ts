import { logger } from '@/utils/logger';

import { useState, useEffect, useCallback } from 'react';
import { unifiedOAuthService, OAuthProvider, OAuthConnectionStatus } from '@/services/oauth/unifiedOAuthService';
import { useAuth } from '@/contexts/AuthContext';

export const useUnifiedOAuth = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, OAuthConnectionStatus>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadProviders = useCallback(async () => {
    if (!user) return;

    const providerConfigs = unifiedOAuthService.getProviderConfig();
    setProviders(providerConfigs);

    // Check connection status for each provider
    const statuses: Record<string, OAuthConnectionStatus> = {};
    
    for (const provider of providerConfigs) {
      try {
        const status = await unifiedOAuthService.checkConnectionStatus(provider.id);
        statuses[provider.id] = status;
      } catch (error) {
        logger.error(`Failed to check ${provider.id} status:`, error);
        statuses[provider.id] = { provider: provider.id, connected: false };
      }
    }
    
    setConnectionStatuses(statuses);
    
    // Update provider connected status
    const updatedProviders = providerConfigs.map(provider => ({
      ...provider,
      connected: statuses[provider.id]?.connected || false,
      account: statuses[provider.id]?.account
    }));
    
    setProviders(updatedProviders);
  }, [user]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const connectProvider = useCallback(async (providerId: string) => {
    setIsLoading(true);
    try {
      const result = await unifiedOAuthService.connectProvider(providerId);
      if (result.success) {
        await loadProviders(); // Refresh providers after successful connection
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [loadProviders]);

  const disconnectProvider = useCallback(async (providerId: string) => {
    setIsLoading(true);
    try {
      const result = await unifiedOAuthService.disconnectProvider(providerId);
      if (result.success) {
        await loadProviders(); // Refresh providers after disconnection
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [loadProviders]);

  const syncProvider = useCallback(async (providerId: string) => {
    try {
      const result = await unifiedOAuthService.syncProviderData(providerId);
      await loadProviders(); // Refresh providers after sync
      return result;
    } catch (error) {
      throw error;
    }
  }, [loadProviders]);

  const getConnectionStatus = useCallback((providerId: string) => {
    return connectionStatuses[providerId] || { provider: providerId, connected: false };
  }, [connectionStatuses]);

  const getConnectedProviders = useCallback(() => {
    return providers.filter(provider => provider.connected);
  }, [providers]);

  return {
    providers,
    connectionStatuses,
    isLoading,
    connectProvider,
    disconnectProvider,
    syncProvider,
    getConnectionStatus,
    getConnectedProviders,
    refreshProviders: loadProviders
  };
};
