
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { AIContextProvider } from '@/contexts/AIContext';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import RequireAuth from '@/components/RequireAuth';
import OnboardingGuard from '@/components/OnboardingGuard';

// Layout components
import SalesLayout from '@/layouts/SalesLayout';
import ManagerLayout from '@/layouts/ManagerLayout';
import DeveloperLayout from '@/layouts/DeveloperLayout';

// Auth pages
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <AIContextProvider>
              <Routes>
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <RequireAuth>
                    <OnboardingGuard>
                      <Navigate to="/sales" replace />
                    </OnboardingGuard>
                  </RequireAuth>
                } />
                
                {/* Sales routes */}
                <Route path="/sales/*" element={
                  <RequireAuth>
                    <OnboardingGuard>
                      <SalesLayout />
                    </OnboardingGuard>
                  </RequireAuth>
                } />
                
                {/* Manager routes */}
                <Route path="/manager/*" element={
                  <RequireAuth>
                    <OnboardingGuard>
                      <ManagerLayout />
                    </OnboardingGuard>
                  </RequireAuth>
                } />
                
                {/* Developer routes */}
                <Route path="/developer/*" element={
                  <RequireAuth>
                    <OnboardingGuard>
                      <DeveloperLayout />
                    </OnboardingGuard>
                  </RequireAuth>
                } />
                
                {/* Standalone lead workspace route */}
                <Route path="/lead-workspace/:id" element={
                  <RequireAuth>
                    <OnboardingGuard>
                      <LeadWorkspace />
                    </OnboardingGuard>
                  </RequireAuth>
                } />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/sales" replace />} />
              </Routes>
              <Toaster />
            </AIContextProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
