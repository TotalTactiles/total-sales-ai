
import React, { useEffect } from 'react';
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
  const { session } = useAuth();

  useEffect(() => {
    console.log('\uD83D\uDD0D Auth Debug \u2014 session:', session);
  }, [session]);

  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/logout" element={<LogoutHandler />} />
        <Route path="/*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  if (session?.user?.role === 'manager') {
    return <Navigate to="/manager/dashboard" replace />;
  } else if (session?.user?.role === 'sales' || session?.user?.role === 'sales_rep') {
    return <Navigate to="/sales/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/logout" element={<LogoutHandler />} />
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
};

const AuthGate: React.FC = () => {
  const { loading } = useAuth();
  return loading ? <LoadingScreen message="Resolving auth..." /> : <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <DemoDataProvider>
          <AuthGate />
        </DemoDataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
