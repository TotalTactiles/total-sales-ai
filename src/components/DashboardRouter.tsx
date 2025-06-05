
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
  
  // Handle demo mode
  if (isDemoMode()) {
    const role = getLastSelectedRole();
    return <Navigate to={getDashboardUrl({ role })} replace />;
  }
  
  // Handle authenticated users based on profile role
  const role = profile?.role || 'sales_rep';

  return <Navigate to={getDashboardUrl({ role })} replace />;
};

export default DashboardRouter;
