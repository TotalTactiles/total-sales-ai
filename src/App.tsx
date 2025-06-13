
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { AIProvider } from '@/contexts/AIContext';
import { DemoDataProvider } from '@/contexts/DemoDataContext';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import RequireAuth from '@/components/RequireAuth';
import OnboardingGuard from '@/components/OnboardingGuard';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/auth/AuthPage';
import LogoutHandler from '@/components/LogoutHandler';
import NotFound from '@/pages/NotFound';

// Layout imports
import SalesLayout from '@/layouts/SalesLayout';
import ManagerLayout from '@/layouts/ManagerLayout';
import DeveloperLayout from '@/layouts/DeveloperLayout';

// Agent services
import { relevanceAIService } from '@/services/relevance/RelevanceAIService';
import { logger } from '@/utils/logger';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    const initializeAIServices = async () => {
      try {
        logger.info('Initializing AI services...');
        await relevanceAIService.initialize();
        logger.info('AI services initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize AI services:', error);
      }
    };

    initializeAIServices();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Router>
            <AuthProvider>
              <DemoDataProvider>
                <AIProvider>
                  <UnifiedAIProvider>
                    <OnboardingGuard>
                      <div className="min-h-screen bg-background">
                        <Routes>
                          {/* Public routes */}
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/auth" element={<AuthPage />} />
                          <Route path="/logout" element={<LogoutHandler />} />
                          <Route path="/login" element={<Navigate to="/auth" replace />} />
                          <Route path="/signup" element={<Navigate to="/auth" replace />} />

                          {/* Protected routes */}
                          <Route
                            path="/sales/*"
                            element={
                              <RequireAuth>
                                <SalesLayout />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/manager/*"
                            element={
                              <RequireAuth>
                                <ManagerLayout />
                              </RequireAuth>
                            }
                          />
                          <Route
                            path="/developer/*"
                            element={
                              <RequireAuth>
                                <DeveloperLayout />
                              </RequireAuth>
                            }
                          />
                          <Route path="*" element={<NotFound />} />
                        </Routes>

                        <Toaster
                          position="top-right"
                          toastOptions={{
                            duration: 4000,
                          }}
                        />
                      </div>
                    </OnboardingGuard>
                  </UnifiedAIProvider>
                </AIProvider>
              </DemoDataProvider>
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
