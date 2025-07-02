
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

const LogoutHandler = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        logger.info('LogoutHandler: Performing logout', {}, 'auth');
        await signOut();
        
        // Force immediate redirect to auth page (not safe-dashboard)
        window.location.replace('/auth');
      } catch (error) {
        logger.error('LogoutHandler: Logout error:', error, 'auth');
        // Force redirect even if logout fails
        window.location.replace('/auth');
      }
    };

    performLogout();
  }, [signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-destructive border-t-transparent mx-auto mb-4"></div>
        <p className="text-foreground text-lg font-medium">Logging out...</p>
        <p className="text-muted-foreground text-sm mt-2">Redirecting to login</p>
      </div>
    </div>
  );
};

export default LogoutHandler;
