
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import OnboardingGuard from '@/components/OnboardingGuard';

// Pages
import AuthPage from '@/pages/auth/AuthPage';
import Onboarding from '@/pages/Onboarding';
import SalesRepOnboarding from '@/pages/onboarding/sales-rep';
import ManagerOnboarding from '@/pages/onboarding/manager';
import PersonalizedRepDashboard from '@/pages/PersonalizedRepDashboard';
import PersonalizedManagerDashboard from '@/pages/PersonalizedManagerDashboard';
import SalesDashboard from '@/pages/sales/Dashboard';
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import DeveloperDashboard from '@/pages/DeveloperDashboard';
import TestUsersPage from '@/pages/TestUsersPage';

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
                
                {/* Test Users Route */}
                <Route path="/test-users" element={<TestUsersPage />} />
                
                {/* Manual Testing Routes - Direct Access */}
                <Route path="/dev" element={<DeveloperDashboard />} />
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/rep" element={<SalesRepDashboard />} />
                
                {/* New Role-Specific Onboarding Routes */}
                <Route path="/onboarding/sales-rep" element={<SalesRepOnboarding />} />
                <Route path="/onboarding/manager" element={<ManagerOnboarding />} />
                
                {/* Legacy Onboarding Route - redirect based on role */}
                <Route path="/onboarding" element={<Onboarding />} />
                
                {/* Personalized Dashboard Routes */}
                <Route 
                  path="/os/rep/dashboard" 
                  element={
                    <OnboardingGuard>
                      <PersonalizedRepDashboard />
                    </OnboardingGuard>
                  } 
                />
                <Route 
                  path="/os/manager/dashboard" 
                  element={
                    <OnboardingGuard>
                      <PersonalizedManagerDashboard />
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
                <Route path="/sales/dashboard" element={<SalesDashboard />} />
                <Route path="/sales/rep/dashboard" element={<SalesRepDashboard />} />
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
                
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
