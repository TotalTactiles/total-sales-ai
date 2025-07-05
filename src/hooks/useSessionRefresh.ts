
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const useSessionRefresh = () => {
  const { session, user } = useAuth();

  const refreshSession = useCallback(async () => {
    try {
      if (!session) return;

      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        logger.error('Session refresh failed:', error, 'auth');
        // Don't force logout here, let the auth state change handler deal with it
        return;
      }

      if (data.session) {
        logger.info('Session refreshed successfully', {}, 'auth');
      }
    } catch (error) {
      logger.error('Session refresh exception:', error, 'auth');
    }
  }, [session]);

  // Auto-refresh session every 50 minutes (before 60-minute expiry)
  useEffect(() => {
    if (!user || !session) return;

    const interval = setInterval(() => {
      refreshSession();
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(interval);
  }, [user, session, refreshSession]);

  return { refreshSession };
};
