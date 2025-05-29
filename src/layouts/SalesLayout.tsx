
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesNavigation from '@/components/Navigation/SalesNavigation';

// Sales pages
import SalesRepDashboard from '@/pages/sales/Dashboard';
import SalesAnalytics from '@/pages/sales/Analytics';
import SalesLeadManagement from '@/pages/sales/LeadManagement';
import SalesAcademy from '@/pages/sales/Academy';
import SalesAI from '@/pages/sales/AI';
import SalesSettings from '@/pages/sales/Settings';
import SalesDialer from '@/pages/sales/Dialer';

import ContextAwareVoiceAssistant from '@/components/VoiceAI/ContextAwareVoiceAssistant';
import { useAIContext } from '@/contexts/AIContext';

const SalesLayout = () => {
  const { currentLead, isCallActive, emailContext, smsContext } = useAIContext();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <SalesNavigation />
      
      <main className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<SalesRepDashboard />} />
          <Route path="/analytics" element={<SalesAnalytics />} />
          <Route path="/lead-management" element={<SalesLeadManagement />} />
          <Route path="/dialer" element={<SalesDialer />} />
          <Route path="/academy" element={<SalesAcademy />} />
          <Route path="/ai" element={<SalesAI />} />
          <Route path="/settings" element={<SalesSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      
      {/* Unified Voice AI Assistant */}
      <ContextAwareVoiceAssistant
        currentLead={currentLead}
        isCallActive={isCallActive}
        emailContext={emailContext}
        smsContext={smsContext}
      />
    </div>
  );
};

export default SalesLayout;
