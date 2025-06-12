
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResponsiveNavigation from '@/components/Navigation/ResponsiveNavigation';

// Sales pages
import SalesRepDashboard from '@/pages/sales/Dashboard';
import SalesAnalytics from '@/pages/sales/Analytics';
import SalesLeadManagement from '@/pages/sales/LeadManagement';
import SalesAcademy from '@/pages/sales/Academy';
import SalesAI from '@/pages/sales/AI';
import SalesSettings from '@/pages/sales/Settings';
import SalesDialer from '@/pages/sales/Dialer';
import LeadWorkspace from '@/pages/LeadWorkspace';

import ErrorBoundary from '@/components/common/ErrorBoundary';

const UnifiedAIBubble = lazy(() => import('@/components/UnifiedAI/UnifiedAIBubble'));
import { useAIContext } from '@/contexts/AIContext';
import { useLocation } from 'react-router-dom';

const SalesLayout = () => {
  const { currentLead, isCallActive, emailContext, smsContext } = useAIContext();
  const location = useLocation();
  
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
    <div className="min-h-screen bg-slate-50 relative">
      <ResponsiveNavigation />

      <main className="pt-[60px]">
        <ErrorBoundary fallback={<div className="p-4">Something went wrong. Please refresh or contact support.</div>}>
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SalesRepDashboard />} />
            <Route path="analytics" element={<SalesAnalytics />} />
            <Route path="lead-management" element={<SalesLeadManagement />} />
            <Route path="lead-workspace/:id" element={<LeadWorkspace />} />
            <Route path="dialer" element={<SalesDialer />} />
            <Route path="academy" element={<SalesAcademy />} />
            <Route path="ai" element={<SalesAI />} />
            <Route path="settings" element={<SalesSettings />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Unified AI Bubble - Single AI assistant with fixed positioning */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Suspense>
          <UnifiedAIBubble context={aiContext} />
        </Suspense>
      </div>
    </div>
  );
};

export default SalesLayout;
