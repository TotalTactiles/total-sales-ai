
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
const ManagerOS = lazy(() => import('@/layouts/ManagerOS'));
const DeveloperOS = lazy(() => import('@/layouts/DeveloperOS'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));

// Direct imports for other pages
import NotFound from '@/pages/NotFound';
import LeadWorkspace from '@/pages/LeadWorkspace';

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
                      
                      {/* Lead Workspace Route (accessible from any OS) */}
                      <Route path="/workspace/:leadId" element={
                        <ProtectedRoute>
                          <LeadWorkspace />
                        </ProtectedRoute>
                      } />
                      
                      {/* Sales OS Routes */}
                      <Route path="/sales/*" element={
                        <ProtectedRoute>
                          <SalesLayout />
                        </ProtectedRoute>
                      } />
                      
                      {/* Manager OS Routes */}
                      <Route path="/manager/*" element={
                        <ProtectedRoute requiredRole="manager">
                          <ManagerOS />
                        </ProtectedRoute>
                      } />
                      
                      {/* Developer OS Routes */}
                      <Route path="/developer/*" element={
                        <ProtectedRoute requiredRole="admin">
                          <DeveloperOS />
                        </ProtectedRoute>
                      } />
                      
                      {/* Root redirect based on role */}
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
