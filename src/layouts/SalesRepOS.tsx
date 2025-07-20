
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';

// Sales Pages
import SalesDashboard from '@/pages/sales/SalesDashboard';
import LeadManagement from '@/pages/sales/LeadManagement';
import AIAgent from '@/pages/sales/AIAgent';
import Dialer from '@/pages/sales/Dialer';
import Analytics from '@/pages/sales/Analytics';
import Academy from '@/pages/sales/Academy';
import Settings from '@/pages/sales/Settings';

const SalesRepOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <SalesRepNavigation />
      
      {/* Main Content with top padding to account for fixed navigation */}
      <main className="pt-16">
        <Routes>
          <Route index element={<Navigate to="/sales/dashboard" replace />} />
          <Route path="dashboard" element={<SalesDashboard />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="ai-agent" element={<AIAgent />} />
          <Route path="dialer" element={<Dialer />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="academy" element={<Academy />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default SalesRepOS;
