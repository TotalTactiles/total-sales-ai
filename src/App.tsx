
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
import { supabase } from '@/integrations/supabase/client';

const AppRoutes: React.FC = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [hydrated, setHydrated] = React.useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Validate session directly with Supabase to avoid auth loops
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth', { replace: true });
      } else {
        const role = (session.user as any)?.role || 'sales';
        const target = role === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
        if (window.location.pathname !== target) {
          navigate(target, { replace: true });
        }
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (typeof window !== 'undefined' && hydrated && session && !loading) {
      const role = (session.user as any)?.role;
      const target = !session.user
        ? '/auth'
        : role === 'manager'
          ? '/manager/dashboard'
          : '/sales/dashboard';

      if (window.location.pathname !== target) {
        navigate(target, { replace: true });
      }
    }
  }, [hydrated, session, loading, navigate]);

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
