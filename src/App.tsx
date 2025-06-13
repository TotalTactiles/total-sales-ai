
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { DemoDataProvider } from '@/contexts/DemoDataContext';
import { AIProvider } from '@/contexts/AIContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RequireAuth from '@/components/RequireAuth';
import OnboardingGuard from '@/components/OnboardingGuard';
import LogoutHandler from '@/components/LogoutHandler';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/auth/AuthPage';
import OnboardingPage from '@/pages/onboarding/OnboardingPage';
import SalesLayout from '@/layouts/SalesLayout';
import ManagerLayout from '@/layouts/ManagerLayout';
import DeveloperLayout from '@/layouts/DeveloperLayout';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingScreen from '@/components/common/LoadingScreen';
import FullPageError from '@/components/common/FullPageError';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DemoDataProvider>
          <AIProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <ErrorBoundary fallback={<FullPageError />}>
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/logout" element={<LogoutHandler />} />
                      
                      {/* Onboarding route */}
                      <Route 
                        path="/onboarding" 
                        element={
                          <RequireAuth>
                            <OnboardingPage />
                          </RequireAuth>
                        } 
                      />
                      
                      {/* Protected routes */}
                      <Route 
                        path="/sales/*" 
                        element={
                          <RequireAuth>
                            <OnboardingGuard>
                              <SalesLayout />
                            </OnboardingGuard>
                          </RequireAuth>
                        } 
                      />
                      
                      <Route 
                        path="/manager/*" 
                        element={
                          <RequireAuth>
                            <OnboardingGuard>
                              <ManagerLayout />
                            </OnboardingGuard>
                          </RequireAuth>
                        } 
                      />
                      
                      <Route 
                        path="/developer/*" 
                        element={
                          <RequireAuth>
                            <OnboardingGuard>
                              <DeveloperLayout />
                            </OnboardingGuard>
                          </RequireAuth>
                        } 
                      />
                      
                      {/* Catch all route */}
                      <Route path="/404" element={<NotFound />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
                
                <Toaster 
                  position="top-right" 
                  richColors 
                  closeButton 
                  duration={4000}
                />
              </div>
            </Router>
          </AIProvider>
        </DemoDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
