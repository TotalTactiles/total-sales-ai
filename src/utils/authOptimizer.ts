
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/contexts/auth/types';
import { logger } from '@/utils/logger';

interface AuthPerformanceMetrics {
  loginStart: number;
  sessionRetrieved: number;
  profileFetched: number;
  routingComplete: number;
}

export const logAuthPerformance = async (metrics: AuthPerformanceMetrics, role: string) => {
  const totalDuration = metrics.routingComplete - metrics.loginStart;
  const sessionTime = metrics.sessionRetrieved - metrics.loginStart;
  const profileTime = metrics.profileFetched - metrics.sessionRetrieved;
  const routingTime = metrics.routingComplete - metrics.profileFetched;

  try {
    await supabase.from('tsam_logs').insert({
      type: 'auth_performance',
      priority: 'low',
      message: `Login performance: ${totalDuration}ms total (${sessionTime}ms session, ${profileTime}ms profile, ${routingTime}ms routing)`,
      metadata: {
        role,
        totalDuration,
        sessionTime,
        profileTime,
        routingTime,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Failed to log auth performance:', error, 'auth');
  }
};

export const fetchUserProfileOptimized = async (userId: string): Promise<Profile | null> => {
  try {
    logger.info('Fetching optimized profile for user:', userId, 'auth');
    
    // Single optimized query with all needed data
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      logger.error('Error fetching optimized profile:', error, 'auth');
      return null;
    }

    if (data) {
      logger.info('Profile fetched successfully in optimized flow:', { 
        userId: data.id, 
        role: data.role 
      }, 'auth');
      return data as Profile;
    }

    return null;
  } catch (error) {
    logger.error('Exception in optimized profile fetch:', error, 'auth');
    return null;
  }
};

// Deferred metadata updates (run after routing)
export const updateUserMetadataDeferred = async (userId: string) => {
  try {
    // Non-blocking metadata updates
    await supabase
      .from('profiles')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    logger.info('Deferred metadata updated successfully', {}, 'auth');
  } catch (error) {
    logger.warn('Non-critical: Failed to update deferred metadata:', error, 'auth');
  }
};
