
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResponsiveNavigation from '@/components/Navigation/ResponsiveNavigation';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useAIContext } from '@/contexts/AIContext';
import { useLocation } from 'react-router-dom';

// Lazy load pages to prevent blocking issues
const SalesDashboard = lazy(() => import('@/pages/sales/Dashboard'));
const SalesAnalytics = lazy(() => import('@/pages/sales/Analytics'));
const SalesLeadManagement = lazy(() => import('@/pages/sales/LeadManagement'));
const SalesAcademy = lazy(() => import('@/pages/sales/Academy'));
const SalesAI = lazy(() => import('@/pages/sales/AI'));
const SalesSettings = lazy(() => import('@/pages/sales/Settings'));
const SalesDialer = lazy(() => import('@/pages/sales/Dialer'));
const LeadWorkspace = lazy(() => import('@/pages/LeadWorkspace'));
const UnifiedAIBubble = lazy(() => import('@/components/UnifiedAI/UnifiedAIBubble'));

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
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          }>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SalesDashboard />} />
              <Route path="analytics" element={<SalesAnalytics />} />
              <Route path="lead-management" element={<SalesLeadManagement />} />
              <Route path="lead-workspace/:id" element={<LeadWorkspace />} />
              <Route path="dialer" element={<SalesDialer />} />
              <Route path="academy" element={<SalesAcademy />} />
              <Route path="ai" element={<SalesAI />} />
              <Route path="settings" element={<SalesSettings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Unified AI Bubble */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Suspense>
          <UnifiedAIBubble context={aiContext} />
        </Suspense>
      </div>
    </div>
  );
};

export default SalesLayout;
