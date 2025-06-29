
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface SalesOSData {
  leads: any[];
  activityLogs: any[];
  metrics: any;
  notifications: any[];
}

export const preloadSalesOSData = async (userId: string, companyId: string): Promise<SalesOSData> => {
  try {
    logger.info('Starting sales OS data preload', { userId }, 'sales');
    const startTime = performance.now();

    // Batch all required data fetches in parallel
    const [leadsResult, logsResult, metricsResult, notificationsResult] = await Promise.all([
      supabase
        .from('leads')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50),
      
      supabase
        .from('tsam_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'sales_activity')
        .order('created_at', { ascending: false })
        .limit(20),
      
      supabase
        .from('rep_metrics')
        .select('*')
        .eq('rep_id', userId)
        .eq('company_id', companyId)
        .order('week_start', { ascending: false })
        .limit(1),
      
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    const endTime = performance.now();
    const loadTime = endTime - startTime;

    logger.info(`Sales OS data preloaded in ${loadTime}ms`, {
      userId,
      leadsCount: leadsResult.data?.length || 0,
      logsCount: logsResult.data?.length || 0,
      loadTime
    }, 'sales');

    // Log performance for monitoring
    setTimeout(() => {
      supabase.from('tsam_logs').insert({
        type: 'sales_data_preload',
        priority: 'low',
        message: `Sales data preloaded in ${loadTime}ms`,
        metadata: {
          userId,
          loadTime,
          timestamp: new Date().toISOString()
        }
      }).catch(error => {
        logger.warn('Failed to log sales preload performance:', error, 'sales');
      });
    }, 0);

    return {
      leads: leadsResult.data || [],
      activityLogs: logsResult.data || [],
      metrics: metricsResult.data?.[0] || null,
      notifications: notificationsResult.data || []
    };

  } catch (error) {
    logger.error('Sales OS data preload failed:', error, 'sales');
    // Return empty data to prevent blocking
    return {
      leads: [],
      activityLogs: [],
      metrics: null,
      notifications: []
    };
  }
};

// Cache for session data to avoid repeated fetches
let sessionCache: { userId: string; companyId: string; role: string; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedSession = () => {
  if (sessionCache && (Date.now() - sessionCache.timestamp) < CACHE_DURATION) {
    return sessionCache;
  }
  return null;
};

export const setCachedSession = (userId: string, companyId: string, role: string) => {
  sessionCache = {
    userId,
    companyId,
    role,
    timestamp: Date.now()
  };
};

export const clearSessionCache = () => {
  sessionCache = null;
};
