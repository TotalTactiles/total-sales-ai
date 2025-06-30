
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthPage from '@/pages/auth/AuthPage';
import MainLayout from '@/layouts/MainLayout';
import LogoutHandler from '@/components/LogoutHandler';
import NewLandingPage from '@/pages/NewLandingPage';
import { useAuth } from '@/contexts/AuthContext';

const AppRoutes: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B61FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing TSAM OS...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<NewLandingPage />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/logout" element={<LogoutHandler />} />
      <Route path="/dashboard/*" element={user ? <MainLayout /> : <Navigate to="/auth" replace />} />
      <Route path="/*" element={user ? <MainLayout /> : <Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
