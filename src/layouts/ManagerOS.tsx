import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname.replace('/manager/', '') || 'dashboard';
    return path;
  };
  const [activeTab, setActiveTab] = useState(getCurrentTab());
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/manager/${tab}`);
  };

  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);
  const navTabs = [{
    key: 'dashboard',
    label: 'Dashboard',
    icon: '📊'
  }, {
    key: 'business-ops',
    label: 'Business Ops',
    icon: '🏢'
  }, {
    key: 'team',
    label: 'Team',
    icon: '👥'
  }, {
    key: 'leads',
    label: 'Leads',
    icon: '🎯'
  }, {
    key: 'ai',
    label: 'AI Assistant',
    icon: '🤖'
  }, {
    key: 'company-brain',
    label: 'Company Brain',
    icon: '🧠'
  }, {
    key: 'security',
    label: 'Security',
    icon: '🛡️'
  }, {
    key: 'reports',
    label: 'Reports',
    icon: '📈'
  }, {
    key: 'settings',
    label: 'Settings',
    icon: '⚙️'
  }];
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ManagerDashboard />;
      case 'business-ops':
        return <BusinessOps />;
      case 'team':
        return <EnhancedTeamManagement />;
      case 'leads':
        return <LeadManagement />;
      case 'ai':
        return <AIAssistant />;
      case 'company-brain':
        return <CompanyBrain />;
      case 'security':
        return <Security />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <ManagerDashboard />;
    }
  };
  return <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Unified Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-8">
          {/* TSAM Brand */}
          <div className="flex items-center gap-3">
            
            <span className="text-xl font-bold text-slate-900">TSAM</span>
            
          </div>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {navTabs.map(tab => <button key={tab.key} onClick={() => handleTabChange(tab.key)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.key ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                <span className="text-xs">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>)}
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-900">Manager</p>
            <p className="text-xs text-slate-500">Executive Dashboard</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">M</span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex gap-1 overflow-x-auto">
          {navTabs.map(tab => <button key={tab.key} onClick={() => handleTabChange(tab.key)} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
              <span className="text-xs">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>)}
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>;
};
export default ManagerOS;