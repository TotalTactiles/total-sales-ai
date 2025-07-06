
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
        <div className="text-white text-lg">Loading TSAM OS...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route 
          path="/auth" 
          element={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                <p>Please sign in to access TSAM OS</p>
              </div>
            </div>
          } 
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <UnifiedLayout>
      <Routes>
        {/* Developer OS Routes */}
        <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
        <Route path="/developer/" element={<Navigate to="/developer/dashboard" replace />} />
        <Route path="/developer" element={<Navigate to="/developer/dashboard" replace />} />
        
        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/developer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/developer/dashboard" replace />} />
      </Routes>
    </UnifiedLayout>
  );
};

export default AppRoutes;
