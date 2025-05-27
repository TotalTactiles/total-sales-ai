
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AIContextProvider } from "./contexts/AIContext";
import { UnifiedAIProvider } from "./contexts/UnifiedAIContext";

// Auth and Guards
import RequireAuth from "./components/RequireAuth";

// Auth Pages
import AuthPage from "./pages/Auth";

// OS Layouts
import DeveloperLayout from "./layouts/DeveloperLayout";
import ManagerOS from "./layouts/ManagerOS";
import SalesRepOS from "./layouts/SalesRepOS";

// Developer Pages
import DeveloperDashboard from "./pages/developer/DeveloperDashboard";
import DeveloperSystemMonitor from "./pages/developer/SystemMonitor";
import DeveloperAILogs from "./pages/developer/AIBrainLogs";
import DeveloperAPILogs from "./pages/developer/APILogs";
import DeveloperErrorLogs from "./pages/developer/ErrorLogs";
import DeveloperQAChecklist from "./pages/developer/QAChecklist";
import DeveloperTestingSandbox from "./pages/developer/TestingSandbox";
import DeveloperVersionControl from "./pages/developer/VersionControl";
import DeveloperSettings from "./pages/developer/Settings";

// Manager Pages
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerAnalytics from "./pages/manager/Analytics";
import ManagerLeads from "./pages/manager/LeadManagement";
import ManagerCompanyBrain from "./pages/manager/CompanyBrain";
import ManagerAI from "./pages/manager/AI";
import ManagerSettings from "./pages/manager/Settings";

// Sales Rep Pages
import SalesRepDashboard from "./pages/sales/SalesRepDashboard";
import SalesRepAnalytics from "./pages/sales/Analytics";
import SalesRepLeads from "./pages/sales/LeadManagement";
import SalesRepAcademy from "./pages/sales/Academy";
import SalesRepAI from "./pages/sales/AI";
import SalesRepSettings from "./pages/sales/Settings";

// System Health
import HealthMonitor from "./components/SystemHealth/HealthMonitor";

// Initialize AI services
import { hybridAIOrchestrator } from "./services/ai/hybridAIOrchestrator";
import { aiLearningLayer } from "./services/ai/aiLearningLayer";
import { enhancedVoiceService } from "./services/ai/enhancedVoiceService";

const queryClient = new QueryClient();

// Initialize enhanced AI system
console.log('🧠 Initializing Production AI System...');
hybridAIOrchestrator;
aiLearningLayer;
enhancedVoiceService;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <AIContextProvider>
              <UnifiedAIProvider>
                <div className="relative">
                  {/* Health Monitor (development only) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="fixed bottom-4 left-4 z-40">
                      <HealthMonitor />
                    </div>
                  )}
                  
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/auth" element={<AuthPage />} />
                    
                    {/* Developer OS Routes */}
                    <Route
                      path="/developer/*"
                      element={
                        <RequireAuth requiredRole="developer">
                          <DeveloperLayout />
                        </RequireAuth>
                      }
                    >
                      <Route index element={<DeveloperDashboard />} />
                      <Route path="system-monitor" element={<DeveloperSystemMonitor />} />
                      <Route path="ai-brain-logs" element={<DeveloperAILogs />} />
                      <Route path="api-logs" element={<DeveloperAPILogs />} />
                      <Route path="error-logs" element={<DeveloperErrorLogs />} />
                      <Route path="qa-checklist" element={<DeveloperQAChecklist />} />
                      <Route path="testing-sandbox" element={<DeveloperTestingSandbox />} />
                      <Route path="version-control" element={<DeveloperVersionControl />} />
                      <Route path="settings" element={<DeveloperSettings />} />
                    </Route>

                    {/* Manager OS Routes */}
                    <Route
                      path="/manager/*"
                      element={
                        <RequireAuth requiredRole="manager">
                          <ManagerOS />
                        </RequireAuth>
                      }
                    >
                      <Route index element={<ManagerDashboard />} />
                      <Route path="analytics" element={<ManagerAnalytics />} />
                      <Route path="leads" element={<ManagerLeads />} />
                      <Route path="company-brain" element={<ManagerCompanyBrain />} />
                      <Route path="ai" element={<ManagerAI />} />
                      <Route path="settings" element={<ManagerSettings />} />
                    </Route>

                    {/* Sales Rep OS Routes */}
                    <Route
                      path="/sales/*"
                      element={
                        <RequireAuth requiredRole="sales_rep">
                          <SalesRepOS />
                        </RequireAuth>
                      }
                    >
                      <Route index element={<SalesRepDashboard />} />
                      <Route path="analytics" element={<SalesRepAnalytics />} />
                      <Route path="leads" element={<SalesRepLeads />} />
                      <Route path="academy" element={<SalesRepAcademy />} />
                      <Route path="ai" element={<SalesRepAI />} />
                      <Route path="settings" element={<SalesRepSettings />} />
                    </Route>

                    {/* Root redirect based on role */}
                    <Route path="/" element={<RoleBasedRedirect />} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </UnifiedAIProvider>
            </AIContextProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Component to handle role-based redirects
const RoleBasedRedirect: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect based on user role
  switch (profile?.role) {
    case 'admin':
    case 'developer':
      return <Navigate to="/developer" replace />;
    case 'manager':
      return <Navigate to="/manager" replace />;
    case 'sales_rep':
      return <Navigate to="/sales" replace />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

export default App;
