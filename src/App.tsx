
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { useAIBrain } from '@/hooks/useAIBrain';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './App.css';

// --- Error Boundary ---
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    logger.error('App Error Boundary caught error:', { error: error.message, errorInfo }, 'app');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
          <div className="text-center max-w-md p-8">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">System Error</h1>
            <p className="text-gray-600 mb-6">
              SalesOS encountered an unexpected error. Please try reloading the application.
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Application
              </Button>
              <p className="text-sm text-gray-500">
                Error: {this.state.error?.message}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Query Client ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// --- App Routes ---
function AppRoutes() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  useAIBrain();

  useEffect(() => {
    if (location.pathname.startsWith('/os/')) {
      // Handle OS-specific routing logic here if needed
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Initializing SalesOS...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we set up your workspace</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/landing" element={<NewLandingPage />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  if (user && !profile) {
    logger.info('User is authenticated but profile not found — blocking with onboarding wait');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const getDefaultRoute = () => {
    switch (profile.role) {
      case 'developer':
      case 'admin':
        return '/os/dev';
      case 'manager':
        return '/os/manager';
      case 'sales_rep':
      default:
        return '/os/rep';
    }
  };

  return (
    <OnboardingGuard>
      <Routes>
        <Route path="/auth" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/landing" element={<Navigate to={getDefaultRoute()} replace />} />

        {(profile.role === 'developer' || profile.role === 'admin') && (
          <Route path="/os/dev/*" element={<DeveloperOS />} />
        )}
        {profile.role === 'manager' && (
          <Route path="/os/manager/*" element={<ManagerOS />} />
        )}
        <Route path="/os/rep/*" element={<SalesOS />} />

        {/* Legacy support */}
        <Route path="/developer/*" element={<Navigate to="/os/dev/dashboard" replace />} />
        <Route path="/manager/*" element={<Navigate to="/os/manager/dashboard" replace />} />
        <Route path="/sales/*" element={<Navigate to="/os/rep/dashboard" replace />} />

        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </OnboardingGuard>
  );
}

// --- Main App Component ---
function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(r => r.unregister());
      });
    }
  }, []);

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthErrorBoundary>
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
        </AuthErrorBoundary>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
