
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

// Developer Pages
import DeveloperDashboard from '@/pages/developer/DeveloperDashboard';
import AgentHealthDashboard from '@/components/Developer/AgentHealthDashboard';
import RelevanceAIMonitor from '@/components/Developer/RelevanceAIMonitor';
import UserAccountManager from '@/components/Developer/UserAccountManager';
import ProductionReadinessMonitor from '@/components/SystemHealth/ProductionReadinessMonitor';

const DeveloperOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <DeveloperNavigation />
      <main className="pt-[60px]">
        <Routes>
          <Route index element={<Navigate to="/developer/dashboard" replace />} />
          <Route path="dashboard" element={<DeveloperDashboard />} />
          <Route path="agents" element={<AgentHealthDashboard />} />
          <Route path="ai-monitor" element={<RelevanceAIMonitor />} />
          <Route path="users" element={<UserAccountManager />} />
          <Route path="system" element={<ProductionReadinessMonitor />} />
          <Route path="*" element={<Navigate to="/developer/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default DeveloperOS;
