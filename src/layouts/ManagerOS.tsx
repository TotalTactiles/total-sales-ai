

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
import NavigationalPanel from '@/components/Navigation/NavigationalPanel';

// Manager Pages
import ManagerDashboard from '@/pages/manager/ManagerDashboard';
import BusinessOps from '@/pages/manager/BusinessOps';
import EnhancedTeamManagement from '@/pages/manager/EnhancedTeamManagement';
import ManagerLeads from '@/pages/manager/ManagerLeads';
import AIAssistant from '@/pages/manager/AIAssistant';
import ManagerCompanyBrain from '@/pages/manager/ManagerCompanyBrain';
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
      navigate('/auth');
    }
  };

  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location.pathname]);

  const navTabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'business-ops', label: 'Business Ops' },
    { key: 'team', label: 'Team' },
    { key: 'leads', label: 'Leads' },
    { key: 'ai', label: 'AI Assistant' },
    { key: 'company-brain', label: 'Company Brain' },
    { key: 'security', label: 'Security' },
    { key: 'reports', label: 'Reports' },
    { key: 'settings', label: 'Settings' }
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
        return <ManagerCompanyBrain />;
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
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 shadow-sm flex-shrink-0"> {/* Reduced padding */}
        <div className="flex items-center gap-7"> {/* Reduced gap */}
          {/* TSAM Brand */}
          <div className="flex items-center gap-2.5"> {/* Reduced gap */}
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"> {/* Reduced size */}
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold text-slate-900"> {/* Reduced text size */}
              TSAM
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium"> {/* Reduced padding */}
              Manager OS
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {navTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${ /* Reduced padding */
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

        {/* Right Side - Navigation Panel + User Info */}
        <div className="flex items-center gap-2.5"> {/* Reduced gap */}
          {/* NavigationalPanel with icons */}
          <NavigationalPanel />
          
          {/* User Info */}
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-900">{displayName}</p>
            <p className="text-xs text-slate-500">Manager</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-200 transition-all cursor-pointer"> {/* Reduced size */}
                <span className="text-white font-semibold text-sm">{initials}</span>
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              className="w-52 bg-white shadow-lg border rounded-lg p-2" /* Reduced width */
              align="end"
              sideOffset={5}
            >
              <div className="flex items-center gap-2.5 p-1.5 mb-1.5"> {/* Reduced padding */}
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"> {/* Reduced size */}
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
                className="flex items-center gap-2 py-1.5 px-2.5 hover:bg-red-50 rounded cursor-pointer text-red-600" /* Reduced padding */
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-3.5 py-1.5 flex-shrink-0"> {/* Reduced padding */}
        <div className="flex gap-1 overflow-x-auto">
          {navTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${ /* Reduced padding */
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

      {/* Content Area */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ManagerOS;

