
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';

// Manager Pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import ManagerAnalytics from '@/pages/manager/Analytics';
import ManagerLeadManagement from '@/pages/manager/LeadManagement';
import ManagerTeamManagement from '@/pages/manager/TeamManagement';
import ManagerCompanyBrain from '@/pages/manager/CompanyBrain';
import ManagerAI from '@/pages/manager/AI';
import ManagerReports from '@/pages/manager/Reports';
import ManagerSecurity from '@/pages/manager/Security';
import ManagerSettings from '@/pages/manager/Settings';

const ManagerOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      <main className="pt-16">
        <Routes>
          <Route index element={<ManagerDashboard />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="analytics" element={<ManagerAnalytics />} />
          <Route path="leads" element={<ManagerLeadManagement />} />
          <Route path="team" element={<ManagerTeamManagement />} />
          <Route path="brain" element={<ManagerCompanyBrain />} />
          <Route path="ai" element={<ManagerAI />} />
          <Route path="reports" element={<ManagerReports />} />
          <Route path="security" element={<ManagerSecurity />} />
          <Route path="settings" element={<ManagerSettings />} />
          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerOS;
