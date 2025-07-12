
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

interface TSAMLog {
  id: string;
  type: string;
  user_id?: string;
  company_id?: string;
  metadata: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  created_at: string;
}

interface MasterAIBrain {
  id: string;
  logs: any[];
  realtime_issues: any[];
  applied_fixes: any[];
  unresolved_bugs: any[];
  system_performance: any;
  company_overview: any;
  integrations_health: any;
  company_id?: string;
  created_at: string;
  updated_at: string;
}

interface FeatureFlag {
  id: string;
  flag_name: string;
  enabled: boolean;
  description?: string;
  target_audience: string;
  created_at: string;
  updated_at: string;
}

export const useTSAM = () => {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<TSAMLog[]>([]);
  const [brainData, setBrainData] = useState<MasterAIBrain | null>(null);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is developer
  const isDeveloper = profile?.role === 'developer';

  useEffect(() => {
    if (!isDeveloper) {
      setLoading(false);
      return;
    }

    fetchTSAMData();
    
    // Setup realtime subscriptions with proper cleanup
    const cleanup = setupRealtimeSubscriptions();
    
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [isDeveloper, user?.id]);

  const fetchTSAMData = async () => {
    try {
      setLoading(true);
      
      // Fetch TSAM logs
      const { data: logsData, error: logsError } = await supabase
        .from('tsam_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;
      setLogs(logsData || []);

      // Fetch master AI brain data
      const { data: brainData, error: brainError } = await supabase
        .from('master_ai_brain')
        .select('*')
        .limit(1)
        .single();

      if (brainError && brainError.code !== 'PGRST116') throw brainError;
      setBrainData(brainData);

      // Fetch feature flags
      const { data: flagsData, error: flagsError } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });

      if (flagsError) throw flagsError;
      setFeatureFlags(flagsData || []);

    } catch (err: any) {
      logger.error('Error fetching TSAM data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    if (!isDeveloper) return;

    // Create a unique channel name to avoid conflicts
    const channelName = `tsam-realtime-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'tsam_logs'
      }, (payload) => {
        setLogs(prev => [payload.new as TSAMLog, ...prev].slice(0, 100));
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'master_ai_brain'
      }, (payload) => {
        setBrainData(payload.new as MasterAIBrain);
      })
      .subscribe();

    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  };

  const ingestEvent = async (eventData: {
    type: string;
    user_id?: string;
    company_id?: string;
    metadata?: any;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  }) => {
    if (!isDeveloper) return;

    try {
      const { error } = await supabase
        .from('tsam_logs')
        .insert({
          type: eventData.type,
          user_id: eventData.user_id,
          company_id: eventData.company_id,
          metadata: eventData.metadata || {},
          priority: eventData.priority || 'medium'
        });

      if (error) throw error;
    } catch (err) {
      logger.error('Error ingesting TSAM event:', err);
    }
  };

  const toggleFeatureFlag = async (flagName: string, enabled: boolean) => {
    if (!isDeveloper) return false;

    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ enabled })
        .eq('flag_name', flagName);

      if (error) throw error;

      setFeatureFlags(prev => 
        prev.map(flag => 
          flag.flag_name === flagName ? { ...flag, enabled } : flag
        )
      );

      return true;
    } catch (err) {
      logger.error('Error toggling feature flag:', err);
      return false;
    }
  };

  const markLogResolved = async (logId: string) => {
    if (!isDeveloper) return;

    try {
      const { error } = await supabase
        .from('tsam_logs')
        .update({ resolved: true })
        .eq('id', logId);

      if (error) throw error;

      setLogs(prev => 
        prev.map(log => 
          log.id === logId ? { ...log, resolved: true } : log
        )
      );
    } catch (err) {
      logger.error('Error marking log as resolved:', err);
    }
  };

  return {
    logs,
    brainData,
    featureFlags,
    loading,
    error,
    isDeveloper,
    ingestEvent,
    toggleFeatureFlag,
    markLogResolved,
    refreshData: fetchTSAMData
  };
};
