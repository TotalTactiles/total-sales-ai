
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';

// Manager pages
import ManagerDashboard from '@/pages/manager/Dashboard';
import ManagerAnalytics from '@/pages/manager/Analytics';
import ManagerLeadManagement from '@/pages/manager/LeadManagement';
import ManagerCompanyBrain from '@/pages/manager/CompanyBrain';
import ManagerAI from '@/pages/manager/AI';
import ManagerSettings from '@/pages/manager/Settings';

const ManagerLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      
      <main className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route path="/analytics" element={<ManagerAnalytics />} />
          <Route path="/lead-management" element={<ManagerLeadManagement />} />
          <Route path="/company-brain" element={<ManagerCompanyBrain />} />
          <Route path="/ai" element={<ManagerAI />} />
          <Route path="/settings" element={<ManagerSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerLayout;
