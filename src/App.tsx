
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import { DemoDataProvider } from '@/contexts/DemoDataContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import AuthPage from '@/pages/auth/AuthPage';
import NewLandingPage from '@/pages/NewLandingPage';
import SalesOS from '@/layouts/SalesRepOS';
import ManagerOS from '@/layouts/ManagerOS';
import DeveloperOS from '@/layouts/DeveloperOS';
import OnboardingGuard from '@/components/OnboardingGuard';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAIBrain } from '@/hooks/useAIBrain';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { user, profile, loading } = useAuth();
  
  // Initialize AI Brain
  useAIBrain();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If no user, show landing or auth
  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/landing" element={<NewLandingPage />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    );
  }

  // If user but no profile, redirect to auth
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  // Route based on user role
  const getDefaultRoute = () => {
    switch (profile.role) {
      case 'developer':
        return '/developer/*';
      case 'manager':
        return '/manager/*';
      case 'sales_rep':
        return '/sales/*';
      default:
        return '/sales/*';
    }
  };

  return (
    <OnboardingGuard>
      <Routes>
        <Route path="/auth" element={<Navigate to={getDefaultRoute().replace('/*', '/dashboard')} replace />} />
        
        {/* Developer OS */}
        {profile.role === 'developer' && (
          <Route path="/developer/*" element={<DeveloperOS />} />
        )}
        
        {/* Manager OS */}
        {(profile.role === 'manager' || profile.role === 'admin') && (
          <Route path="/manager/*" element={<ManagerOS />} />
        )}
        
        {/* Sales OS */}
        <Route path="/sales/*" element={<SalesOS />} />
        
        {/* Default redirects */}
        <Route path="/" element={<Navigate to={getDefaultRoute().replace('/*', '/dashboard')} replace />} />
        <Route path="*" element={<Navigate to={getDefaultRoute().replace('/*', '/dashboard')} replace />} />
      </Routes>
    </OnboardingGuard>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DemoDataProvider>
          <UnifiedAIProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
              <Router>
                <AppRoutes />
                <Toaster />
              </Router>
            </ThemeProvider>
          </UnifiedAIProvider>
        </DemoDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
