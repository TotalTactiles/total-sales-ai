
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

// Import Developer OS pages
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import DeveloperAnalytics from '@/pages/developer/DeveloperAnalytics';
import AIMasterBrain from '@/pages/developer/AIMasterBrain';
import SystemMonitoring from '@/pages/developer/SystemMonitoring';
import DeveloperSettings from '@/pages/developer/DeveloperSettings';
import Sandbox from '@/pages/developer/Sandbox';

const DeveloperOS = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <DeveloperNavigation />
        <main className="flex-1 overflow-y-auto pt-[60px]">
          <Routes>
            <Route path="/" element={<Navigate to="/developer/dashboard" replace />} />
            <Route path="/dashboard" element={<DeveloperDashboard />} />
            <Route path="/analytics" element={<DeveloperAnalytics />} />
            <Route path="/ai-master-brain" element={<AIMasterBrain />} />
            <Route path="/brain" element={<AIMasterBrain />} />
            <Route path="/system-monitoring" element={<SystemMonitoring />} />
            <Route path="/monitoring" element={<SystemMonitoring />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/settings" element={<DeveloperSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DeveloperOS;
