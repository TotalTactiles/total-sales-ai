
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import LeadManagement from "./pages/LeadManagement";
import Dialer from "./pages/Dialer";
import CompanyBrain from "./pages/CompanyBrain";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Manager pages
import ManagerDashboard from "./pages/manager/Dashboard";
import BusinessOps from "./pages/manager/BusinessOps";
import ManagerTeam from "./pages/manager/Team";
import ManagerLeads from "./pages/manager/ManagerLeads";
import AIAssistant from "./pages/manager/AIAssistant";
import Security from "./pages/manager/Security";
import ManagerSettings from "./pages/manager/Settings";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, profile } = useAuth();

  if (!user) {
    return <Index />;
  }

  const isManager = profile?.role === 'manager';

  return (
    <Routes>
      {isManager ? (
        // Manager routes
        <>
          <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/business-ops" element={<BusinessOps />} />
          <Route path="/manager/team" element={<ManagerTeam />} />
          <Route path="/manager/leads" element={<ManagerLeads />} />
          <Route path="/manager/ai-assistant" element={<AIAssistant />} />
          <Route path="/manager/company-brain" element={<CompanyBrain />} />
          <Route path="/manager/reports" element={<Reports />} />
          <Route path="/manager/security" element={<Security />} />
          <Route path="/manager/settings" element={<ManagerSettings />} />
          {/* Redirect any non-manager routes */}
          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </>
      ) : (
        // Sales rep routes
        <>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<LeadManagement />} />
          <Route path="/dialer" element={<Dialer />} />
          <Route path="/company-brain" element={<CompanyBrain />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          {/* Redirect any manager routes */}
          <Route path="/manager/*" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
