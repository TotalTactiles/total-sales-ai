
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
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAIBrain } from '@/hooks/useAIBrain';
import { logger } from '@/utils/logger';
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

  logger.info('AppRoutes state:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading,
    profileRole: profile?.role,
    userId: user?.id,
    profileId: profile?.id
  });

  if (loading) {
    logger.info('App is loading auth state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your workspace...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we set up your account</p>
        </div>
      </div>
    );
  }

  // If no user, show auth page
  if (!user) {
    logger.info('No user found, showing auth page');
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
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Setting up your account...</p>
          <p className="text-gray-500 text-sm mt-2">Creating your profile and workspace</p>
          <p className="text-gray-400 text-xs mt-4">User ID: {user.id}</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            If this takes more than 30 seconds, please refresh the page or contact support.
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user routing
  const getDefaultRoute = () => {
    if (profile) {
      logger.info('Determining default route for role:', profile.role);
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

  logger.info('User authenticated successfully, showing role-based routes', {
    userRole: profile.role,
    defaultRoute: getDefaultRoute()
  });

  return (
    <OnboardingGuard>
      <Routes>
        {/* Redirect auth to dashboard if already authenticated */}
        <Route path="/auth" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/landing" element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Developer OS */}
        {(profile?.role === 'developer' || profile?.role === 'admin') && (
          <Route path="/developer/*" element={<DeveloperOS />} />
        )}
        
        {/* Manager OS */}
        {profile?.role === 'manager' && (
          <Route path="/manager/*" element={<ManagerOS />} />
        )}
        
        {/* Sales OS - Available to all roles */}
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
  );
}

export default App;
