
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManagerSidebar from '@/components/Navigation/ManagerSidebar';

// Manager pages
import ManagerDashboard from '@/pages/manager/Dashboard';
import ManagerAnalytics from '@/pages/manager/Analytics';
import ManagerLeadManagement from '@/pages/manager/LeadManagement';
import ManagerCompanyBrain from '@/pages/manager/CompanyBrain';
import ManagerAI from '@/pages/manager/AI';
import ManagerCRMIntegrations from '@/pages/manager/CRMIntegrations';
import TeamManagement from '@/pages/manager/TeamManagement';
import SecurityPage from '@/pages/manager/Security';
import Reports from '@/pages/manager/Reports';
import ManagerSettings from '@/pages/manager/Settings';

import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import { useAIContext } from '@/contexts/AIContext';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ManagerLayout = () => {
  const { currentLead, isCallActive, emailContext, smsContext } = useAIContext();
  const location = useLocation();
  const { profile } = useAuth();
  
  const getWorkspaceContext = () => {
    const path = location.pathname;
    
    if (path.includes('/lead-management')) {
      return 'manager_leads';
    } else if (path.includes('/company-brain')) {
      return 'company_brain';
    } else if (path.includes('/analytics')) {
      return 'manager_analytics';
    } else if (path.includes('/dashboard')) {
      return 'manager_dashboard';
    } else {
      return 'manager_dashboard';
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
    <ManagerSidebar profileName={profile?.full_name}>
      <main className="pt-4 flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route path="/analytics" element={<ManagerAnalytics />} />
          <Route path="/lead-management" element={<ManagerLeadManagement />} />
          <Route path="/company-brain" element={<ManagerCompanyBrain />} />
          <Route path="/ai" element={<ManagerAI />} />
          <Route path="/crm-integrations" element={<ManagerCRMIntegrations />} />
          <Route path="/team-management" element={<TeamManagement />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<ManagerSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Manager AI Assistant */}
        <div className="fixed bottom-6 right-6 z-[9999]">
          <UnifiedAIBubble context={aiContext} />
        </div>
      </main>
    </ManagerSidebar>
  );
};

export default ManagerLayout;
