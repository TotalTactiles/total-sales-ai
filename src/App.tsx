
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/Layout/MainLayout";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/signup";
import OnboardingPage from "./pages/onboarding/OnboardingPage";

// Sales Rep Pages
import Dashboard from "./components/dashboard/Dashboard";
import SalesDashboard from "./pages/sales/SalesDashboard";

// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerCRMIntegrations from "./pages/manager/CRMIntegrations";

// Settings Pages
import IntegrationsPage from "./pages/settings/IntegrationsPage";

// Integration Callbacks
import ZohoCallback from "./pages/integrations/ZohoCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignUpPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              
              {/* Integration Callbacks */}
              <Route path="/integrations/zoho/callback" element={<ZohoCallback />} />
              
              {/* Sales Rep Routes */}
              <Route path="/os/rep/dashboard" element={<Dashboard />} />
              <Route path="/sales/dashboard" element={<SalesDashboard />} />
              
              {/* Manager Routes */}
              <Route path="/os/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/crm" element={<ManagerCRMIntegrations />} />
              
              {/* Settings Routes */}
              <Route path="/settings/integrations" element={<IntegrationsPage />} />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/os/rep/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/os/rep/dashboard" replace />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
