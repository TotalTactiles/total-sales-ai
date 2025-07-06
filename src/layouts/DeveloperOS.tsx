
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import LoadingManager from '@/components/layout/LoadingManager';

// Developer Pages - lazy loaded to prevent initial bundle size issues
const DeveloperDashboard = React.lazy(() => import('@/pages/developer/DeveloperDashboard'));
const SystemMonitor = React.lazy(() => import('@/pages/developer/SystemMonitor'));
const ErrorLogs = React.lazy(() => import('@/pages/developer/ErrorLogs'));
const AgentHealth = React.lazy(() => import('@/pages/developer/AgentHealth'));
const AIBrainMonitor = React.lazy(() => import('@/pages/developer/AIBrainMonitor'));
const APILogs = React.lazy(() => import('@/pages/developer/APILogs'));
const TSAMBrainDashboard = React.lazy(() => import('@/pages/developer/TSAMBrainDashboard'));
const FeatureFlagManager = React.lazy(() => import('@/pages/developer/FeatureFlagManager'));
const SystemUpdatesTracker = React.lazy(() => import('@/pages/developer/SystemUpdatesTracker'));
const AIIntegrationMapper = React.lazy(() => import('@/pages/developer/AIIntegrationMapper'));

// Loading fallback for all developer pages
const DeveloperPageFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-900">
    <LoadingManager type="default" message="Loading Developer OS..." />
  </div>
);

const DeveloperOS: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-900">
      <SidebarProvider defaultOpen={true}>
        <UnifiedLayout>
          <Suspense fallback={<DeveloperPageFallback />}>
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
          </Suspense>
        </UnifiedLayout>
      </SidebarProvider>
    </div>
  );
};

export default DeveloperOS;
