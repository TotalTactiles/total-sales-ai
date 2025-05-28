
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import SystemMonitor from '@/pages/developer/SystemMonitor';
import APILogs from '@/pages/developer/APILogs';
import ErrorLogs from '@/pages/developer/ErrorLogs';
import TestingSandbox from '@/pages/developer/TestingSandbox';
import Settings from '@/pages/developer/Settings';
import CRMIntegrations from '@/pages/developer/CRMIntegrations';
import QAChecklist from '@/pages/developer/QAChecklist';
import VersionControl from '@/pages/developer/VersionControl';

const DeveloperOS = () => {
  return (
    <div className="flex h-screen bg-background">
      <DeveloperNavigation />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/developer/dashboard" replace />} />
            <Route path="/dashboard" element={<DeveloperDashboard />} />
            <Route path="/system-monitor" element={<SystemMonitor />} />
            <Route path="/api-logs" element={<APILogs />} />
            <Route path="/error-logs" element={<ErrorLogs />} />
            <Route path="/testing-sandbox" element={<TestingSandbox />} />
            <Route path="/crm-integrations" element={<CRMIntegrations />} />
            <Route path="/qa-checklist" element={<QAChecklist />} />
            <Route path="/version-control" element={<VersionControl />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DeveloperOS;
