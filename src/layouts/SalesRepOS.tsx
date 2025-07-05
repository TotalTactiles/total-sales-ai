
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UnifiedLayout from '@/components/layout/UnifiedLayout';

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
    <UnifiedLayout>
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
    </UnifiedLayout>
  );
};

export default SalesRepOS;
