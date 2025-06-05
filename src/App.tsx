
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

const RootRedirect = () => {
  const { profile } = useAuth();
  const url = getDashboardUrl({ role: profile?.role ?? 'sales_rep' });
  return <Navigate to={url} replace />;
};

function App() {
  console.log('App component rendering');
  
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
                  
                  {/* Root redirect */}
                  <Route path="/" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <RootRedirect />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Sales OS routes with nested lead workspace overlay */}
                  <Route path="/sales/*" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <>
                          <SalesLayout />
                          <Routes>
                            <Route path="/lead-workspace/:leadId" element={<LeadWorkspace />} />
                          </Routes>
                        </>
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Manager OS routes with nested lead workspace overlay */}
                  <Route path="/manager/*" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <>
                          <ManagerLayout />
                          <Routes>
                            <Route path="/lead-workspace/:leadId" element={<LeadWorkspace />} />
                          </Routes>
                        </>
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
                  
                  {/* Direct lead management access */}
                  <Route path="/lead-management" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <Navigate to="/sales/lead-management" replace />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Standalone lead workspace route for direct access */}
                  <Route path="/lead-workspace/:leadId" element={
                    <RequireAuth>
                      <OnboardingGuard>
                        <LeadWorkspace />
                      </OnboardingGuard>
                    </RequireAuth>
                  } />
                  
                  {/* Fallback */}
                  <Route path="*" element={<RootRedirect />} />
                </Routes>
                <Toaster />
              </AIContextProvider>
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
