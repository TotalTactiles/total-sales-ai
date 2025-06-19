
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import { useMockData } from '@/hooks/useMockData';

// Sales Rep Pages
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';
import AutoDialerInterface from '@/components/AutoDialer/AutoDialerInterface';
import CompanyBrainSalesRep from '@/components/CompanyBrain/CompanyBrainSalesRep';

const SalesRepOS: React.FC = () => {
  const { leads } = useMockData();

  return (
    <div className="min-h-screen bg-background">
      <SalesRepNavigation />
      <main className="pt-[60px]">
        <Routes>
          <Route index element={<Navigate to="/sales/dashboard" replace />} />
          <Route path="dashboard" element={<SalesRepDashboard />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="leads/:leadId" element={<LeadWorkspace />} />
          <Route path="dialer" element={<AutoDialerInterface leads={leads} onLeadSelect={() => {}} />} />
          <Route path="brain" element={<CompanyBrainSalesRep />} />
          <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default SalesRepOS;
