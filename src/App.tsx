
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/Layout/MainLayout";

// Auth Pages
import AuthPage from "./pages/auth/AuthPage";
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
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            {/* Protected Routes with MainLayout - Sales Rep */}
            <Route path="/sales/*" element={
              <RouteGuard allowedRoles={['sales_rep']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<SalesDashboard />} />
                    <Route path="leads" element={<LeadManagement />} />
                    <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </RouteGuard>
            } />

            {/* Protected Routes with MainLayout - Manager */}
            <Route path="/manager/*" element={
              <RouteGuard allowedRoles={['manager']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<ManagerDashboard />} />
                    <Route path="crm" element={<ManagerCRMIntegrations />} />
                    <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </RouteGuard>
            } />

            {/* Protected Routes with MainLayout - Developer */}
            <Route path="/dev/*" element={
              <RouteGuard allowedRoles={['developer', 'admin']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="*" element={<Navigate to="/dev/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </RouteGuard>
            } />

            {/* Protected Routes - Shared */}
            <Route path="/leads" element={
              <RouteGuard>
                <MainLayout>
                  <LeadManagement />
                </MainLayout>
              </RouteGuard>
            } />

            <Route path="/settings/*" element={
              <RouteGuard>
                <MainLayout>
                  <Routes>
                    <Route path="integrations" element={<IntegrationsPage />} />
                    <Route path="*" element={<Navigate to="/settings/integrations" replace />} />
                  </Routes>
                </MainLayout>
              </RouteGuard>
            } />

            {/* Integration Callbacks */}
            <Route path="/integrations/zoho/callback" element={
              <RouteGuard allowedRoles={['manager']}>
                <ZohoCallback />
              </RouteGuard>
            } />
            
            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
