
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

export const optimizedLogout = async (
  signOut: () => Promise<any>
) => {
  try {
    logger.info('🔐 Starting optimized logout', {}, 'auth');
    
    // Trigger sign out
    await signOut();
    
    // Force immediate redirect to auth page
    window.location.replace('/auth');
    
  } catch (error) {
    logger.error('❌ Logout error:', error, 'auth');
    // Force redirect even on error
    window.location.replace('/auth');
  }
};

// Hook for consistent logout behavior
export const useOptimizedLogout = () => {
  const { signOut } = useAuth();

  return {
    logout: () => optimizedLogout(signOut)
  };
};
