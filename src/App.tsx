
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
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { useAIBrain } from '@/hooks/useAIBrain';
import { logger } from '@/utils/logger';
import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './App.css';

// Error Boundary Component
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      }
    },
  },
});

function AppRoutes() {
  const { user, profile, loading } = useAuth();
  
  // Initialize AI Brain
  useAIBrain();

  logger.info('AppRoutes state:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading,
    profileRole: profile?.role,
    userId: user?.id,
    profileId: profile?.id
  }, 'app');

  if (loading) {
    logger.info('App is loading auth state', {}, 'app');
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

  // If no user, show auth page
  if (!user) {
    logger.info('No user found, showing auth page', {}, 'app');
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/landing" element={<NewLandingPage />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // If user but no profile, show loading with more details
  if (user && !profile) {
    logger.warn('User found but no profile, this may indicate a profile creation issue', {
      userId: user.id,
      userEmail: user.email,
      userMetadata: user.user_metadata
    }, 'app');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Setting up your profile...</p>
          <p className="text-gray-500 text-sm mt-2">Creating your workspace and user settings</p>
          <p className="text-gray-400 text-xs mt-4">User ID: {user.id}</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            If this takes more than 30 seconds, please refresh the page or contact support.
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user routing with enhanced role-based routing
  const getDefaultRoute = () => {
    if (profile) {
      logger.info('Determining default route for role:', profile.role, 'app');
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
    }
    
    return '/os/rep';
  };

  logger.info('User authenticated successfully, showing role-based routes', {
    userRole: profile.role,
    defaultRoute: getDefaultRoute()
  }, 'app');

  return (
    <OnboardingGuard>
      <Routes>
        {/* Redirect auth to dashboard if already authenticated */}
        <Route path="/auth" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/landing" element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Developer OS */}
        {(profile?.role === 'developer' || profile?.role === 'admin') && (
          <Route path="/os/dev/*" element={<DeveloperOS />} />
        )}
        
        {/* Manager OS */}
        {profile?.role === 'manager' && (
          <Route path="/os/manager/*" element={<ManagerOS />} />
        )}
        
        {/* Sales OS - Available to all roles */}
        <Route path="/os/rep/*" element={<SalesOS />} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/developer/*" element={<Navigate to="/os/dev/dashboard" replace />} />
        <Route path="/manager/*" element={<Navigate to="/os/manager/dashboard" replace />} />
        <Route path="/sales/*" element={<Navigate to="/os/rep/dashboard" replace />} />
        
        {/* Default redirects */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
              <p className="text-gray-600 mb-4">The requested page could not be found.</p>
              <Button onClick={() => window.location.href = getDefaultRoute()}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        } />
      </Routes>
    </OnboardingGuard>
  );
}

function App() {
  // Disable service worker temporarily to prevent 404 errors
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
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
