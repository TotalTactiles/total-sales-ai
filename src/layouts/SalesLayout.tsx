
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import Dialer from '@/pages/sales/Dialer';
import LeadManagement from '@/pages/sales/LeadManagement';
import Analytics from '@/pages/sales/Analytics';
import Settings from '@/pages/sales/Settings';
import AI from '@/pages/sales/AI';
import Academy from '@/pages/sales/Academy';

const SalesLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <SalesRepNavigation />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/sales/dashboard" replace />} />
            <Route path="/dashboard" element={<SalesRepDashboard />} />
            <Route path="/dialer" element={<Dialer />} />
            <Route path="/lead-management" element={<LeadManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default SalesLayout;
