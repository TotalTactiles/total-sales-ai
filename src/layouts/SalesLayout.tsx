
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesNavigation from '@/components/Navigation/SalesNavigation';

// Sales pages
import SalesDashboard from '@/pages/sales/Dashboard';
import SalesAnalytics from '@/pages/sales/Analytics';
import SalesLeadManagement from '@/pages/sales/LeadManagement';
import SalesAcademy from '@/pages/sales/Academy';
import SalesAI from '@/pages/sales/AI';
import SalesSettings from '@/pages/sales/Settings';
import SalesDialer from '@/pages/sales/Dialer';

const SalesLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <SalesNavigation />
      
      <main className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<SalesDashboard />} />
          <Route path="/analytics" element={<SalesAnalytics />} />
          <Route path="/lead-management" element={<SalesLeadManagement />} />
          <Route path="/academy" element={<SalesAcademy />} />
          <Route path="/ai" element={<SalesAI />} />
          <Route path="/dialer" element={<SalesDialer />} />
          <Route path="/settings" element={<SalesSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default SalesLayout;
