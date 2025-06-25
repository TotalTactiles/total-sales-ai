
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import OnboardingGuard from '@/components/OnboardingGuard';

// Pages
import AuthPage from '@/pages/auth/AuthPage';
import SalesRepOnboarding from '@/pages/onboarding/sales-rep';
import ManagerOnboarding from '@/pages/onboarding/manager';
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import Pipeline from '@/pages/sales/Pipeline';
import AICoach from '@/pages/sales/AICoach';
import ManagerDashboard from '@/pages/ManagerDashboard';
import DeveloperDashboard from '@/pages/DeveloperDashboard';

// Manager OS Pages
import ManagerOverview from '@/pages/manager/Overview';
import RepPerformance from '@/pages/manager/RepPerformance';
import LeadManagement from '@/pages/manager/LeadManagement';
import AIAssistant from '@/pages/manager/AIAssistant';
import ManagerSettings from '@/pages/manager/Settings';

// Sales Rep Navigation Layout
import SalesRepNavigation from '@/components/sales/SalesRepNavigation';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="salesos-theme">
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Auth Route */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Sales Rep OS Routes with Navigation */}
                <Route path="/os/rep/*" element={
                  <OnboardingGuard>
                    <div className="flex">
                      <SalesRepNavigation />
                      <div className="flex-1">
                        <Routes>
                          <Route path="dashboard" element={<SalesRepDashboard />} />
                          <Route path="pipeline" element={<Pipeline />} />
                          <Route path="inbox" element={<div className="p-6 pl-72">Inbox - Coming Soon</div>} />
                          <Route path="academy" element={<div className="p-6 pl-72">Academy - Coming Soon</div>} />
                          <Route path="ai-coach" element={<AICoach />} />
                          <Route path="performance" element={<div className="p-6 pl-72">Performance - Coming Soon</div>} />
                          <Route path="profile" element={<div className="p-6 pl-72">Profile - Coming Soon</div>} />
                          <Route path="settings" element={<div className="p-6 pl-72">Settings - Coming Soon</div>} />
                        </Routes>
                      </div>
                    </div>
                  </OnboardingGuard>
                } />
                
                {/* Manager OS Routes */}
                <Route path="/manager/overview" element={<ManagerOverview />} />
                <Route path="/manager/rep-performance" element={<RepPerformance />} />
                <Route path="/manager/lead-management" element={<LeadManagement />} />
                <Route path="/manager/ai-assistant" element={<AIAssistant />} />
                <Route path="/manager/settings" element={<ManagerSettings />} />
                
                {/* Placeholder routes for remaining Manager pages */}
                <Route path="/manager/kpi-tracker" element={<div className="p-6">KPI Tracker - Coming Soon</div>} />
                <Route path="/manager/conversions" element={<div className="p-6">Conversions - Coming Soon</div>} />
                <Route path="/manager/notes" element={<div className="p-6">Notes - Coming Soon</div>} />
                <Route path="/manager/activity-log" element={<div className="p-6">Activity Log - Coming Soon</div>} />
                
                {/* Role-Specific Onboarding Routes */}
                <Route path="/onboarding/sales-rep" element={<SalesRepOnboarding />} />
                <Route path="/onboarding/manager" element={<ManagerOnboarding />} />
                
                {/* Legacy routes for backward compatibility */}
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/rep" element={<Navigate to="/os/rep/dashboard" replace />} />
                <Route path="/dev" element={<DeveloperDashboard />} />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/auth" replace />} />
                
                {/* Catch all - redirect to auth */}
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </Routes>
              
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
