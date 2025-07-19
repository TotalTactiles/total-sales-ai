
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNavigation from '@/components/Dashboard/DashboardNavigation';
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import SalesLeads from '@/pages/sales/SalesLeads';
import SalesDialer from '@/pages/sales/Dialer';
import SalesBrain from '@/pages/sales/SalesBrain';
import Analytics from '@/pages/sales/Analytics';
import InternalChat from '@/pages/InternalChat';

const OSLayout: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (profile?.role !== 'sales_rep') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Navigate to="/sales/dashboard" replace />} />
          <Route path="/dashboard" element={<SalesRepDashboard />} />
          <Route path="/leads" element={<SalesLeads />} />
          <Route path="/dialer" element={<SalesDialer />} />
          <Route path="/brain" element={<SalesBrain />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/chat" element={<InternalChat />} />
        </Routes>
      </main>
    </div>
  );
};

export default OSLayout;
