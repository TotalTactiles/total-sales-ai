
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { AIContextProvider } from '@/contexts/AIContext';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load layouts
const SalesLayout = lazy(() => import('@/layouts/SalesLayout'));
const ManagerLayout = lazy(() => import('@/layouts/ManagerLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));

// Direct imports for other pages
import CompanyBrain from '@/pages/CompanyBrain';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <TooltipProvider>
          <AuthProvider>
            <AIContextProvider>
              <UnifiedAIProvider>
                <div className="App">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Auth Routes */}
                      <Route path="/auth/*" element={<AuthLayout />} />
                      
                      {/* Sales Routes */}
                      <Route path="/sales/*" element={
                        <ProtectedRoute>
                          <SalesLayout />
                        </ProtectedRoute>
                      } />
                      
                      {/* Manager Routes */}
                      <Route path="/manager/*" element={
                        <ProtectedRoute requiredRole="manager">
                          <ManagerLayout />
                        </ProtectedRoute>
                      } />
                      
                      {/* Company Brain */}
                      <Route path="/company-brain" element={
                        <ProtectedRoute>
                          <CompanyBrain />
                        </ProtectedRoute>
                      } />
                      
                      {/* Root redirect */}
                      <Route path="/" element={<Navigate to="/sales/dashboard" replace />} />
                      
                      {/* 404 */}
                      <Route path="/404" element={<NotFound />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </Suspense>
                  
                  <Toaster position="top-right" richColors />
                </div>
              </UnifiedAIProvider>
            </AIContextProvider>
          </AuthProvider>
        </TooltipProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
