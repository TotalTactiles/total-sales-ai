
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, profile, loading, isDemoMode } = useAuth();
  const location = useLocation();

  console.log('RequireAuth check:', { 
    loading, 
    user: !!user, 
    profile: !!profile, 
    isDemoMode: isDemoMode(),
    pathname: location.pathname 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Allow demo mode access
  if (isDemoMode()) {
    console.log('RequireAuth: Demo mode active, allowing access');
    return <>{children}</>;
  }

  if (!user) {
    console.log('RequireAuth: No user, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated but no profile, redirect to auth for completion
  if (!profile) {
    console.log('RequireAuth: User but no profile, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('RequireAuth: Access granted');
  return <>{children}</>;
};

export default RequireAuth;
