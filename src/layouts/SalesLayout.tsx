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

import SalesRepAIAssistant from '@/components/SalesAI/SalesRepAIAssistant';

const SalesLayout = () => {
  return (
    <div className="min-h-screen bg-background">
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
      
      {/* AI Assistant */}
      <SalesRepAIAssistant />
    </div>
  );
};

export default SalesLayout;
