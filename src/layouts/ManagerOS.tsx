
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import ManagerAIBubble from '@/components/ManagerAI/ManagerAIBubble';
import { ManagerAIProvider } from '@/components/ManagerAI/ManagerAIContext';

// Manager Pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import BusinessOps from '@/pages/manager/BusinessOps';
import EnhancedTeamManagement from '@/pages/manager/EnhancedTeamManagement';
import LeadManagement from '@/pages/manager/LeadManagement';
import AIAssistant from '@/pages/manager/AIAssistant';
import CompanyBrain from '@/pages/manager/CompanyBrain';
import Security from '@/pages/manager/Security';
import Reports from '@/pages/manager/Reports';
import Settings from '@/pages/manager/Settings';

const ManagerOS: React.FC = () => {
  return (
    <ManagerAIProvider>
      <UnifiedLayout>
        <Routes>
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="business-ops" element={<BusinessOps />} />
          <Route path="team" element={<EnhancedTeamManagement />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="company-brain" element={<CompanyBrain />} />
          <Route path="security" element={<Security />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </Routes>
        
        {/* Manager AI Bubble - Available on all pages except AI Assistant */}
        <ManagerAIBubble />
      </UnifiedLayout>
    </ManagerAIProvider>
  );
};

export default ManagerOS;
