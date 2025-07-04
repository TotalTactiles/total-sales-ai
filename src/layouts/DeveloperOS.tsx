
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import UnifiedLayout from '@/components/layout/UnifiedLayout';

// Developer Pages
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import SystemMonitor from '@/pages/developer/SystemMonitor';
import ErrorLogs from '@/pages/developer/ErrorLogs';
import AgentHealth from '@/pages/developer/AgentHealth';
import AIBrainMonitor from '@/pages/developer/AIBrainMonitor';
import APILogs from '@/pages/developer/APILogs';
import TSAMBrainDashboard from '@/pages/developer/TSAMBrainDashboard';
import FeatureFlagManager from '@/pages/developer/FeatureFlagManager';
import SystemUpdatesTracker from '@/pages/developer/SystemUpdatesTracker';
import AIIntegrationMapper from '@/pages/developer/AIIntegrationMapper';

const DeveloperOS: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <UnifiedLayout>
        <Routes>
          <Route index element={<Navigate to="/developer/dashboard" replace />} />
          <Route path="dashboard" element={<DeveloperDashboard />} />
          <Route path="system-monitor" element={<SystemMonitor />} />
          <Route path="error-logs" element={<ErrorLogs />} />
          <Route path="agent-health" element={<AgentHealth />} />
          <Route path="brain-monitor" element={<AIBrainMonitor />} />
          <Route path="api-logs" element={<APILogs />} />
          <Route path="tsam-brain" element={<TSAMBrainDashboard />} />
          <Route path="feature-flags" element={<FeatureFlagManager />} />
          <Route path="system-updates" element={<SystemUpdatesTracker />} />
          <Route path="ai-integration" element={<AIIntegrationMapper />} />
          <Route path="*" element={<Navigate to="/developer/dashboard" replace />} />
        </Routes>
      </UnifiedLayout>
    </SidebarProvider>
  );
};

export default DeveloperOS;
