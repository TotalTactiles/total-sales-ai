
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

// Developer pages
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

import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import { useAIContext } from '@/contexts/AIContext';
import { useLocation } from 'react-router-dom';

const DeveloperLayout = () => {
  const { currentLead, isCallActive, emailContext, smsContext } = useAIContext();
  const location = useLocation();
  
  const getWorkspaceContext = () => {
    const path = location.pathname;
    
    if (path.includes('/ai-brain-logs')) {
      return 'developer_ai_logs';
    } else if (path.includes('/system-monitor')) {
      return 'developer_system';
    } else if (path.includes('/testing-sandbox')) {
      return 'developer_testing';
    } else if (path.includes('/dashboard')) {
      return 'developer_dashboard';
    } else {
      return 'developer_dashboard';
    }
  };

  const aiContext = {
    workspace: getWorkspaceContext() as any,
    currentLead,
    isCallActive,
    emailContext,
    smsContext
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      <DeveloperNavigation />
      
      <main className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DeveloperDashboard />} />
          <Route path="/system-monitor" element={<DeveloperSystemMonitor />} />
          <Route path="/ai-brain-logs" element={<DeveloperAILogs />} />
          <Route path="/api-logs" element={<DeveloperAPILogs />} />
          <Route path="/error-logs" element={<DeveloperErrorLogs />} />
          <Route path="/qa-checklist" element={<DeveloperQAChecklist />} />
          <Route path="/testing-sandbox" element={<DeveloperTestingSandbox />} />
          <Route path="/version-control" element={<DeveloperVersionControl />} />
          <Route path="/crm-integrations" element={<DeveloperCRMIntegrations />} />
          <Route path="/settings" element={<DeveloperSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      
      {/* Developer AI Assistant */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <UnifiedAIBubble context={aiContext} />
      </div>
    </div>
  );
};

export default DeveloperLayout;
