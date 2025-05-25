import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster"
import AuthPage from '@/pages/AuthPage';
import SalesRepDashboard from '@/pages/SalesRepDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import SmartDialer from '@/pages/SmartDialer';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';
import Analytics from '@/pages/Analytics';
import AgentMissions from '@/pages/AgentMissions';
import CompanyBrain from '@/pages/CompanyBrain';
import AgentTools from '@/pages/AgentTools';
import Settings from '@/pages/Settings';
import AIAgent from '@/pages/AIAgent';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import DashboardRouter from '@/components/DashboardRouter';
import { AuthProvider } from '@/contexts/AuthContext';
import { AIContextProvider } from '@/contexts/AIContext';
import {
  QueryClient,
} from '@tanstack/react-query'
import ErrorBoundary from '@/components/ErrorBoundary';
import Reports from '@/pages/Reports';
import Access from '@/pages/Access';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClient>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AuthProvider>
              <AIContextProvider>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/signup" element={<AuthPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={<ProtectedRoute><Layout><SalesRepDashboard /></Layout></ProtectedRoute>} />
                  <Route path="/sales-rep-dashboard" element={<ProtectedRoute><Layout><SalesRepDashboard /></Layout></ProtectedRoute>} />
                  <Route path="/manager-dashboard" element={<ProtectedRoute><Layout><ManagerDashboard /></Layout></ProtectedRoute>} />
                  <Route path="/admin-dashboard" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
                  <Route path="/dialer" element={<ProtectedRoute><Layout><SmartDialer /></Layout></ProtectedRoute>} />
                  <Route path="/leads" element={<ProtectedRoute><Layout><LeadManagement /></Layout></ProtectedRoute>} />
                  <Route path="/leads/:id" element={<ProtectedRoute><Layout><LeadWorkspace /></Layout></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
                  <Route path="/access" element={<ProtectedRoute><Layout><Access /></Layout></ProtectedRoute>} />
                  <Route path="/agent-missions" element={<ProtectedRoute><Layout><AgentMissions /></Layout></ProtectedRoute>} />
                  <Route path="/company-brain" element={<ProtectedRoute><Layout><CompanyBrain /></Layout></ProtectedRoute>} />
                  <Route path="/tools" element={<ProtectedRoute><Layout><AgentTools /></Layout></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                  <Route path="/ai-agent" element={<ProtectedRoute><Layout><AIAgent /></Layout></ProtectedRoute>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AIContextProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClient>
        <Toaster />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
