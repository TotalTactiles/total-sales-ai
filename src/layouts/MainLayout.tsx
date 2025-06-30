
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Manager Pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';

// Sales Rep Pages  
import SalesRepDashboard from '@/pages/sales/SalesRepDashboard';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';

// Developer Pages
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';

const MainLayout: React.FC = () => {
  const { profile } = useAuth();

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  // Route based on user role
  const getDefaultRoute = () => {
    switch (profile.role) {
      case 'manager':
        return '/manager/dashboard';
      case 'sales_rep':
        return '/sales/dashboard';
      case 'developer':
        return '/developer/dashboard';
      default:
        return '/sales/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Root redirect based on role */}
        <Route index element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/leads" element={<ManagerDashboard />} />
        <Route path="/manager/team" element={<ManagerDashboard />} />
        <Route path="/manager/coaching" element={<ManagerDashboard />} />
        <Route path="/manager/profile" element={<ManagerDashboard />} />
        
        {/* Sales Rep Routes */}
        <Route path="/sales/dashboard" element={<SalesRepDashboard />} />
        <Route path="/sales/leads" element={<LeadManagement />} />
        <Route path="/sales/leads/:leadId" element={<LeadWorkspace />} />
        <Route path="/sales/activity" element={<SalesRepDashboard />} />
        <Route path="/sales/ai-insights" element={<SalesRepDashboard />} />
        <Route path="/sales/profile" element={<SalesRepDashboard />} />
        
        {/* Developer Routes */}
        <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
        <Route path="/developer/logs" element={<DeveloperDashboard />} />
        <Route path="/developer/performance" element={<DeveloperDashboard />} />
        <Route path="/developer/jarvis" element={<DeveloperDashboard />} />
        <Route path="/developer/updates" element={<DeveloperDashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </div>
  );
};

export default MainLayout;
