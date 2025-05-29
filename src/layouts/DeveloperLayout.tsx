
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

// Developer pages
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import APILogs from '@/pages/developer/APILogs';
import ErrorLogs from '@/pages/developer/ErrorLogs';
import AIBrainLogs from '@/pages/developer/AIBrainLogs';
import SystemMonitor from '@/pages/developer/SystemMonitor';
import CRMIntegrations from '@/pages/developer/CRMIntegrations';
import TestingSandbox from '@/pages/developer/TestingSandbox';
import QAChecklist from '@/pages/developer/QAChecklist';
import VersionControl from '@/pages/developer/VersionControl';
import DeveloperSettings from '@/pages/developer/Settings';

import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import { useLocation } from 'react-router-dom';

const DeveloperLayout = () => {
  const location = useLocation();
  
  // Determine workspace context from current route
  const getWorkspaceContext = () => {
    const path = location.pathname;
    
    if (path.includes('/api-logs') || path.includes('/error-logs') || path.includes('/ai-brain-logs')) {
      return 'dashboard';
    } else if (path.includes('/system-monitor')) {
      return 'dashboard';
    } else if (path.includes('/crm-integrations')) {
      return 'dashboard';
    } else if (path.includes('/testing-sandbox')) {
      return 'dashboard';
    } else {
      return 'dashboard';
    }
  };

  const aiContext = {
    workspace: getWorkspaceContext() as any
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <DeveloperNavigation />
      
      <main className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DeveloperDashboard />} />
          <Route path="/api-logs" element={<APILogs />} />
          <Route path="/error-logs" element={<ErrorLogs />} />
          <Route path="/ai-brain-logs" element={<AIBrainLogs />} />
          <Route path="/system-monitor" element={<SystemMonitor />} />
          <Route path="/crm-integrations" element={<CRMIntegrations />} />
          <Route path="/testing-sandbox" element={<TestingSandbox />} />
          <Route path="/qa-checklist" element={<QAChecklist />} />
          <Route path="/version-control" element={<VersionControl />} />
          <Route path="/settings" element={<DeveloperSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Unified AI Bubble - Always present */}
      <UnifiedAIBubble 
        context={aiContext}
        className="z-30"
      />
    </div>
  );
};

export default DeveloperLayout;
