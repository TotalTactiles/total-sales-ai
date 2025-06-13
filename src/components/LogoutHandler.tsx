
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/utils/logger';

const LogoutHandler: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        logger.info('LogoutHandler: Starting logout process');
        await signOut();
        logger.info('LogoutHandler: Logout completed, redirecting to auth');
        navigate('/auth', { replace: true });
      } catch (error) {
        logger.error('LogoutHandler: Error during logout:', error);
        // Force redirect even if logout fails
        navigate('/auth', { replace: true });
      }
    };

    handleLogout();
  }, [signOut, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Signing out...</p>
      </div>
    </div>
  );
};

export default LogoutHandler;
