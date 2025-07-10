
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DemoDataProvider } from '@/contexts/DemoDataContext';
import AuthPage from '@/pages/auth/AuthPage';
import MainLayout from '@/layouts/MainLayout';
import LogoutHandler from '@/components/LogoutHandler';
import NewLandingPage from '@/pages/NewLandingPage';
import GlobalFeedback from '@/components/feedback/GlobalFeedback';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionRefresh } from '@/hooks/useSessionRefresh';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Initialize session refresh for authenticated users
  useSessionRefresh();

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

  // If user is authenticated, show main app
  if (user) {
    return (
      <Routes>
        <Route path="/logout" element={<LogoutHandler />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    );
  }

  // If not authenticated, show auth page or landing page
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
          <GlobalFeedback />
        </DemoDataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
