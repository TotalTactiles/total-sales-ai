
import React from 'react';
import RouteGuard from '@/components/auth/RouteGuard';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  return (
    <RouteGuard requireAuth={true}>
      {children}
    </RouteGuard>
  );
};

export default RequireAuth;
