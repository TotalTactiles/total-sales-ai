
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AIContextProvider } from '@/contexts/AIContext';
import { CallManagerProvider } from '@/contexts/CallManagerContext';
import SalesRepOS from '@/layouts/SalesRepOS';
import AuthPage from '@/pages/AuthPage';
import LogoutHandler from '@/components/LogoutHandler';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
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
                    path="/sales/*" 
                    element={
                      <ProtectedRoute>
                        <SalesRepOS />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/" element={<Navigate to="/sales/dashboard" replace />} />
                </Routes>
                <Toaster position="top-right" />
              </div>
            </CallManagerProvider>
          </AIContextProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
