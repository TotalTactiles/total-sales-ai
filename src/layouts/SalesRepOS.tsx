
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';

// Sales Rep Pages
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';
import AutoDialerInterface from '@/components/AutoDialer/AutoDialerInterface';
import CompanyBrainSalesRep from '@/components/CompanyBrain/CompanyBrainSalesRep';

const SalesRepOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SalesRepNavigation />
      <main className="pt-[60px]">
        <Routes>
          <Route index element={<Navigate to="/sales/dashboard" replace />} />
          <Route path="dashboard" element={<SalesRepDashboard />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="leads/:leadId" element={<LeadWorkspace />} />
          <Route path="dialer" element={<AutoDialerInterface />} />
          <Route path="brain" element={<CompanyBrainSalesRep />} />
          <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default SalesRepOS;
