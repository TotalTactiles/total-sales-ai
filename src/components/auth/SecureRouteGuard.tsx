
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/contexts/auth/types';
import { logger } from '@/utils/logger';

interface SecureRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireAuth?: boolean;
}

const SecureRouteGuard: React.FC<SecureRouteGuardProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Show loading while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent"></div>
          <p className="text-gray-600 text-lg font-medium">Loading TSAM OS...</p>
          <p className="text-gray-400 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If auth is required but no user, redirect to auth with message
  if (requireAuth && !user) {
    logger.info('🚫 Access denied - no user found, redirecting to auth');
    return <Navigate to="/auth?message=access-required" state={{ from: location }} replace />;
  }

  // If user exists but no profile, redirect to auth for completion
  if (requireAuth && user && !profile) {
    logger.info('🚫 Access denied - user found but no profile');
    return <Navigate to="/auth?message=profile-required" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    logger.info(`🚫 Access denied - user role ${profile.role} not in allowed roles ${allowedRoles.join(', ')}`);
    
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

export default SecureRouteGuard;
