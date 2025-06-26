import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import DemoUserSetup from '@/components/DemoUserSetup';

// Import pages
import AuthPage from '@/pages/auth/AuthPage';
import DeveloperDashboard from '@/pages/DeveloperDashboard';

// Manager pages
import ManagerOverview from '@/pages/manager/Overview';
import ManagerDashboard from '@/pages/manager/Dashboard';

// Sales Rep pages  
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';

// Developer pages
import DevDashboard from '@/pages/developer/Dashboard';

// Other pages
import OnboardingPage from '@/pages/onboarding/OnboardingPage';
import ManagerOnboarding from '@/pages/onboarding/manager';
import SalesRepOnboarding from '@/pages/onboarding/sales-rep';

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
      <ThemeProvider>
        <AuthProvider>
          <DemoUserSetup />
          <Router>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Manager routes */}
              <Route path="/manager/overview" element={<ManagerOverview />} />
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/*" element={<Navigate to="/manager/overview" replace />} />
              
              {/* Sales Rep routes */}
              <Route path="/os/rep/dashboard" element={<SalesRepDashboard />} />
              <Route path="/sales/dashboard" element={<SalesRepDashboard />} />
              <Route path="/sales/*" element={<Navigate to="/sales/dashboard" replace />} />
              
              {/* Developer routes */}
              <Route path="/developer/dashboard" element={<DevDashboard />} />
              <Route path="/developer/*" element={<Navigate to="/developer/dashboard" replace />} />
              <Route path="/dev" element={<DeveloperDashboard />} />
              
              {/* Onboarding routes */}
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/onboarding/manager" element={<ManagerOnboarding />} />
              <Route path="/onboarding/sales-rep" element={<SalesRepOnboarding />} />
              
              {/* Default route */}
              <Route path="/" element={<Navigate to="/auth" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
