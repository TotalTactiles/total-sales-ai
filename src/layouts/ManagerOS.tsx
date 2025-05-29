
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';

// Import Manager OS pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import TeamManagement from '@/pages/manager/TeamManagement';
import LeadManagement from '@/pages/manager/LeadManagement';
import Analytics from '@/pages/manager/Analytics';
import Reports from '@/pages/manager/Reports';
import Settings from '@/pages/manager/Settings';
import AI from '@/pages/manager/AI';
import CompanyBrain from '@/pages/manager/CompanyBrain';
import Security from '@/pages/manager/Security';

const ManagerOS = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <ManagerNavigation />
        <main className="flex-1 overflow-y-auto pt-[60px]">
          <Routes>
            <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
            <Route path="/dashboard" element={<ManagerDashboard />} />
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="/team" element={<TeamManagement />} />
            <Route path="/lead-management" element={<LeadManagement />} />
            <Route path="/leads" element={<LeadManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/ai-assistant" element={<AI />} />
            <Route path="/company-brain" element={<CompanyBrain />} />
            <Route path="/brain" element={<CompanyBrain />} />
            <Route path="/security" element={<Security />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ManagerOS;
