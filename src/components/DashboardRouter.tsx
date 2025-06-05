
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRouter = () => {
  const { user, profile, isDemoMode, getLastSelectedRole } = useAuth();
  
  // If not authenticated, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Route based on user role or demo mode

  // Handle demo mode
  if (isDemoMode()) {
    const demoRole = getLastSelectedRole();
    switch (demoRole) {
      case 'sales_rep':
        return <Navigate to="/" replace />;
      case 'manager':
        return <Navigate to="/manager/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  // Handle authenticated users based on profile role
  const role = profile?.role || 'sales_rep';
  
  switch (role) {
    case 'manager':
      return <Navigate to="/manager/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin-dashboard" replace />;
    case 'sales_rep':
    default:
      return <Navigate to="/" replace />;
  }
};

export default DashboardRouter;
