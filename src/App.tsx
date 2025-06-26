
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import DemoUserSetup from '@/components/DemoUserSetup';
import DeveloperTrigger from '@/components/DeveloperTrigger';

// Import pages
import AuthPage from '@/pages/auth/AuthPage';
import OnboardingPage from '@/pages/onboarding/OnboardingPage';

// Manager pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import ManagerLeads from '@/pages/manager/ManagerLeads';
import ManagerTeam from '@/pages/manager/ManagerTeam';
import ManagerMetrics from '@/pages/manager/ManagerMetrics';
import ManagerCoaching from '@/pages/manager/ManagerCoaching';
import ManagerProfile from '@/pages/manager/ManagerProfile';

// Sales Rep pages  
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import SalesLeads from '@/pages/sales/SalesLeads';
import SalesActivity from '@/pages/sales/SalesActivity';
import SalesAIInsights from '@/pages/sales/SalesAIInsights';
import SalesProfile from '@/pages/sales/SalesProfile';
import LeadWorkspace from '@/pages/sales/LeadWorkspace';

// Developer pages
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import DeveloperLogs from '@/pages/developer/DeveloperLogs';
import DeveloperFlags from '@/pages/developer/DeveloperFlags';
import DeveloperUpdates from '@/pages/developer/DeveloperUpdates';
import DeveloperBrain from '@/pages/developer/DeveloperBrain';

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
          <DeveloperTrigger />
          <Router>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              
              {/* Manager routes */}
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/leads" element={<ManagerLeads />} />
              <Route path="/manager/team" element={<ManagerTeam />} />
              <Route path="/manager/conversion-metrics" element={<ManagerMetrics />} />
              <Route path="/manager/coaching" element={<ManagerCoaching />} />
              <Route path="/manager/profile" element={<ManagerProfile />} />
              
              {/* Sales Rep routes */}
              <Route path="/sales/dashboard" element={<SalesRepDashboard />} />
              <Route path="/sales/leads" element={<SalesLeads />} />
              <Route path="/sales/lead/:leadId" element={<LeadWorkspace />} />
              <Route path="/sales/activity" element={<SalesActivity />} />
              <Route path="/sales/ai-insights" element={<SalesAIInsights />} />
              <Route path="/sales/profile" element={<SalesProfile />} />
              
              {/* Developer routes */}
              <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
              <Route path="/developer/logs" element={<DeveloperLogs />} />
              <Route path="/developer/flags" element={<DeveloperFlags />} />
              <Route path="/developer/system-updates" element={<DeveloperUpdates />} />
              <Route path="/developer/tsam-brain" element={<DeveloperBrain />} />
              
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
