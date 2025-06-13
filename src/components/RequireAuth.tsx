
import { logger } from '@/utils/logger';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, profile, loading, isDemoMode } = useAuth();
  const location = useLocation();

  logger.info('RequireAuth check:', { 
    loading, 
    user: !!user, 
    profile: !!profile, 
    isDemoMode: isDemoMode(),
    pathname: location.pathname 
  });

  // Show loading spinner while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow demo mode access
  if (isDemoMode()) {
    logger.info('RequireAuth: Demo mode active, allowing access');
    return <>{children}</>;
  }

  // If no user and not in demo mode, redirect to auth
  if (!user) {
    logger.info('RequireAuth: No user, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated but no profile, redirect to auth for completion
  if (!profile) {
    logger.info('RequireAuth: User but no profile, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  logger.info('RequireAuth: Access granted');
  return <>{children}</>;
};

export default RequireAuth;
