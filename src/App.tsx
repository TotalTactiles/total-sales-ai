
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIContextProvider, useAIContext } from "@/contexts/AIContext";
import UnifiedAIBubble from "@/components/UnifiedAI/UnifiedAIBubble";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SalesRepDashboard from "./pages/SalesRepDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Dialer from "./pages/Dialer";
import LeadWorkspace from "./pages/LeadWorkspace";
import CompanyBrain from "./pages/CompanyBrain";
import AgentMissions from "./pages/AgentMissions";
import "./App.css";

const queryClient = new QueryClient();

// Component that renders the AI bubble with context
const AIBubbleWithContext = () => {
  const aiContext = useAIContext();
  
  return (
    <UnifiedAIBubble
      context={{
        workspace: aiContext.workspace,
        currentLead: aiContext.currentLead,
        isCallActive: aiContext.isCallActive,
        callDuration: aiContext.callDuration,
        emailContext: aiContext.emailContext,
        smsContext: aiContext.smsContext
      }}
    />
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <AIContextProvider>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
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
                      <ProtectedRoute requiredRole="manager">
                        <ManagerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-dashboard"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
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
                    path="/lead/:leadId"
                    element={
                      <ProtectedRoute>
                        <LeadWorkspace />
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
                    path="/agent-missions"
                    element={
                      <ProtectedRoute>
                        <AgentMissions />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                
                {/* Unified AI Assistant - Always present on protected routes */}
                <Routes>
                  <Route path="/sales-rep-dashboard" element={<AIBubbleWithContext />} />
                  <Route path="/manager-dashboard" element={<AIBubbleWithContext />} />
                  <Route path="/admin-dashboard" element={<AIBubbleWithContext />} />
                  <Route path="/dialer" element={<AIBubbleWithContext />} />
                  <Route path="/lead/:leadId" element={<AIBubbleWithContext />} />
                  <Route path="/company-brain" element={<AIBubbleWithContext />} />
                  <Route path="/agent-missions" element={<AIBubbleWithContext />} />
                </Routes>
              </div>
            </AIContextProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
