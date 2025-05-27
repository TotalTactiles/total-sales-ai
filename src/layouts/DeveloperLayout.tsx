
import React from 'react';
import { Outlet } from 'react-router-dom';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const DeveloperLayout: React.FC = () => {
  const { profile } = useAuth();

  // Restrict access to developers and admins only
  if (profile?.role !== 'admin' && profile?.role !== 'developer') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <DeveloperNavigation />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default DeveloperLayout;
