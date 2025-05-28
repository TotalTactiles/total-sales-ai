
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/contexts/auth/types';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles,
  fallbackPath = '/auth'
}) => {
  const { user, profile, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    // Redirect to appropriate dashboard based on actual role
    switch (profile?.role) {
      case 'developer':
      case 'admin':
        return <Navigate to="/developer" replace />;
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'sales_rep':
        return <Navigate to="/sales" replace />;
      default:
        return <Navigate to={fallbackPath} replace />;
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
