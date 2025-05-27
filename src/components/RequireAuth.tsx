
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

  // For demo/testing purposes, allow temporary access to developer mode
  // In production, this should be stricter
  if (requiredRole === 'developer') {
    // Allow admin and developer roles, and temporarily allow other roles for testing
    if (profile?.role === 'admin' || profile?.role === 'developer') {
      return <>{children}</>;
    }
    // For testing purposes, allow manager/sales_rep to access developer mode
    // Remove this in production
    if (profile?.role === 'manager' || profile?.role === 'sales_rep') {
      console.warn('Allowing non-developer access for testing purposes');
      return <>{children}</>;
    }
    // Redirect to appropriate dashboard based on actual role
    switch (profile?.role) {
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'sales_rep':
        return <Navigate to="/sales" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  // Check if user has required role or is admin (admin can access everything)
  if (requiredRole && profile?.role !== requiredRole && profile?.role !== 'admin') {
    // Redirect to appropriate dashboard based on role
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
