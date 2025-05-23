
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dialer from "./pages/Dialer";
import NotFound from "./pages/NotFound";
import LeadManagement from "./pages/LeadManagement";
import Analytics from "./pages/Analytics";
import AgentMissions from "./pages/AgentMissions";
import CompanyBrain from "./pages/dashboard/CompanyBrain";
import AgentTools from "./pages/AgentTools";
import Settings from "./pages/Settings";
import AIAgent from "./pages/AIAgent";
import Auth from "./pages/Auth";
import SalesRepDashboard from "./pages/SalesRepDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Public landing page */}
                  <Route path="/" element={<Navigate to="/auth" replace />} />
                  
                  {/* Protected routes for Sales Rep */}
                  <Route 
                    path="/dashboard/rep" 
                    element={
                      <ProtectedRoute requiredRole="sales_rep">
                        <SalesRepDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Protected routes for Manager */}
                  <Route 
                    path="/dashboard/manager" 
                    element={
                      <ProtectedRoute requiredRole="manager">
                        <ManagerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Other protected routes - accessible to all authenticated users */}
                  <Route 
                    path="/dialer" 
                    element={
                      <ProtectedRoute>
                        <Dialer />
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
                    path="/analytics" 
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/missions" 
                    element={
                      <ProtectedRoute>
                        <AgentMissions />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/dashboard/company-brain" 
                    element={
                      <ProtectedRoute>
                        <CompanyBrain />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/tools" 
                    element={
                      <ProtectedRoute>
                        <AgentTools />
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
                    path="/ai-agent" 
                    element={
                      <ProtectedRoute>
                        <AIAgent />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Legacy route redirect */}
                  <Route path="/brain" element={<Navigate to="/dashboard/company-brain" replace />} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
