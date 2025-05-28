
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

// Developer Pages
import DeveloperDashboard from '@/pages/developer/Dashboard';
import DeveloperSystemMonitor from '@/pages/developer/SystemMonitor';
import DeveloperAPILogs from '@/pages/developer/APILogs';
import DeveloperErrorLogs from '@/pages/developer/ErrorLogs';
import DeveloperAIBrainLogs from '@/pages/developer/AIBrainLogs';
import DeveloperCRMIntegrations from '@/pages/developer/CRMIntegrations';
import DeveloperTestingSandbox from '@/pages/developer/TestingSandbox';
import DeveloperQAChecklist from '@/pages/developer/QAChecklist';
import DeveloperVersionControl from '@/pages/developer/VersionControl';
import DeveloperSettings from '@/pages/developer/Settings';

const DeveloperOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <DeveloperNavigation />
      <main className="pt-16">
        <Routes>
          <Route index element={<DeveloperDashboard />} />
          <Route path="dashboard" element={<DeveloperDashboard />} />
          <Route path="system-monitor" element={<DeveloperSystemMonitor />} />
          <Route path="api-logs" element={<DeveloperAPILogs />} />
          <Route path="error-logs" element={<DeveloperErrorLogs />} />
          <Route path="ai-brain-logs" element={<DeveloperAIBrainLogs />} />
          <Route path="crm-integrations" element={<DeveloperCRMIntegrations />} />
          <Route path="testing-sandbox" element={<DeveloperTestingSandbox />} />
          <Route path="qa-checklist" element={<DeveloperQAChecklist />} />
          <Route path="version-control" element={<DeveloperVersionControl />} />
          <Route path="settings" element={<DeveloperSettings />} />
          <Route path="*" element={<Navigate to="/developer/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default DeveloperOS;
