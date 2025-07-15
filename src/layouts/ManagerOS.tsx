
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

// Manager Pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import BusinessOps from '@/pages/manager/BusinessOps';
import EnhancedTeamManagement from '@/pages/manager/EnhancedTeamManagement';
import ManagerLeads from '@/pages/manager/ManagerLeads';
import AIAssistant from '@/pages/manager/AIAssistant';
import CompanyBrain from '@/pages/manager/CompanyBrain';
import Security from '@/pages/manager/Security';
import Reports from '@/pages/manager/Reports';
import Settings from '@/pages/manager/Settings';

const ManagerOS: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useOptimizedLogout();
  const { profile } = useAuth();

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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      navigate('/auth');
    }
  };

  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const navTabs = [
    {
      key: 'dashboard',
      label: 'Dashboard'
    },
    {
      key: 'business-ops',
      label: 'Business Ops'
    },
    {
      key: 'team',
      label: 'Team'
    },
    {
      key: 'leads',
      label: 'Leads'
    },
    {
      key: 'ai',
      label: 'AI Assistant'
    },
    {
      key: 'company-brain',
      label: 'Company Brain'
    },
    {
      key: 'security',
      label: 'Security'
    },
    {
      key: 'reports',
      label: 'Reports'
    },
    {
      key: 'settings',
      label: 'Settings'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ManagerDashboard />;
      case 'business-ops':
        return <BusinessOps />;
      case 'team':
        return <EnhancedTeamManagement />;
      case 'leads':
        return <ManagerLeads />;
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

  const displayName = profile?.full_name || 'Manager';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Unified Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-2 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-8">
          {/* TSAM Brand */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-slate-900">TSAM</span>
          </div>

          {/* Navigation Tabs - Text Only */}
          <div className="hidden lg:flex items-center gap-1">
            {navTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Info with Dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-900">Manager</p>
            <p className="text-xs text-slate-500">Executive Dashboard</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-200 transition-all cursor-pointer">
                <span className="text-white font-semibold text-sm">{initials}</span>
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              className="w-56 bg-white shadow-lg border rounded-lg p-2" 
              align="end"
              sideOffset={5}
            >
              {/* User Info Header */}
              <div className="flex items-center gap-3 p-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">{initials}</span>
                </div>
                <div className="flex flex-col">
                  <p className="font-medium text-sm text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">Manager</p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 px-3 hover:bg-red-50 rounded cursor-pointer text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex-shrink-0">
        <div className="flex gap-1 overflow-x-auto">
          {navTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area - Fixed height with proper scrolling */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ManagerOS;
