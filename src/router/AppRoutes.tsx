
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import DeveloperDashboard from '@/pages/DeveloperDashboard';

const AppRoutes: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Authentication Required</div>} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <UnifiedLayout>
      <Routes>
        <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
        <Route path="/developer/" element={<Navigate to="/developer/dashboard" replace />} />
        <Route path="/developer" element={<Navigate to="/developer/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/developer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/developer/dashboard" replace />} />
      </Routes>
    </UnifiedLayout>
  );
};

export default AppRoutes;
