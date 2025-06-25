
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
import ManagerDashboard from '@/pages/ManagerDashboard';
import DeveloperDashboard from '@/pages/DeveloperDashboard';

// Manager OS Pages
import ManagerOverview from '@/pages/manager/Overview';
import RepPerformance from '@/pages/manager/RepPerformance';
import LeadManagement from '@/pages/manager/LeadManagement';
import AIAssistant from '@/pages/manager/AIAssistant';
import ManagerSettings from '@/pages/manager/Settings';

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
                
                {/* Personalized Dashboard Routes */}
                <Route 
                  path="/os/rep/dashboard" 
                  element={
                    <OnboardingGuard>
                      <SalesRepDashboard />
                    </OnboardingGuard>
                  } 
                />
                <Route 
                  path="/os/manager/dashboard" 
                  element={
                    <OnboardingGuard>
                      <ManagerOverview />
                    </OnboardingGuard>
                  } 
                />
                <Route 
                  path="/os/dev/dashboard" 
                  element={
                    <OnboardingGuard>
                      <DeveloperDashboard />
                    </OnboardingGuard>
                  } 
                />

                {/* Legacy routes for backward compatibility */}
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/rep" element={<SalesRepDashboard />} />
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
