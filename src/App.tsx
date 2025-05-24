
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SalesRepDashboard from "./pages/SalesRepDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LeadManagement from "./pages/LeadManagement";
import LeadWorkspace from "./pages/LeadWorkspace";
import Dialer from "./pages/Dialer";
import Analytics from "./pages/Analytics";
import AgentTools from "./pages/AgentTools";
import AgentMissions from "./pages/AgentMissions";
import CompanyBrain from "./pages/dashboard/CompanyBrain";
import Settings from "./pages/Settings";
import AIAgent from "./pages/AIAgent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/sales-rep-dashboard" element={<SalesRepDashboard />} />
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/leads" element={<LeadManagement />} />
            <Route path="/workspace/:id" element={<LeadWorkspace />} />
            <Route path="/dialer" element={<Dialer />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/tools" element={<AgentTools />} />
            <Route path="/agent-missions" element={<AgentMissions />} />
            <Route path="/company-brain" element={<CompanyBrain />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai-agent" element={<AIAgent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
