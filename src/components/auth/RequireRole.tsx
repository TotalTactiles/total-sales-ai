
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/contexts/auth/types';
import { hasPermission } from '@/utils/permissions';
import { getDashboardRoute } from '@/router/routes';
import { logger } from '@/utils/logger';

interface RequireRoleProps {
  children: React.ReactNode;
  role?: Role;
  permission?: string;
  fallbackPath?: string;
}

const RequireRole: React.FC<RequireRoleProps> = ({ 
  children, 
  role, 
  permission,
  fallbackPath 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Show loading while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    logger.info('No user found, redirecting to auth', 'auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user exists but no profile, redirect to auth for completion
  if (user && !profile) {
    logger.info('User found but no profile, redirecting to auth', 'auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (role && profile && profile.role !== role) {
    logger.info(`User role ${profile.role} does not match required role ${role}`, 'auth');
    
    // Redirect to appropriate dashboard or fallback
    const correctRoute = fallbackPath || getDashboardRoute(profile.role);
    return <Navigate to={correctRoute} replace />;
  }

  // Check permission-based access
  if (permission && profile && !hasPermission(profile.role, permission as any)) {
    logger.info(`User role ${profile.role} lacks permission ${permission}`, 'auth');
    
    const correctRoute = fallbackPath || getDashboardRoute(profile.role);
    return <Navigate to={correctRoute} replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
