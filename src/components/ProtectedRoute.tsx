
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'sales_rep' | 'manager' | 'admin';
  roleBasedRedirect?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  roleBasedRedirect = false
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Role-based redirect logic
  if (roleBasedRedirect && profile?.role) {
    const currentPath = window.location.pathname;
    
    if (profile.role === 'manager' && !currentPath.startsWith('/manager')) {
      return <Navigate to={getDashboardUrl(profile)} replace />;
    }

    if (profile.role === 'sales_rep' && !currentPath.startsWith('/sales')) {
      return <Navigate to={getDashboardUrl(profile)} replace />;
    }
  }

  // Role requirement check
  if (requiredRole && profile?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={getDashboardUrl(profile)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
