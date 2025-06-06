
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

// Sales Rep Pages
import SalesRepDashboard from '@/pages/sales/Dashboard';
import SalesRepAnalytics from '@/pages/sales/Analytics';
import SalesRepLeadManagement from '@/pages/sales/LeadManagement';
import SalesRepAcademy from '@/pages/sales/Academy';
import SalesRepAI from '@/pages/sales/AI';
import SalesRepSettings from '@/pages/sales/Settings';

const SalesRepOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation role="sales_rep" />
      <main className="pt-16">
        <Routes>
          <Route index element={<SalesRepDashboard />} />
          <Route path="dashboard" element={<SalesRepDashboard />} />
          <Route path="analytics" element={<SalesRepAnalytics />} />
          <Route path="leads" element={<SalesRepLeadManagement />} />
          <Route path="academy" element={<SalesRepAcademy />} />
          <Route path="ai" element={<SalesRepAI />} />
          <Route path="settings" element={<SalesRepSettings />} />
          <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default SalesRepOS;
