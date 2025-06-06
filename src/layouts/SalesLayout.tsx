
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SalesNavigation from '@/components/Navigation/SalesNavigation';
import MobileNavigation from '@/components/Navigation/MobileNavigation';
import { updateActiveItem } from '@/components/Navigation/navigationUtils';
import type { NavItem } from '@/components/Navigation/navigationConfig';
import {
  Grid,
  Users,
  Bot,
  Phone,
  BarChart3,
  GraduationCap,
  Wrench,
} from 'lucide-react';

// Sales pages
import SalesRepDashboard from '@/pages/sales/Dashboard';
import SalesAnalytics from '@/pages/sales/Analytics';
import SalesLeadManagement from '@/pages/sales/LeadManagement';
import SalesAcademy from '@/pages/sales/Academy';
import SalesAI from '@/pages/sales/AI';
import SalesSettings from '@/pages/sales/Settings';
import SalesDialer from '@/pages/sales/Dialer';
import LeadWorkspace from '@/pages/LeadWorkspace';

import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import { useAIContext } from '@/contexts/AIContext';

const SalesLayout = () => {
  const { currentLead, isCallActive, emailContext, smsContext } = useAIContext();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    updateActiveItem(location.pathname, setActiveItem);
  }, [location]);

  const navItems: NavItem[] = [
    { icon: <Grid className="h-5 w-5" />, label: 'Dashboard', href: '/sales/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Lead Management', href: '/sales/lead-management' },
    { icon: <Bot className="h-5 w-5" />, label: 'AI Agent', href: '/sales/ai' },
    { icon: <Phone className="h-5 w-5" />, label: 'Dialer', href: '/sales/dialer' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics', href: '/sales/analytics' },
    { icon: <GraduationCap className="h-5 w-5" />, label: 'Academy', href: '/sales/academy' },
    { icon: <Wrench className="h-5 w-5" />, label: 'Settings', href: '/sales/settings' },
  ];

  const getDashboardUrl = () => '/sales/dashboard';
  
  // Determine workspace context from current route
  const getWorkspaceContext = () => {
    const path = location.pathname;
    
    if (path.includes('/dialer')) {
      return 'dialer';
    } else if (path.includes('/lead-management') || path.includes('/lead/')) {
      return 'leads';
    } else if (path.includes('/lead-workspace/')) {
      return 'lead_details';
    } else if (path.includes('/email')) {
      return 'email';
    } else if (path.includes('/sms')) {
      return 'sms';
    } else if (path.includes('/academy')) {
      return 'company_brain';
    } else if (path.includes('/dashboard')) {
      return 'dashboard';
    } else {
      return 'dashboard';
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
      <SalesNavigation />
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
          <Route path="/dashboard" element={<SalesRepDashboard />} />
          <Route path="/analytics" element={<SalesAnalytics />} />
          <Route path="/lead-management" element={<SalesLeadManagement />} />
          <Route path="/lead-workspace/:id" element={<LeadWorkspace />} />
          <Route path="/dialer" element={<SalesDialer />} />
          <Route path="/academy" element={<SalesAcademy />} />
          <Route path="/ai" element={<SalesAI />} />
          <Route path="/settings" element={<SalesSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      
      {/* Unified AI Bubble - Single AI assistant with fixed positioning */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <UnifiedAIBubble context={aiContext} />
      </div>
    </div>
  );
};

export default SalesLayout;
