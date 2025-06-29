
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const optimizedLogout = async (navigate: (path: string) => void) => {
  try {
    // Immediate logout call
    await supabase.auth.signOut();
    
    // Hard redirect to auth page
    navigate('/auth');
    
    // Background logging (non-blocking)
    setTimeout(() => {
      supabase.from('tsam_logs').insert({
        type: 'auth_logout',
        priority: 'low',
        message: 'User logged out successfully',
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'optimized_logout'
        }
      }).catch(error => {
        logger.warn('Non-critical: Failed to log logout event:', error, 'auth');
      });
    }, 0);
    
  } catch (error) {
    logger.error('Logout error:', error, 'auth');
    // Force redirect even on error
    navigate('/auth');
  }
};

// Hook for consistent logout behavior
export const useOptimizedLogout = () => {
  const navigate = (path: string) => {
    window.location.replace(path);
  };

  return {
    logout: () => optimizedLogout(navigate)
  };
};
