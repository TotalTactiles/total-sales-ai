
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import { DemoDataProvider } from '@/contexts/DemoDataContext';
import RequireAuth from '@/components/RequireAuth';
import OnboardingGuard from '@/components/OnboardingGuard';
import AuthPage from '@/pages/auth/AuthPage';
import SalesRepOS from '@/layouts/SalesRepOS';
import ManagerOS from '@/layouts/ManagerOS';
import RelevanceAIDeveloperPage from '@/pages/developer/RelevanceAIDeveloper';
import { envConfig } from '@/utils/envConfig';
import { logger } from '@/utils/logger';

// Initialize environment configuration
envConfig.initialize();

// Global error boundary
class ErrorBoundary extends React.Component<
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('App error boundary caught error:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
                    <div className="min-h-screen bg-background">
                      <Routes>
                        {/* Public routes */}
                        <Route path="/auth" element={<AuthPage />} />
                        
                        {/* Protected routes */}
                        <Route path="/sales/*" element={
                          <RequireAuth>
                            <SalesRepOS />
                          </RequireAuth>
                        } />
                        
                        <Route path="/manager/*" element={
                          <RequireAuth>
                            <ManagerOS />
                          </RequireAuth>
                        } />
                        
                        <Route path="/developer" element={
                          <RequireAuth>
                            <RelevanceAIDeveloperPage />
                          </RequireAuth>
                        } />
                        
                        {/* Default redirects */}
                        <Route path="/" element={<Navigate to="/sales" replace />} />
                        <Route path="*" element={<Navigate to="/sales" replace />} />
                      </Routes>
                    </div>
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
