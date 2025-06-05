
import { logger } from '@/utils/logger';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { AIContextProvider } from '@/contexts/AIContext';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import RequireAuth from '@/components/RequireAuth';
import OnboardingGuard from '@/components/OnboardingGuard';
import HealthCheck from '@/components/HealthCheck';
import RoleToggle from '@/components/DeveloperMode/RoleToggle';
import { Role } from '@/contexts/auth/types';

// Layout components
import SalesLayout from '@/layouts/SalesLayout';
import ManagerLayout from '@/layouts/ManagerLayout';
import DeveloperLayout from '@/layouts/DeveloperLayout';

// Auth pages
import AuthPage from '@/pages/Auth';
import Logout from '@/pages/Auth/Logout';

// Standalone pages
import LeadWorkspace from '@/pages/LeadWorkspace';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const DashboardRedirect: React.FC = () => {
  const { profile, isDemoMode, getLastSelectedRole } = useAuth();
  
  // Determine the correct role for redirection
  let targetRole: Role = 'sales_rep'; // Default fallback
  
  if (isDemoMode()) {
    targetRole = getLastSelectedRole() || 'sales_rep';
  } else if (profile?.role) {
    targetRole = profile.role as Role;
  }
  
  const dashboardUrl = getDashboardUrl({ role: targetRole });
  logger.info('Redirecting to dashboard:', { targetRole, dashboardUrl });
  
  return <Navigate to={dashboardUrl} replace />;
};

function App() {
  logger.info('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Router>
            <AuthProvider>
              <AIContextProvider>
                <Routes>
                  {/* Auth routes */}
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/signup" element={<AuthPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/logout" element={<Logout />} />
                  
                  {/* Root redirect - goes to appropriate dashboard */}
                  <Route path="/" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <DashboardRedirect />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Dashboard redirect for legacy URLs */}
                  <Route path="/dashboard" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <DashboardRedirect />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Sales OS routes */}
                  <Route path="/sales/*" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <SalesLayout />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Manager OS routes */}
                  <Route path="/manager/*" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <ManagerLayout />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Developer OS routes */}
                  <Route path="/developer/*" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <DeveloperLayout />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Standalone lead workspace route */}
                  <Route path="/lead-workspace/:leadId" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <LeadWorkspace />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Legacy redirects */}
                  <Route path="/lead-management" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <Navigate to="/sales/lead-management" replace />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Catch all - redirect to appropriate dashboard */}
                  <Route path="*" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <DashboardRedirect />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                </Routes>
                
                {/* Global components */}
                <Toaster />
                <HealthCheck />
                <RoleToggle />
              </AIContextProvider>
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
