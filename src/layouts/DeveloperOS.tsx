
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

// Developer Pages
import DeveloperDashboard from '@/pages/developer/Dashboard';
import DeveloperSystemMonitor from '@/pages/developer/SystemMonitor';
import DeveloperAILogs from '@/pages/developer/AIBrainLogs';
import DeveloperAPILogs from '@/pages/developer/APILogs';
import DeveloperErrorLogs from '@/pages/developer/ErrorLogs';
import DeveloperQAChecklist from '@/pages/developer/QAChecklist';
import DeveloperTestingSandbox from '@/pages/developer/TestingSandbox';
import DeveloperVersionControl from '@/pages/developer/VersionControl';
import DeveloperSettings from '@/pages/developer/Settings';
import DeveloperCRMIntegrations from '@/pages/developer/CRMIntegrations';

const DeveloperOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation role="developer" />
      <main className="pt-16">
        <Routes>
          <Route index element={<DeveloperDashboard />} />
          <Route path="dashboard" element={<DeveloperDashboard />} />
          <Route path="system-monitor" element={<DeveloperSystemMonitor />} />
          <Route path="ai-brain-logs" element={<DeveloperAILogs />} />
          <Route path="api-logs" element={<DeveloperAPILogs />} />
          <Route path="error-logs" element={<DeveloperErrorLogs />} />
          <Route path="qa-checklist" element={<DeveloperQAChecklist />} />
          <Route path="testing-sandbox" element={<DeveloperTestingSandbox />} />
          <Route path="version-control" element={<DeveloperVersionControl />} />
          <Route path="crm-integrations" element={<DeveloperCRMIntegrations />} />
          <Route path="settings" element={<DeveloperSettings />} />
          <Route path="*" element={<Navigate to="/developer/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default DeveloperOS;
