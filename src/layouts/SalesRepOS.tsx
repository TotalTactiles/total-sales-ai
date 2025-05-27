
import React from 'react';
import { Outlet } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import DevModeToggle from '@/components/DeveloperMode/DevModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const SalesRepOS: React.FC = () => {
  const { profile } = useAuth();

  // Restrict access to sales reps only (allow admin for testing)
  if (profile?.role !== 'sales_rep' && profile?.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SalesRepNavigation />
      <DevModeToggle />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default SalesRepOS;
