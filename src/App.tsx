
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/Layout/MainLayout";

// Auth Pages
import SignUpPage from "./pages/signup";
import OnboardingPage from "./pages/onboarding/OnboardingPage";

// Public Pages
import NewLandingPage from "./pages/NewLandingPage";

// Sales Rep Pages
import Dashboard from "./components/dashboard/Dashboard";
import SalesDashboard from "./pages/sales/SalesDashboard";
import LeadManagement from "./pages/LeadManagement";

// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerCRMIntegrations from "./pages/manager/CRMIntegrations";

// Settings Pages
import IntegrationsPage from "./pages/settings/IntegrationsPage";

// Integration Callbacks
import ZohoCallback from "./pages/integrations/ZohoCallback";

// Auth Guard Component
import RouteGuard from "./components/auth/RouteGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes - No Auth Required */}
            <Route path="/landing" element={<NewLandingPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth" element={<SignUpPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            {/* Protected Routes with MainLayout */}
            <Route path="/*" element={
              <RouteGuard>
                <MainLayout>
                  <Routes>
                    {/* Integration Callbacks - Manager Only */}
                    <Route path="/integrations/zoho/callback" element={<ZohoCallback />} />
                    
                    {/* Sales Rep Routes */}
                    <Route path="/os/rep/dashboard" element={<Dashboard />} />
                    <Route path="/sales/dashboard" element={<SalesDashboard />} />
                    <Route path="/leads" element={<LeadManagement />} />
                    <Route path="/sales/leads" element={<LeadManagement />} />
                    
                    {/* Manager Routes */}
                    <Route path="/os/manager/dashboard" element={<ManagerDashboard />} />
                    <Route path="/manager/crm" element={<ManagerCRMIntegrations />} />
                    
                    {/* Settings Routes - Role-based */}
                    <Route path="/settings/integrations" element={<IntegrationsPage />} />
                    
                    {/* Default redirect based on auth status */}
                    <Route path="/" element={<Navigate to="/sales/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </RouteGuard>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
