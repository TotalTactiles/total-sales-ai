
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
import RoleBasedRoute from "./components/RoleBasedRoute";

// Auth Pages
import AuthPage from "./pages/Auth";

// OS Layouts
import DeveloperOS from "./layouts/DeveloperOS";
import ManagerOS from "./layouts/ManagerOS";
import SalesRepOS from "./layouts/SalesRepOS";

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
                <Routes>
                  {/* Public Routes */}
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Role-Based Protected Routes */}
                  <Route
                    path="/developer/*"
                    element={
                      <RoleBasedRoute allowedRoles={['developer', 'admin']}>
                        <DeveloperOS />
                      </RoleBasedRoute>
                    }
                  />

                  <Route
                    path="/manager/*"
                    element={
                      <RoleBasedRoute allowedRoles={['manager', 'admin']}>
                        <ManagerOS />
                      </RoleBasedRoute>
                    }
                  />

                  <Route
                    path="/sales/*"
                    element={
                      <RoleBasedRoute allowedRoles={['sales_rep', 'admin']}>
                        <SalesRepOS />
                      </RoleBasedRoute>
                    }
                  />

                  {/* Root redirect based on role */}
                  <Route path="/" element={<RoleBasedRedirect />} />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
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
  return (
    <RequireAuth>
      <RoleBasedRoute allowedRoles={['sales_rep', 'manager', 'developer', 'admin']}>
        <AutoRedirect />
      </RoleBasedRoute>
    </RequireAuth>
  );
};

// Auto-redirect component based on user role
const AutoRedirect: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect based on user role
  switch (profile?.role) {
    case 'developer':
    case 'admin':
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
