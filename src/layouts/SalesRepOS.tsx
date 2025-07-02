
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ContextAwareAIBubble from '@/components/UnifiedAI/ContextAwareAIBubble';
import { useMockData } from '@/hooks/useMockData';
import AgentTriggerButton from '@/frontend/automations-ui/AgentTriggerButton';
import { 
  Grid3X3, 
  Users, 
  Bot, 
  Phone, 
  BarChart3, 
  GraduationCap, 
  Settings 
} from 'lucide-react';

// Sales Rep Pages  
import Dashboard from '@/pages/sales/Dashboard';
import LeadManagement from '@/pages/LeadManagement';
import LeadWorkspace from '@/pages/LeadWorkspace';
import Dialer from '@/pages/Dialer';
import AIAgent from '@/pages/AIAgent';
import SalesRepAnalytics from '@/pages/sales/Analytics';
import SalesAcademy from '@/pages/sales/Academy';
import SalesSettings from '@/pages/sales/Settings';

const SalesRepOS: React.FC = () => {
  const { leads } = useMockData();
  const { profile } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/sales/dashboard', icon: Grid3X3, shortcut: '1' },
    { name: 'Lead Management', href: '/sales/lead-management', icon: Users, shortcut: '2' },
    { name: 'AI Agent', href: '/sales/ai-agent', icon: Bot, shortcut: '3' },
    { name: 'Dialer', href: '/sales/dialer', icon: Phone, shortcut: '4' },
    { name: 'Analytics', href: '/sales/analytics', icon: BarChart3, shortcut: '5' },
    { name: 'Academy', href: '/sales/academy', icon: GraduationCap, shortcut: '6' },
    { name: 'Settings', href: '/sales/settings', icon: Settings, shortcut: '7' },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold text-gray-900">TSAM</span>
              </div>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                AI Sales OS
              </Badge>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={`${item.name} (Shift+${item.shortcut})`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {item.name}
                    {active && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                    {/* Keyboard shortcut indicator */}
                    <span className="ml-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ⇧{item.shortcut}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right side - User info */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                AI Assistant Active
              </Badge>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {profile?.full_name || 'Sales Rep'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content Area */}
      <main>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="lead-management" element={<LeadManagement />} />
          <Route path="leads/:leadId" element={<LeadWorkspace />} />
          <Route path="my-leads" element={<LeadManagement />} />
          <Route path="ai-agent/*" element={<AIAgent />} />
          <Route path="analytics" element={<SalesRepAnalytics />} />
          <Route path="academy" element={<SalesAcademy />} />
          <Route path="settings" element={<SalesSettings />} />
          <Route path="dialer" element={<Dialer />} />
          {/* Redirect brain route to academy to maintain all established functionality */}
          <Route path="brain" element={<Navigate to="academy" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
      
      {/* Single Context-Aware AI Assistant - Always visible */}
      <ContextAwareAIBubble
        context={{
          workspace: 'dashboard',
          currentLead: null,
          isCallActive: false,
          callDuration: 0
        }}
      />
      
      {/* AI Agent Trigger Button - Always available */}
      <AgentTriggerButton 
        leadId={null}
        leadData={{}}
        position="bottom-left"
        variant="floating"
      />
    </div>
  );
};

export default SalesRepOS;
