
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DemoDataProvider } from '@/contexts/DemoDataContext';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import AuthPage from '@/pages/auth/AuthPage';
import MainLayout from '@/layouts/MainLayout';
import SafeModePage from '@/pages/SafeModePage';
import LogoutHandler from '@/components/LogoutHandler';
import NewLandingPage from '@/pages/NewLandingPage';
import LoadingScreen from '@/components/LoadingScreen';

const AppRoutes: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = React.useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && hydrated && session?.user) {
      if (session.user.role === 'manager') {
        navigate('/manager/dashboard', { replace: true });
      } else if (session.user.role === 'sales' || session.user.role === 'sales_rep') {
        navigate('/sales/dashboard', { replace: true });
      }
    }
  }, [hydrated, session, navigate]);

  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/safe" element={<SafeModePage />} />
        <Route path="/logout" element={<LogoutHandler />} />
        <Route path="/*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/logout" element={<LogoutHandler />} />
      <Route path="/safe" element={<SafeModePage />} />
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
          <UnifiedAIProvider>
            <AuthGate />
          </UnifiedAIProvider>
        </DemoDataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
