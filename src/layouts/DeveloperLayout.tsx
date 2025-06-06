
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import MobileNavigation from '@/components/Navigation/MobileNavigation';
import { updateActiveItem } from '@/components/Navigation/navigationUtils';
import type { NavItem } from '@/components/Navigation/navigationConfig';
import {
  Monitor,
  Brain,
  Activity,
  Code,
  AlertTriangle,
  Database,
  CheckSquare,
  TestTube,
  GitBranch,
  Settings,
} from 'lucide-react';

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

const DeveloperLayout = () => {
  const { currentLead, isCallActive, emailContext, smsContext } = useAIContext();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    updateActiveItem(location.pathname, setActiveItem);
  }, [location]);

  const navItems: NavItem[] = [
    { icon: <Monitor className="h-5 w-5" />, label: 'Dashboard', href: '/developer/dashboard' },
    { icon: <Brain className="h-5 w-5" />, label: 'AI Brain Hub', href: '/developer/ai-brain-logs' },
    { icon: <Activity className="h-5 w-5" />, label: 'System Monitor', href: '/developer/system-monitor' },
    { icon: <Code className="h-5 w-5" />, label: 'API Logs', href: '/developer/api-logs' },
    { icon: <AlertTriangle className="h-5 w-5" />, label: 'Error Logs', href: '/developer/error-logs' },
    { icon: <Database className="h-5 w-5" />, label: 'CRM Integration Dashboard', href: '/developer/crm-integrations' },
    { icon: <CheckSquare className="h-5 w-5" />, label: 'QA Checklist', href: '/developer/qa-checklist' },
    { icon: <TestTube className="h-5 w-5" />, label: 'Testing Tools', href: '/developer/testing-sandbox' },
    { icon: <GitBranch className="h-5 w-5" />, label: 'Version Control', href: '/developer/version-control' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/developer/settings' },
  ];

  const getDashboardUrl = () => '/developer/dashboard';
  
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
      <MobileNavigation
        navItems={navItems}
        activeItem={activeItem}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        getDashboardUrl={getDashboardUrl}
      />

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
