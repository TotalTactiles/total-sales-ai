
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';

// Manager pages
import ManagerDashboard from '@/pages/manager/Dashboard';
import ManagerAnalytics from '@/pages/manager/Analytics';
import ManagerLeadManagement from '@/pages/manager/LeadManagement';
import ManagerCompanyBrain from '@/pages/manager/CompanyBrain';
import ManagerAI from '@/pages/manager/AI';
import ManagerSettings from '@/pages/manager/Settings';
import ManagerTeamManagement from '@/pages/manager/TeamManagement';
import ManagerReports from '@/pages/manager/Reports';
import ManagerSecurity from '@/pages/manager/Security';

import ManagerAIAssistant from '@/components/ManagerAI/ManagerAIAssistant';
import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import { useLocation } from 'react-router-dom';

const ManagerLayout = () => {
  const location = useLocation();
  
  // Determine workspace context from current route
  const getWorkspaceContext = () => {
    const path = location.pathname;
    
    if (path.includes('/analytics')) {
      return 'dashboard';
    } else if (path.includes('/lead-management') || path.includes('/lead/')) {
      return 'leads';
    } else if (path.includes('/company-brain')) {
      return 'company_brain';
    } else if (path.includes('/team-management')) {
      return 'dashboard';
    } else if (path.includes('/reports')) {
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
      <ManagerNavigation />
      
      <main className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route path="/analytics" element={<ManagerAnalytics />} />
          <Route path="/lead-management" element={<ManagerLeadManagement />} />
          <Route path="/company-brain" element={<ManagerCompanyBrain />} />
          <Route path="/ai" element={<ManagerAI />} />
          <Route path="/settings" element={<ManagerSettings />} />
          <Route path="/team-management" element={<ManagerTeamManagement />} />
          <Route path="/reports" element={<ManagerReports />} />
          <Route path="/security" element={<ManagerSecurity />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      
      {/* Manager AI Assistant */}
      <ManagerAIAssistant />

      {/* Unified AI Bubble - Always present */}
      <UnifiedAIBubble 
        context={aiContext}
        className="z-30"
      />
    </div>
  );
};

export default ManagerLayout;
