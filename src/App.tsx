
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';

// Import all pages
import Auth from '@/pages/Auth';
import SalesRepDashboard from '@/pages/SalesRepDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Analytics from '@/pages/Analytics';
import ManagerAnalytics from '@/pages/ManagerAnalytics';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';
import CompanyBrain from '@/pages/CompanyBrain';
import Dialer from '@/pages/Dialer';
import AIAgent from '@/pages/AIAgent';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';

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
                  
                  {/* Protected routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <SalesRepDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales-rep-dashboard" element={
                    <ProtectedRoute>
                      <SalesRepDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/manager-dashboard" element={
                    <ProtectedRoute>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin-dashboard" element={
                    <ProtectedRoute>
                      <AdminDashboard />
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
