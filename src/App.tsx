
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AIContextProvider } from '@/contexts/AIContext';
import { CallManagerProvider } from '@/contexts/CallManagerContext';
import MainLayout from '@/layouts/MainLayout';
import AuthPage from '@/pages/AuthPage';
import LogoutHandler from '@/components/LogoutHandler';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

// Create query client instance outside of component to avoid recreating on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AIContextProvider>
            <CallManagerProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/login" element={<Navigate to="/auth" replace />} />
                  <Route path="/logout" element={<LogoutHandler />} />
                  <Route 
                    path="/*" 
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
                <Toaster position="top-right" />
              </div>
            </CallManagerProvider>
          </AIContextProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
