
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";

// Manager pages
import ManagerDashboard from "./pages/manager/Dashboard";
import BusinessOps from "./pages/manager/BusinessOps";
import ManagerTeam from "./pages/manager/Team";
import ManagerLeads from "./pages/manager/ManagerLeads";
import AIAssistant from "./pages/manager/AIAssistant";
import Security from "./pages/manager/Security";
import ManagerSettings from "./pages/manager/Settings";
import CompanyBrain from "./pages/CompanyBrain";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Manager OS</h1>
          <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  // For now, assume all users are managers
  const isManager = true;

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
          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </>
      ) : (
        // Default fallback
        <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
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
