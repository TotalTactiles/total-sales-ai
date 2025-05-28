
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AIContextProvider } from '@/contexts/AIContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import RequireAuth from '@/components/RequireAuth';
import OnboardingGuard from '@/components/OnboardingGuard';
import DashboardRouter from '@/components/DashboardRouter';
import AuthPage from '@/pages/auth/AuthPage';
import LeadWorkspace from '@/pages/LeadWorkspace';
import SalesRepOS from '@/layouts/SalesRepOS';
import ManagerOS from '@/layouts/ManagerOS';
import DeveloperOS from '@/layouts/DeveloperOS';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <AIContextProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Auth route */}
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Dashboard router - handles role-based redirects */}
                  <Route path="/" element={<DashboardRouter />} />
                  
                  {/* Lead Workspace - accessible from all OS */}
                  <Route 
                    path="/workspace/:id" 
                    element={
                      <RequireAuth>
                        <OnboardingGuard>
                          <LeadWorkspace />
                        </OnboardingGuard>
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Sales Rep OS */}
                  <Route 
                    path="/sales/*" 
                    element={
                      <RequireAuth>
                        <OnboardingGuard>
                          <SalesRepOS />
                        </OnboardingGuard>
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Manager OS */}
                  <Route 
                    path="/manager/*" 
                    element={
                      <RequireAuth>
                        <OnboardingGuard>
                          <ManagerOS />
                        </OnboardingGuard>
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Developer OS */}
                  <Route 
                    path="/developer/*" 
                    element={
                      <RequireAuth>
                        <OnboardingGuard>
                          <DeveloperOS />
                        </OnboardingGuard>
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Legacy redirects */}
                  <Route path="/leads" element={<Navigate to="/sales/leads" replace />} />
                  <Route path="/lead-workspace/:id" element={<Navigate to="/workspace/$1" replace />} />
                  
                  {/* Catch all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Toaster richColors position="top-right" />
            </AIContextProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
