import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { UnifiedAIProvider } from '@/contexts/UnifiedAIContext';
import Navigation from '@/components/Navigation';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import LeadManagement from '@/pages/LeadManagement';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard';
import ReportsDashboard from '@/pages/ReportsDashboard';
import SecurityDashboard from '@/pages/SecurityDashboard';
import AgentManagement from '@/pages/AgentManagement';
import AutomationDashboard from '@/pages/AutomationDashboard';
import DeveloperDashboard from '@/pages/DeveloperDashboard';
import CompanyBrain from '@/pages/CompanyBrain';
import SalesRepDashboard from '@/pages/SalesRepDashboard';
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import ManagerBusinessOps from '@/pages/manager/ManagerBusinessOps';
import ManagerTeam from '@/pages/manager/ManagerTeam';
import ManagerLeadManagement from '@/pages/manager/ManagerLeadManagement';
import ManagerCompanyBrain from '@/pages/manager/ManagerCompanyBrain';

function App() {
  return (
    <QueryClient>
      <UnifiedAIProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Core routes */}
              <Route path="/" element={<Navigation />} />
              <Route path="/lead-management" element={<LeadManagement />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/reports" element={<ReportsDashboard />} />
              
              {/* Security routes */}
              <Route path="/security" element={<SecurityDashboard />} />

              {/* Agent routes */}
              <Route path="/agents" element={<AgentManagement />} />

              {/* Automation routes */}
              <Route path="/automation" element={<AutomationDashboard />} />

              {/* Developer routes */}
              <Route path="/developer" element={<DeveloperNavigation />} />
              <Route path="/developer/dashboard" element={<DeveloperDashboard />} />

              {/* Company Brain route */}
              <Route path="/company-brain" element={<CompanyBrain />} />

              {/* Sales Rep routes */}
              <Route path="/sales-rep" element={<SalesRepNavigation />} />
              <Route path="/sales-rep/dashboard" element={<SalesRepDashboard />} />
              
              {/* Manager routes */}
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/business-ops" element={<ManagerBusinessOps />} />
              <Route path="/manager/team" element={<ManagerTeam />} />
              <Route path="/manager/lead-management" element={<ManagerLeadManagement />} />
              <Route path="/manager/company-brain" element={<ManagerCompanyBrain />} />
              
              {/* Default route */}
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </div>
        </Router>
      </UnifiedAIProvider>
    </QueryClient>
  );
}

export default App;
