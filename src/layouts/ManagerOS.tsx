
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNavigation from '@/components/Dashboard/DashboardNavigation';
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import ManagerLeads from '@/pages/manager/ManagerLeads';
import ManagerTeam from '@/pages/manager/ManagerTeam';
import ManagerBusinessOps from '@/pages/manager/ManagerBusinessOps';
import ManagerCompanyBrain from '@/pages/manager/ManagerCompanyBrain';
import ManagerAIAssistantPage from '@/pages/manager/ManagerAIAssistant';
import ManagerReports from '@/pages/manager/ManagerReports';
import SecurityPage from '@/pages/manager/Security';
import ManagerSettings from '@/pages/manager/Settings';
import Analytics from '@/pages/manager/Analytics';
import InternalChat from '@/pages/InternalChat';

const ManagerOS: React.FC = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (profile?.role !== 'manager') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route path="/business-ops" element={<ManagerBusinessOps />} />
          <Route path="/team" element={<ManagerTeam />} />
          <Route path="/leads" element={<ManagerLeads />} />
          <Route path="/ai-assistant" element={<ManagerAIAssistantPage />} />
          <Route path="/company-brain" element={<ManagerCompanyBrain />} />
          <Route path="/reports" element={<ManagerReports />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<ManagerSettings />} />
          <Route path="/chat" element={<InternalChat />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerOS;
