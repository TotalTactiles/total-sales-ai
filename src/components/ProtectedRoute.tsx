
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'manager' | 'sales_rep' | null; // null means any authenticated user
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = null }) => {
  const { user, profile, loading, isDemoMode } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salesBlue"></div>
      </div>
    );
  }

  // Check if in demo mode
  if (isDemoMode()) {
    // In demo mode, we already checked role in AuthContext
    // so we can just render the children
    if (!requiredRole || (profile && profile.role === requiredRole)) {
      return <>{children}</>;
    }
    
    // If specific role is required but doesn't match, redirect
    const redirectPath = profile?.role === 'manager' ? '/dashboard/manager' : '/dashboard/rep';
    return <Navigate to={redirectPath} replace />;
  }

  // Standard auth check
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If there's a required role and the user's role doesn't match
  if (requiredRole && profile && profile.role !== requiredRole) {
    // Redirect to appropriate dashboard
    const redirectPath = profile.role === 'manager' ? '/dashboard/manager' : '/dashboard/rep';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
