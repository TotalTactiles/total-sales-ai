
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import DeveloperDashboard from '@/pages/DeveloperDashboard';
import NewLandingPage from '@/pages/NewLandingPage';
import AuthPage from '@/pages/auth/AuthPage';

const AppRoutes: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading TSAM OS...</div>
          <div className="text-gray-400 text-sm mt-2">Initializing system...</div>
        </div>
      </div>
    );
  }

  // If no user, show public routes (landing page and auth)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/landing" element={<NewLandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // User is authenticated, show the appropriate OS
  return (
    <UnifiedLayout>
      <Routes>
        {/* Developer OS Routes */}
        <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
        <Route path="/developer/*" element={<DeveloperDashboard />} />
        
        {/* Manager OS Routes - Placeholder */}
        <Route path="/manager/dashboard" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Manager Dashboard</h1>
            <p className="text-gray-600">Manager OS coming soon...</p>
          </div>
        } />
        <Route path="/manager/*" element={<Navigate to="/manager/dashboard" replace />} />
        
        {/* Sales OS Routes - Placeholder */}
        <Route path="/sales/dashboard" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Sales Dashboard</h1>
            <p className="text-gray-600">Sales OS coming soon...</p>
          </div>
        } />
        <Route path="/sales/*" element={<Navigate to="/sales/dashboard" replace />} />
        
        {/* Default Routes based on user role */}
        <Route path="/" element={
          <Navigate 
            to={profile?.role === 'developer' ? '/developer/dashboard' : 
                profile?.role === 'manager' ? '/manager/dashboard' : 
                '/sales/dashboard'} 
            replace 
          />
        } />
        
        <Route path="/auth" element={
          <Navigate 
            to={profile?.role === 'developer' ? '/developer/dashboard' : 
                profile?.role === 'manager' ? '/manager/dashboard' : 
                '/sales/dashboard'} 
            replace 
          />
        } />
        
        <Route path="*" element={
          <Navigate 
            to={profile?.role === 'developer' ? '/developer/dashboard' : 
                profile?.role === 'manager' ? '/manager/dashboard' : 
                '/sales/dashboard'} 
            replace 
          />
        } />
      </Routes>
    </UnifiedLayout>
  );
};

export default AppRoutes;
