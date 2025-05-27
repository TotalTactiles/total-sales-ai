
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Guards and Layout Components
import OnboardingGuard from "./components/OnboardingGuard";
import RoleToggle from "./components/DeveloperMode/RoleToggle";

// Auth Pages
import AuthPage from "./pages/Auth";

// Dashboard Components
import SalesLayout from "./layouts/SalesLayout";
import ManagerLayout from "./layouts/ManagerLayout";

// Standalone Pages
import LandingPage from "./pages/LandingPage";
import OnboardingTest from "./pages/OnboardingTest";

// Health monitoring for production readiness
import HealthMonitor from "./components/SystemHealth/HealthMonitor";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <OnboardingGuard>
              <div className="relative">
                {/* Developer Mode Role Toggle */}
                <RoleToggle />
                
                {/* Health Monitor (only in dev) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="fixed bottom-4 left-4 z-40">
                    <HealthMonitor />
                  </div>
                )}
                
                <Routes>
                  {/* Public Routes */}
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Onboarding Test Route */}
                  <Route path="/onboarding-test" element={<OnboardingTest />} />
                  
                  {/* Protected Sales Rep Routes */}
                  <Route path="/sales-rep-dashboard/*" element={<SalesLayout />} />
                  <Route path="/*" element={<SalesLayout />} />
                  
                  {/* Protected Manager Routes */}
                  <Route path="/manager-dashboard/*" element={<ManagerLayout />} />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </OnboardingGuard>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
