
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  UserCheck,
  Brain,
  BarChart3,
  Shield,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import TopRightPanel from '@/components/Manager/TopRightPanel';

const ManagerNavigation = () => {
  const { signOut } = useAuth();

  const navItems = [
    { to: '/manager/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/manager/business-ops', icon: TrendingUp, label: 'Business Ops' },
    { to: '/manager/team', icon: Users, label: 'Team' },
    { to: '/manager/leads', icon: UserCheck, label: 'Leads' },
    { to: '/manager/ai-assistant', icon: Brain, label: 'AI Assistant' },
    { to: '/manager/company-brain', icon: Brain, label: 'Company Brain' },
    { to: '/manager/reports', icon: BarChart3, label: 'Reports' },
    { to: '/manager/security', icon: Shield, label: 'Security' },
    { to: '/manager/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-primary">Manager OS</div>
        </div>
        <TopRightPanel />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40">
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
};

export default ManagerNavigation;
