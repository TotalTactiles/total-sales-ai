
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';

// Manager Pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import TeamOverview from '@/pages/manager/TeamOverview';
import PerformanceAnalytics from '@/pages/manager/PerformanceAnalytics';
import BusinessOps from '@/pages/manager/BusinessOps';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';

// Additional Manager Pages
import ManagerAI from '@/pages/manager/AI';
import ManagerCompanyBrain from '@/pages/manager/CompanyBrain';
import ManagerCRMIntegrations from '@/pages/manager/CRMIntegrations';
import ManagerSecurity from '@/pages/manager/Security';
import ManagerReports from '@/pages/manager/Reports';
import ManagerSettings from '@/pages/manager/Settings';

const ManagerOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      <main className="pt-[60px]">
        <Routes>
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="business-ops" element={<BusinessOps />} />
          <Route path="team" element={<TeamOverview />} />
          <Route path="analytics" element={<PerformanceAnalytics />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="leads/:leadId" element={<LeadWorkspace />} />
          <Route path="ai" element={<ManagerAI />} />
          <Route path="company-brain" element={<ManagerCompanyBrain />} />
          <Route path="integrations" element={<ManagerCRMIntegrations />} />
          <Route path="automation" element={<ManagerDashboard />} />
          <Route path="security" element={<ManagerSecurity />} />
          <Route path="reports" element={<ManagerReports />} />
          <Route path="settings" element={<ManagerSettings />} />
          {/* Legacy routes for backwards compatibility */}
          <Route path="metrics" element={<Navigate to="/manager/business-ops" replace />} />
          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerOS;
