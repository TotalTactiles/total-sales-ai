
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import MobileNavigation from '@/components/Navigation/MobileNavigation';
import { updateActiveItem } from '@/components/Navigation/navigationUtils';
import type { NavItem } from '@/components/Navigation/navigationConfig';
import {
  BarChart3,
  Users,
  Database,
  Brain,
  Settings,
  Shield,
  FileText,
} from 'lucide-react';

// Manager pages
import ManagerDashboard from '@/pages/manager/Dashboard';
import ManagerAnalytics from '@/pages/manager/Analytics';
import ManagerLeadManagement from '@/pages/manager/LeadManagement';
import ManagerCompanyBrain from '@/pages/manager/CompanyBrain';
import ManagerAI from '@/pages/manager/AI';
import ManagerCRMIntegrations from '@/pages/manager/CRMIntegrations';
import TeamManagement from '@/pages/manager/TeamManagement';
import SecurityPage from '@/pages/manager/Security';
import Reports from '@/pages/manager/Reports';
import ManagerSettings from '@/pages/manager/Settings';

import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import { useAIContext } from '@/contexts/AIContext';

const ManagerLayout = () => {
  const { currentLead, isCallActive, emailContext, smsContext } = useAIContext();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    updateActiveItem(location.pathname, setActiveItem);
  }, [location]);

  const navItems: NavItem[] = [
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', href: '/manager/dashboard' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics', href: '/manager/analytics' },
    { icon: <Users className="h-5 w-5" />, label: 'Lead Management', href: '/manager/lead-management' },
    { icon: <Database className="h-5 w-5" />, label: 'Company Brain', href: '/manager/company-brain' },
    { icon: <Brain className="h-5 w-5" />, label: 'AI Assistant', href: '/manager/ai' },
    { icon: <Database className="h-5 w-5" />, label: 'CRM Integrations', href: '/manager/crm-integrations' },
    { icon: <Users className="h-5 w-5" />, label: 'Team Management', href: '/manager/team-management' },
    { icon: <Shield className="h-5 w-5" />, label: 'Security', href: '/manager/security' },
    { icon: <FileText className="h-5 w-5" />, label: 'Reports', href: '/manager/reports' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/manager/settings' },
  ];

  const getDashboardUrl = () => '/manager/dashboard';
  
  const getWorkspaceContext = () => {
    const path = location.pathname;
    
    if (path.includes('/lead-management')) {
      return 'manager_leads';
    } else if (path.includes('/company-brain')) {
      return 'company_brain';
    } else if (path.includes('/analytics')) {
      return 'manager_analytics';
    } else if (path.includes('/dashboard')) {
      return 'manager_dashboard';
    } else {
      return 'manager_dashboard';
    }
  };

  const aiContext = {
    workspace: getWorkspaceContext() as any,
    currentLead,
    isCallActive,
    emailContext,
    smsContext
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <ManagerNavigation />
      <MobileNavigation
        navItems={navItems}
        activeItem={activeItem}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        getDashboardUrl={getDashboardUrl}
      />

      <main className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route path="/analytics" element={<ManagerAnalytics />} />
          <Route path="/lead-management" element={<ManagerLeadManagement />} />
          <Route path="/company-brain" element={<ManagerCompanyBrain />} />
          <Route path="/ai" element={<ManagerAI />} />
          <Route path="/crm-integrations" element={<ManagerCRMIntegrations />} />
          <Route path="/team-management" element={<TeamManagement />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<ManagerSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      
      {/* Manager AI Assistant */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <UnifiedAIBubble context={aiContext} />
      </div>
    </div>
  );
};

export default ManagerLayout;
