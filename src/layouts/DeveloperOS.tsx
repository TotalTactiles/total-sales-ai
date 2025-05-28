
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import { useAuth } from '@/contexts/AuthContext';

// Developer Pages
import DeveloperDashboard from '@/components/MasterBrain/DeveloperDashboard';

const DeveloperOS: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // Allow admins and developers
  if (profile?.role !== 'admin' && profile?.role !== 'developer') {
    // Redirect to appropriate OS based on role
    switch (profile?.role) {
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'sales_rep':
        return <Navigate to="/sales" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <DeveloperNavigation />
      <main className="pt-16">
        <Routes>
          <Route index element={<DeveloperDashboard />} />
          <Route path="dashboard" element={<DeveloperDashboard />} />
          <Route path="*" element={<Navigate to="/developer/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default DeveloperOS;
