
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';

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
    return <Navigate to={getDashboardUrl({ role: demoRole })} replace />;
  }

  // Handle authenticated users based on profile role
  const role = profile?.role || 'sales_rep';
  return <Navigate to={getDashboardUrl({ role })} replace />;
};

export default DashboardRouter;
