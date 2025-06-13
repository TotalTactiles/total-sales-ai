
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResponsiveNavigation from '@/components/Navigation/ResponsiveNavigation';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Manager pages - lazy load to prevent blocking
const ManagerDashboard = lazy(() => import('@/pages/manager/Dashboard'));
const ManagerAnalytics = lazy(() => import('@/pages/manager/Analytics'));
const ManagerLeadManagement = lazy(() => import('@/pages/manager/LeadManagement'));
const ManagerCompanyBrain = lazy(() => import('@/pages/manager/CompanyBrain'));
const ManagerTeamManagement = lazy(() => import('@/pages/manager/TeamManagement'));
const ManagerCRMIntegrations = lazy(() => import('@/pages/manager/CRMIntegrations'));
const ManagerReports = lazy(() => import('@/pages/manager/Reports'));
const ManagerSecurity = lazy(() => import('@/pages/manager/Security'));
const ManagerSettings = lazy(() => import('@/pages/manager/Settings'));

const ManagerLayout: React.FC = () => {
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
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="analytics" element={<ManagerAnalytics />} />
              <Route path="lead-management" element={<ManagerLeadManagement />} />
              <Route path="company-brain" element={<ManagerCompanyBrain />} />
              <Route path="team-management" element={<ManagerTeamManagement />} />
              <Route path="crm-integrations" element={<ManagerCRMIntegrations />} />
              <Route path="reports" element={<ManagerReports />} />
              <Route path="security" element={<ManagerSecurity />} />
              <Route path="settings" element={<ManagerSettings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default ManagerLayout;
