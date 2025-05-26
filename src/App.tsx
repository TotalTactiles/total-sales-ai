
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';

// Import pages
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

// Manager pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';

// Sales Rep pages  
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';

// Shared pages (will be refactored to role-specific versions)
import Analytics from '@/pages/Analytics';
import ManagerAnalytics from '@/pages/ManagerAnalytics';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';
import CompanyBrain from '@/pages/CompanyBrain';
import Dialer from '@/pages/Dialer';
import AIAgent from '@/pages/AIAgent';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Router>
            <AuthProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth/*" element={<Auth />} />
                  
                  {/* Manager routes */}
                  <Route path="/manager/dashboard" element={
                    <ProtectedRoute requiredRole="manager">
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/manager/analytics" element={
                    <ProtectedRoute requiredRole="manager">
                      <ManagerAnalytics />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/manager/*" element={
                    <ProtectedRoute requiredRole="manager">
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Sales Rep routes */}
                  <Route path="/sales/dashboard" element={
                    <ProtectedRoute requiredRole="sales_rep">
                      <SalesRepDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales/leads" element={
                    <ProtectedRoute requiredRole="sales_rep">
                      <LeadManagement />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales/analytics" element={
                    <ProtectedRoute requiredRole="sales_rep">
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales/company-brain" element={
                    <ProtectedRoute requiredRole="sales_rep">
                      <CompanyBrain />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales/dialer" element={
                    <ProtectedRoute requiredRole="sales_rep">
                      <Dialer />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales/ai-agent" element={
                    <ProtectedRoute requiredRole="sales_rep">
                      <AIAgent />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales/*" element={
                    <ProtectedRoute requiredRole="sales_rep">
                      <SalesRepDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Legacy routes with redirects */}
                  <Route path="/" element={
                    <ProtectedRoute roleBasedRedirect>
                      <SalesRepDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales-rep-dashboard" element={
                    <ProtectedRoute roleBasedRedirect>
                      <SalesRepDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/manager-dashboard" element={
                    <ProtectedRoute roleBasedRedirect>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Shared routes (will be moved to role-specific) */}
                  <Route path="/leads" element={
                    <ProtectedRoute>
                      <LeadManagement />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/lead-workspace/:id?" element={
                    <ProtectedRoute>
                      <LeadWorkspace />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/manager-analytics" element={
                    <ProtectedRoute>
                      <ManagerAnalytics />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/company-brain" element={
                    <ProtectedRoute>
                      <CompanyBrain />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/dialer" element={
                    <ProtectedRoute>
                      <Dialer />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/ai-agent" element={
                    <ProtectedRoute>
                      <AIAgent />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                <Toaster />
              </div>
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
