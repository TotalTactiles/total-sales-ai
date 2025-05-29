
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
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

  // If user is authenticated but no profile, redirect to auth for completion
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  // Route user to appropriate OS based on their role
  const currentPath = location.pathname;
  const userRole = profile.role;

  // Determine if user is on correct OS path
  const isOnCorrectOS = () => {
    if (userRole === 'developer' || userRole === 'admin') {
      return currentPath.startsWith('/developer');
    } else if (userRole === 'manager') {
      return currentPath.startsWith('/manager');
    } else if (userRole === 'sales_rep') {
      return currentPath.startsWith('/sales');
    }
    return false;
  };

  // Redirect to correct OS if on wrong path
  if (!isOnCorrectOS() && !currentPath.startsWith('/lead-workspace')) {
    switch (userRole) {
      case 'developer':
      case 'admin':
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
