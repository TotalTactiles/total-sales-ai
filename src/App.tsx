
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AIContextProvider } from "./contexts/AIContext";

// Guards and Layout Components
import OnboardingGuard from "./components/OnboardingGuard";
import DeveloperModeToggle from "./components/DeveloperMode/DeveloperModeToggle";

// Auth Pages
import AuthPage from "./pages/Auth";

// Dashboard Components
import SalesLayout from "./layouts/SalesLayout";
import ManagerLayout from "./layouts/ManagerLayout";

// Standalone Pages
import LandingPage from "./pages/LandingPage";
import OnboardingTest from "./pages/OnboardingTest";
import DeveloperDashboard from "./pages/DeveloperDashboard";

// Health monitoring for production readiness
import HealthMonitor from "./components/SystemHealth/HealthMonitor";

// Enhanced AI System
import { hybridAIOrchestrator } from "./services/ai/hybridAIOrchestrator";
import { aiLearningLayer } from "./services/ai/aiLearningLayer";
import { enhancedVoiceService } from "./services/ai/enhancedVoiceService";

const queryClient = new QueryClient();

// Initialize enhanced AI system
console.log('Initializing Enhanced Master Brain AI System...');
hybridAIOrchestrator; // Initialize the orchestrator
aiLearningLayer; // Initialize the learning layer
enhancedVoiceService; // Initialize enhanced voice

function App() {
  const [currentMode, setCurrentMode] = React.useState<'sales_rep' | 'manager' | 'developer'>('sales_rep');

  const handleModeChange = (mode: 'sales_rep' | 'manager' | 'developer') => {
    setCurrentMode(mode);
  };

  const renderContent = () => {
    switch (currentMode) {
      case 'developer':
        return <DeveloperDashboard />;
      case 'manager':
        return <ManagerLayout />;
      case 'sales_rep':
      default:
        return <SalesLayout />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <AIContextProvider>
              <OnboardingGuard>
                <div className="relative">
                  {/* Developer Mode Toggle */}
                  <DeveloperModeToggle onModeChange={handleModeChange} />
                  
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
                    
                    {/* Main Application Routes - handled by mode switching */}
                    <Route path="/*" element={renderContent()} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </OnboardingGuard>
            </AIContextProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
