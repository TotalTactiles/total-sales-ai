
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import { DemoDataProvider } from '@/contexts/DemoDataContext';
import RouteGuard from '@/components/auth/RouteGuard';
import OnboardingGuard from '@/components/OnboardingGuard';
import ErrorBoundary from '@/components/auth/ErrorBoundary';
import AuthPage from '@/pages/auth/AuthPage';
import MainLayout from '@/layouts/MainLayout';
import LogoutHandler from '@/components/LogoutHandler';
import { envConfig } from '@/utils/envConfig';
import { logger } from '@/utils/logger';

// Initialize environment configuration
envConfig.initialize();

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Router>
            <AuthProvider>
              <DemoDataProvider>
                <UnifiedAIProvider>
                  <OnboardingGuard>
                    <ErrorBoundary>
                      <div className="min-h-screen bg-background">
                        <Routes>
                          {/* Public routes */}
                          <Route path="/auth" element={<AuthPage />} />
                          <Route path="/logout" element={<LogoutHandler />} />
                          
                          {/* Protected main application routes */}
                          <Route path="/sales/*" element={
                            <RouteGuard allowedRoles={['sales_rep']}>
                              <MainLayout />
                            </RouteGuard>
                          } />
                          
                          <Route path="/manager/*" element={
                            <RouteGuard allowedRoles={['manager']}>
                              <MainLayout />
                            </RouteGuard>
                          } />
                          
                          <Route path="/developer/*" element={
                            <RouteGuard allowedRoles={['developer', 'admin']}>
                              <MainLayout />
                            </RouteGuard>
                          } />
                          
                          {/* Catch-all protected route */}
                          <Route path="/app" element={
                            <RouteGuard>
                              <MainLayout />
                            </RouteGuard>
                          } />
                          
                          {/* Default redirects */}
                          <Route path="/" element={<Navigate to="/auth" replace />} />
                          <Route path="*" element={<Navigate to="/auth" replace />} />
                        </Routes>
                      </div>
                    </ErrorBoundary>
                  </OnboardingGuard>
                  
                  <Toaster 
                    position="bottom-right"
                    expand={true}
                    richColors
                    closeButton
                  />
                </UnifiedAIProvider>
              </DemoDataProvider>
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
