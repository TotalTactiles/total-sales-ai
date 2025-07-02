
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DemoDataProvider } from '@/contexts/DemoDataContext';
import AuthPage from '@/pages/auth/AuthPage';
import MainLayout from '@/layouts/MainLayout';
import LogoutHandler from '@/components/LogoutHandler';
import NewLandingPage from '@/pages/NewLandingPage';
import LoadingScreen from '@/components/LoadingScreen';
import { logger } from '@/utils/logger';

const AppRoutes: React.FC = () => {
  const { user, profile, loading } = useAuth();

  // Show loading spinner while determining auth state
  if (loading) {
    return <LoadingScreen />;
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
    return <LoadingScreen message="Setting up your profile..." subMessage="This will only take a moment" />;
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
