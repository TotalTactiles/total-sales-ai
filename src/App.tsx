
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DemoDataProvider } from '@/contexts/DemoDataContext';
import AuthPage from '@/pages/auth/AuthPage';
import MainLayout from '@/layouts/MainLayout';
import LogoutHandler from '@/components/LogoutHandler';
import NewLandingPage from '@/pages/NewLandingPage';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

const AppRoutes: React.FC = () => {
  const { user, profile, loading } = useAuth();

  // Show loading spinner while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading TSAM OS...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, determine role-based routing
  if (user && profile) {
    logger.info('User authenticated, routing to dashboard:', { role: profile.role }, 'auth');
    
    return (
      <Routes>
        <Route path="/logout" element={<LogoutHandler />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    );
  }

  // If user exists but no profile, show loading or redirect to complete setup
  if (user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7B61FF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Setting up your profile...</p>
          <p className="text-gray-400 text-sm mt-2">This will only take a moment</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth/landing pages
  return (
    <Routes>
      <Route path="/" element={<NewLandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/logout" element={<LogoutHandler />} />
      <Route path="/*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <DemoDataProvider>
          <AppRoutes />
        </DemoDataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
