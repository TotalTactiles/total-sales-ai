
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const optimizedLogout = async (navigate: (path: string) => void) => {
  try {
    // Immediate UI feedback - clear local state first
    const startTime = performance.now();
    
    // Fast logout without waiting for server response
    const logoutPromise = supabase.auth.signOut();
    
    // Immediate navigation - don't wait for logout to complete
    setTimeout(() => {
      navigate('/auth');
    }, 100); // Small delay to show loading state
    
    // Complete logout in background
    await logoutPromise;
    
    const endTime = performance.now();
    console.log(`Logout completed in ${endTime - startTime}ms`);
    
    // Background logging (non-blocking)
    setTimeout(async () => {
      try {
        await supabase.from('tsam_logs').insert({
          type: 'auth_logout',
          priority: 'low',
          message: 'User logged out successfully',
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'optimized_logout',
            duration: `${endTime - startTime}ms`
          }
        });
        
        logger.info('Logout event logged successfully', {}, 'auth');
      } catch (error: any) {
        logger.warn('Non-critical: Failed to log logout event:', error, 'auth');
      }
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
    // Use replace for instant navigation
    window.location.replace(path);
  };

  return {
    logout: () => optimizedLogout(navigate)
  };
};
