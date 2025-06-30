
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import ContextAwareAIBubble from '@/components/UnifiedAI/ContextAwareAIBubble';
import { useMockData } from '@/hooks/useMockData';

// Sales Rep Pages  
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';
import Dialer from '@/pages/Dialer';
import AIAgent from '@/pages/AIAgent';
import CompanyBrainSalesRep from '@/components/CompanyBrain/CompanyBrainSalesRep';

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
          <Route path="dashboard" element={<SalesRepDashboard />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="leads/:leadId" element={<LeadWorkspace />} />
          <Route path="my-leads" element={<LeadManagement />} />
          <Route path="ai-agent/*" element={<AIAgent />} />
          <Route path="activity" element={<SalesRepDashboard />} />
          <Route path="ai-insights" element={<SalesRepDashboard />} />
          <Route path="analytics" element={<SalesRepDashboard />} />
          <Route path="settings" element={<SalesRepDashboard />} />
          <Route path="profile" element={<SalesRepDashboard />} />
          <Route path="dialer" element={<Dialer />} />
          <Route path="brain" element={<CompanyBrainSalesRep />} />
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
    </div>
  );
};

export default SalesRepOS;
