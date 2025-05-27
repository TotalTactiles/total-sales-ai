
import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ManagerOS: React.FC = () => {
  const { profile } = useAuth();

  // Restrict access to managers only
  if (profile?.role !== 'manager' && profile?.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerOS;
