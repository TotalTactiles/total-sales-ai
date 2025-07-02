
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import ContextAwareAIBubble from '@/components/UnifiedAI/ContextAwareAIBubble';
import { useMockData } from '@/hooks/useMockData';
import AgentTriggerButton from '@/frontend/automations-ui/AgentTriggerButton';

// Sales Rep Pages  
import SalesDashboard from '@/pages/sales/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import FallbackError from '@/components/FallbackError';
import LoadingScreen from '@/components/LoadingScreen';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';
import Dialer from '@/pages/Dialer';
import AIAgent from '@/pages/AIAgent';
import SalesRepAnalytics from '@/pages/sales/Analytics';
import SalesAcademy from '@/pages/sales/Academy';
import SalesSettings from '@/pages/sales/Settings';

const SalesRepOS: React.FC = () => {
  const { leads } = useMockData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <SalesRepNavigation />
      
      {/* Main Content Area with proper spacing for fixed nav */}
      <main className="pt-16 lg:pt-20">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={<div className="p-8 text-center text-red-600">❌ Dashboard crashed</div>}>
                  <Suspense fallback={<LoadingScreen message="Loading dashboard..." />}>
                    <SalesDashboard />
                  </Suspense>
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="leads/:leadId" element={<LeadWorkspace />} />
          <Route path="my-leads" element={<LeadManagement />} />
          <Route path="ai-agent/*" element={<AIAgent />} />
          <Route path="analytics" element={<SalesRepAnalytics />} />
          <Route path="academy" element={<SalesAcademy />} />
          <Route path="settings" element={<SalesSettings />} />
          <Route path="dialer" element={<Dialer />} />
          {/* Redirect brain route to academy to maintain all established functionality */}
          <Route path="brain" element={<Navigate to="academy" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
      
      {/* Single Context-Aware AI Assistant - Always visible */}
      <ContextAwareAIBubble
        context={{
          workspace: 'dashboard',
          currentLead: null,
          isCallActive: false,
          callDuration: 0
        }}
      />
      
      {/* AI Agent Trigger Button - Always available */}
      <AgentTriggerButton 
        leadId={null}
        leadData={{}}
        position="bottom-left"
        variant="floating"
      />
    </div>
  );
};

export default SalesRepOS;
