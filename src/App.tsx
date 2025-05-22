
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Dialer from "./pages/Dialer";
import NotFound from "./pages/NotFound";
import LeadManagement from "./pages/LeadManagement";
import Analytics from "./pages/Analytics";
import AgentMissions from "./pages/AgentMissions";
import CompanyBrain from "./pages/CompanyBrain";
import AgentTools from "./pages/AgentTools";
import Settings from "./pages/Settings";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dialer" element={<Dialer />} />
              <Route path="/leads" element={<LeadManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/missions" element={<AgentMissions />} />
              <Route path="/brain" element={<CompanyBrain />} />
              <Route path="/tools" element={<AgentTools />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
