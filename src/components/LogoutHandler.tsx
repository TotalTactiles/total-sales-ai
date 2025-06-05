import { logger } from '@/utils/logger';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const LogoutHandler = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        logger.info('LogoutHandler: Starting logout process');
        
        // Clear all local storage and session storage first
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear any cached data
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        }
        
        // Sign out from auth
        await signOut();
        
        logger.info('LogoutHandler: Forcing redirect to auth');
        
        // Force a complete page reload to the auth page to clear all state
        window.location.replace('/auth');
        
      } catch (error) {
        logger.error('LogoutHandler error:', error);
        // Force redirect even on error
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace('/auth');
      }
    };

    handleLogout();
  }, [signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutHandler;
