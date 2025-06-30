
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import EnhancedRelevanceAIBubble from '@/components/RelevanceAI/EnhancedRelevanceAIBubble';
import { useMockData } from '@/hooks/useMockData';
import { useAuth } from '@/contexts/AuthContext';

// Sales Rep Pages  
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';
import Dialer from '@/pages/Dialer';
import CompanyBrainSalesRep from '@/components/CompanyBrain/CompanyBrainSalesRep';

const SalesRepOS: React.FC = () => {
  const { leads } = useMockData();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <SalesRepNavigation />
      
      {/* Main Content Area with proper spacing for fixed nav */}
      <main className="pt-16 lg:pt-20"> {/* Account for fixed nav + mobile nav */}
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SalesRepDashboard />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="leads/:leadId" element={<LeadWorkspace />} />
          <Route path="my-leads" element={<LeadManagement />} />
          <Route path="ai-agent" element={<SalesRepDashboard />} />
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
      
      {/* AI Assistant Bubble - Always visible in bottom right */}
      <EnhancedRelevanceAIBubble
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
