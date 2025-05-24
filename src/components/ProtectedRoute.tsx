
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'manager' | 'sales_rep' | null; // null means any authenticated user
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = null }) => {
  const { user, profile, loading, isDemoMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Debug logging to help troubleshoot
    console.log("ProtectedRoute - User:", user?.id);
    console.log("ProtectedRoute - Profile:", profile?.role);
    console.log("ProtectedRoute - Demo Mode:", isDemoMode());
    console.log("ProtectedRoute - Required Role:", requiredRole);
    console.log("ProtectedRoute - Current Path:", location.pathname);
  }, [user, profile, isDemoMode, requiredRole, location]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salesBlue"></div>
      </div>
    );
  }

  // Check if in demo mode
  if (isDemoMode()) {
    console.log("Demo mode is active");
    // Get role from localStorage in case profile is not set yet
    const demoRole = localStorage.getItem('demoRole');
    
    // If no specific role is required, or the demo role matches the required role, render children
    if (!requiredRole || demoRole === requiredRole) {
      console.log("Demo access granted");
      return <>{children}</>;
    }
    
    // If specific role is required but doesn't match, redirect
    console.log("Demo access denied - redirecting");
    const redirectPath = demoRole === 'manager' ? '/manager-dashboard' : '/sales-rep-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Standard auth check
  if (!user) {
    console.log("No user - redirecting to auth");
    // Redirect to login if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If there's a required role and the user's role doesn't match
  if (requiredRole && profile && profile.role !== requiredRole) {
    console.log("Role mismatch - redirecting");
    // Redirect to appropriate dashboard
    const redirectPath = profile.role === 'manager' ? '/manager-dashboard' : '/sales-rep-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  console.log("Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
