
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/contexts/auth/types';
import { logger } from '@/utils/logger';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireAuth?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
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

  // If auth is required but no user, redirect to auth
  if (requireAuth && !user) {
    logger.info('No user found, redirecting to auth', 'auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user exists but no profile, redirect to auth for completion
  if (requireAuth && user && !profile) {
    logger.info('User found but no profile, redirecting to auth', 'auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    logger.info(`User role ${profile.role} not in allowed roles ${allowedRoles.join(', ')}`, 'auth');
    
    // Redirect to appropriate dashboard based on actual role
    const roleRoutes = {
      developer: '/developer/dashboard',
      admin: '/developer/dashboard',
      manager: '/manager/dashboard',
      sales_rep: '/sales/dashboard'
    };
    
    const correctRoute = roleRoutes[profile.role] || '/sales/dashboard';
    return <Navigate to={correctRoute} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
