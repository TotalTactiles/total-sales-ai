
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';

// Manager Pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import TeamOverview from '@/pages/manager/TeamOverview';
import PerformanceAnalytics from '@/pages/manager/PerformanceAnalytics';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';

const ManagerOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      <main className="pt-[60px]">
        <Routes>
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="team" element={<TeamOverview />} />
          <Route path="analytics" element={<PerformanceAnalytics />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="leads/:leadId" element={<LeadWorkspace />} />
          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerOS;
