
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';
import { Role } from '@/contexts/auth/types';

const DashboardRouter = () => {
  const { user, profile } = useAuth();
  
  // If not authenticated, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Route based on user role or demo mode
  const userStatus = localStorage.getItem('userStatus');
  const demoRole = localStorage.getItem('demoRole');
  
  // Handle demo mode
  if (userStatus === 'demo' && demoRole) {
    const role = demoRole as Role;
    return <Navigate to={getDashboardUrl({ role })} replace />;
  }
  
  // Handle authenticated users based on profile role
  const role = profile?.role || 'sales_rep';

  return <Navigate to={getDashboardUrl({ role })} replace />;
};

export default DashboardRouter;
