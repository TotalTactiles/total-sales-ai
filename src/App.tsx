
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LeadManagement from "./pages/LeadManagement";
import LeadWorkspace from "./pages/LeadWorkspace";
import Analytics from "./pages/Analytics";
import Dialer from "./pages/Dialer";
import Settings from "./pages/Settings";
import CompanyBrain from "./pages/dashboard/CompanyBrain";
import SalesRepDashboard from "./pages/SalesRepDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AIAgent from "./pages/AIAgent";
import AgentMissions from "./pages/AgentMissions";
import AgentTools from "./pages/AgentTools";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import AuthPage from "./pages/auth/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leads"
                  element={
                    <ProtectedRoute>
                      <LeadManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leads/:leadId"
                  element={
                    <ProtectedRoute>
                      <LeadWorkspace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dialer"
                  element={
                    <ProtectedRoute>
                      <Dialer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/company-brain"
                  element={
                    <ProtectedRoute>
                      <CompanyBrain />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sales-rep-dashboard"
                  element={
                    <ProtectedRoute>
                      <SalesRepDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager-dashboard"
                  element={
                    <ProtectedRoute>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-agent"
                  element={
                    <ProtectedRoute>
                      <AIAgent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agent-missions"
                  element={
                    <ProtectedRoute>
                      <AgentMissions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agent-tools"
                  element={
                    <ProtectedRoute>
                      <AgentTools />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
