
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
  const { user, profile, loading, isDemoMode } = useAuth();
  
  // Initialize AI Brain
  useAIBrain();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If no user and not demo mode, show landing or auth
  if (!user && !isDemoMode()) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/landing" element={<NewLandingPage />} />
        <Route path="/" element={<NewLandingPage />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    );
  }

  // If user but no profile (and not demo mode), redirect to auth
  if (user && !profile && !isDemoMode()) {
    return <Navigate to="/auth" replace />;
  }

  // Demo mode or authenticated user routing
  const getDefaultRoute = () => {
    if (isDemoMode()) {
      const demoRole = localStorage.getItem('demoRole');
      switch (demoRole) {
        case 'developer':
          return '/developer/dashboard';
        case 'manager':
          return '/manager/dashboard';
        case 'sales_rep':
        default:
          return '/sales/dashboard';
      }
    }
    
    if (profile) {
      switch (profile.role) {
        case 'developer':
        case 'admin':
          return '/developer/dashboard';
        case 'manager':
          return '/manager/dashboard';
        case 'sales_rep':
        default:
          return '/sales/dashboard';
      }
    }
    
    return '/sales/dashboard';
  };

  return (
    <OnboardingGuard>
      <Routes>
        {/* Redirect auth to dashboard if already authenticated */}
        <Route path="/auth" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/landing" element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Developer OS */}
        {(profile?.role === 'developer' || profile?.role === 'admin' || isDemoMode()) && (
          <Route path="/developer/*" element={<DeveloperOS />} />
        )}
        
        {/* Manager OS */}
        {(profile?.role === 'manager' || profile?.role === 'admin' || isDemoMode()) && (
          <Route path="/manager/*" element={<ManagerOS />} />
        )}
        
        {/* Sales OS - Available to all roles and demo mode */}
        <Route path="/sales/*" element={<SalesOS />} />
        
        {/* Default redirects */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
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
