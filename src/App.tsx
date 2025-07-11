
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import MainLayout from '@/components/Layout/MainLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/manager/Dashboard';
import BusinessOps from '@/pages/manager/BusinessOps';
import TeamManagement from '@/pages/manager/TeamManagement';
import LeadManagement from '@/pages/manager/LeadManagement';
import CompanyBrain from '@/pages/manager/CompanyBrain';
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import ManagerBusinessOps from '@/pages/manager/ManagerBusinessOps';
import ManagerTeam from '@/pages/manager/ManagerTeam';
import ManagerLeadManagement from '@/pages/manager/ManagerLeadManagement';
import ManagerCompanyBrain from '@/pages/manager/ManagerCompanyBrain';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <MainLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="manager/dashboard" element={<ManagerDashboard />} />
                <Route path="manager/business-ops" element={<ManagerBusinessOps />} />
                <Route path="manager/team" element={<ManagerTeam />} />
                <Route path="manager/leads" element={<ManagerLeadManagement />} />
                <Route path="manager/company-brain" element={<ManagerCompanyBrain />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="business-ops" element={<BusinessOps />} />
                <Route path="team" element={<TeamManagement />} />
                <Route path="leads" element={<LeadManagement />} />
                <Route path="company-brain" element={<CompanyBrain />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
