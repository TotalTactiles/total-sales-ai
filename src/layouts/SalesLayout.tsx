
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesSidebar from '@/components/Navigation/SalesSidebar';

// Sales pages
import SalesRepDashboard from '@/pages/sales/Dashboard';
import SalesAnalytics from '@/pages/sales/Analytics';
import SalesLeadManagement from '@/pages/sales/LeadManagement';
import SalesAcademy from '@/pages/sales/Academy';
import SalesAI from '@/pages/sales/AI';
import SalesSettings from '@/pages/sales/Settings';
import SalesDialer from '@/pages/sales/Dialer';
import LeadWorkspace from '@/pages/LeadWorkspace';

import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import { useAIContext } from '@/contexts/AIContext';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SalesLayout = () => {
  const { currentLead, isCallActive, emailContext, smsContext } = useAIContext();
  const location = useLocation();
  const { profile } = useAuth();
  
  // Determine workspace context from current route
  const getWorkspaceContext = () => {
    const path = location.pathname;
    
    if (path.includes('/dialer')) {
      return 'dialer';
    } else if (path.includes('/lead-management') || path.includes('/lead/')) {
      return 'leads';
    } else if (path.includes('/lead-workspace/')) {
      return 'lead_details';
    } else if (path.includes('/email')) {
      return 'email';
    } else if (path.includes('/sms')) {
      return 'sms';
    } else if (path.includes('/academy')) {
      return 'company_brain';
    } else if (path.includes('/dashboard')) {
      return 'dashboard';
    } else {
      return 'dashboard';
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
    <SalesSidebar profileName={profile?.full_name}>
      <main className="pt-4 flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<SalesRepDashboard />} />
          <Route path="/analytics" element={<SalesAnalytics />} />
          <Route path="/lead-management" element={<SalesLeadManagement />} />
          <Route path="/lead-workspace/:id" element={<LeadWorkspace />} />
          <Route path="/dialer" element={<SalesDialer />} />
          <Route path="/academy" element={<SalesAcademy />} />
          <Route path="/ai" element={<SalesAI />} />
          <Route path="/settings" element={<SalesSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        {/* Unified AI Bubble - Single AI assistant with fixed positioning */}
        <div className="fixed bottom-6 right-6 z-[9999]">
          <UnifiedAIBubble context={aiContext} />
        </div>
      </main>
    </SalesSidebar>
  );
};

export default SalesLayout;
