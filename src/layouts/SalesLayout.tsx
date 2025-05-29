
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import FloatingAIChat from '@/components/AIAssistant/FloatingAIChat';

// Import Sales OS pages
import SalesDashboard from '@/pages/sales/SalesDashboard';
import SalesAnalytics from '@/pages/sales/SalesAnalytics';
import LeadManagementSales from '@/pages/sales/LeadManagementSales';
import SalesAIAssistant from '@/pages/sales/SalesAIAssistant';
import SalesSettings from '@/pages/sales/SalesSettings';
import Dialer from '@/pages/sales/Dialer';
import Academy from '@/pages/sales/Academy';

const SalesLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <SalesRepNavigation />
        <main className="flex-1 overflow-y-auto pt-[60px]">
          <Routes>
            <Route path="/" element={<Navigate to="/sales/dashboard" replace />} />
            <Route path="/dashboard" element={<SalesDashboard />} />
            <Route path="/analytics" element={<SalesAnalytics />} />
            <Route path="/leads" element={<LeadManagementSales />} />
            <Route path="/lead-management" element={<LeadManagementSales />} />
            <Route path="/ai" element={<SalesAIAssistant />} />
            <Route path="/ai-assistant" element={<SalesAIAssistant />} />
            <Route path="/settings" element={<SalesSettings />} />
            <Route path="/dialer" element={<Dialer />} />
            <Route path="/academy" element={<Academy />} />
          </Routes>
        </main>
        
        {/* Floating AI Chat - Available across all Sales OS pages */}
        <FloatingAIChat />
      </div>
    </div>
  );
};

export default SalesLayout;
