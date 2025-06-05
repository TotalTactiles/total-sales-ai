
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardUrl } from './Navigation/navigationUtils';
import { Role } from '@/contexts/auth/types';

const DashboardRouter = () => {
  const { user, profile, getLastSelectedRole } = useAuth();

  // If not authenticated, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userStatus = localStorage.getItem('userStatus');
  const demoRole = localStorage.getItem('demoRole');

  // Determine target role based on demo mode or authenticated profile
  let role: Role = profile?.role ?? 'sales_rep';

  if (userStatus === 'demo' && demoRole) {
    role = demoRole as Role;
  } else if (!profile) {
    role = getLastSelectedRole();
  }

  const target = getDashboardUrl({ role } as any);

  return <Navigate to={target} replace />;
};

export default DashboardRouter;
