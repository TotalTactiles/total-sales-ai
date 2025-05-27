
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Allow admin access to everything
  if (profile?.role === 'admin') {
    return <>{children}</>;
  }

  // For testing purposes, allow cross-role access during development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Dev mode: Allowing ${profile?.role} to access ${requiredRole} content`);
    return <>{children}</>;
  }

  // Check if user has required role
  if (requiredRole && profile?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    switch (profile?.role) {
      case 'developer':
        return <Navigate to="/developer" replace />;
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'sales_rep':
        return <Navigate to="/sales" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
};

export default RequireAuth;
