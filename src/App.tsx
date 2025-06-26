
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import DemoUserSetup from '@/components/DemoUserSetup';
import DeveloperTrigger from '@/components/DeveloperTrigger';
import RouteGuard from '@/components/auth/RouteGuard';

// Import pages
import AuthPage from '@/pages/auth/AuthPage';

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
          <Router>
            <DeveloperTrigger />
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Manager routes */}
              <Route path="/manager/dashboard" element={
                <RouteGuard allowedRoles={['manager']}>
                  <ManagerDashboard />
                </RouteGuard>
              } />
              <Route path="/manager/leads" element={
                <RouteGuard allowedRoles={['manager']}>
                  <ManagerLeads />
                </RouteGuard>
              } />
              <Route path="/manager/team" element={
                <RouteGuard allowedRoles={['manager']}>
                  <ManagerTeam />
                </RouteGuard>
              } />
              <Route path="/manager/conversion-metrics" element={
                <RouteGuard allowedRoles={['manager']}>
                  <ManagerMetrics />
                </RouteGuard>
              } />
              <Route path="/manager/coaching" element={
                <RouteGuard allowedRoles={['manager']}>
                  <ManagerCoaching />
                </RouteGuard>
              } />
              <Route path="/manager/profile" element={
                <RouteGuard allowedRoles={['manager']}>
                  <ManagerProfile />
                </RouteGuard>
              } />
              
              {/* Sales Rep routes */}
              <Route path="/sales/dashboard" element={
                <RouteGuard allowedRoles={['sales_rep']}>
                  <SalesRepDashboard />
                </RouteGuard>
              } />
              <Route path="/sales/leads" element={
                <RouteGuard allowedRoles={['sales_rep']}>
                  <SalesLeads />
                </RouteGuard>
              } />
              <Route path="/sales/lead/:leadId" element={
                <RouteGuard allowedRoles={['sales_rep']}>
                  <LeadWorkspace />
                </RouteGuard>
              } />
              <Route path="/sales/activity" element={
                <RouteGuard allowedRoles={['sales_rep']}>
                  <SalesActivity />
                </RouteGuard>
              } />
              <Route path="/sales/ai-insights" element={
                <RouteGuard allowedRoles={['sales_rep']}>
                  <SalesAIInsights />
                </RouteGuard>
              } />
              <Route path="/sales/profile" element={
                <RouteGuard allowedRoles={['sales_rep']}>
                  <SalesProfile />
                </RouteGuard>
              } />
              
              {/* Developer routes */}
              <Route path="/developer/dashboard" element={
                <RouteGuard allowedRoles={['developer', 'admin']}>
                  <DeveloperDashboard />
                </RouteGuard>
              } />
              <Route path="/developer/logs" element={
                <RouteGuard allowedRoles={['developer', 'admin']}>
                  <DeveloperLogs />
                </RouteGuard>
              } />
              <Route path="/developer/flags" element={
                <RouteGuard allowedRoles={['developer', 'admin']}>
                  <DeveloperFlags />
                </RouteGuard>
              } />
              <Route path="/developer/system-updates" element={
                <RouteGuard allowedRoles={['developer', 'admin']}>
                  <DeveloperUpdates />
                </RouteGuard>
              } />
              <Route path="/developer/tsam-brain" element={
                <RouteGuard allowedRoles={['developer', 'admin']}>
                  <DeveloperBrain />
                </RouteGuard>
              } />
              
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
