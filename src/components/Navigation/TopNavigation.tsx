
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Brain,
  Settings,
  Target,
  Activity,
  User,
  Code,
  Monitor
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/UserProfile';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';

const TopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, user } = useAuth();
  const { logout } = useOptimizedLogout();

  const getNavigationItems = () => {
    if (!profile?.role) return [];

    switch (profile.role) {
      case 'manager':
        return [
          { path: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/manager/leads', label: 'Leads Overview', icon: Target },
          { path: '/manager/team', label: 'Team Analytics', icon: Users },
          { path: '/manager/coaching', label: 'Coaching Hub', icon: Brain },
          { path: '/manager/profile', label: 'Company Profile', icon: Settings },
        ];
      case 'sales_rep':
        return [
          { path: '/sales/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/sales/leads', label: 'My Leads', icon: Target },
          { path: '/sales/activity', label: 'Activity', icon: Activity },
          { path: '/sales/ai-insights', label: 'AI Insights', icon: Brain },
          { path: '/sales/profile', label: 'Profile', icon: User },
        ];
      case 'developer':
        return [
          { path: '/developer/dashboard', label: 'System Dashboard', icon: Monitor },
          { path: '/developer/logs', label: 'System Logs', icon: Code },
          { path: '/developer/performance', label: 'Performance', icon: BarChart3 },
          { path: '/developer/jarvis', label: 'JARVIS AI', icon: Brain },
          { path: '/developer/updates', label: 'Updates', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigationItems();
  const currentWorkspace = profile?.role === 'manager' ? 'Manager OS' : 
                          profile?.role === 'sales_rep' ? 'Sales Rep OS' : 
                          profile?.role === 'developer' ? 'Developer OS' : 'TSAM OS';

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left: Logo & Workspace */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">TSAM</h1>
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                {currentWorkspace}
              </Badge>
            </div>
          </div>
        </div>

        {/* Center: Navigation Pills */}
        <nav className="flex items-center gap-2 bg-gray-50 rounded-full p-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path.includes('dashboard') && location.pathname.includes(profile?.role || ''));
            const IconComponent = item.icon;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isActive 
                    ? 'bg-white shadow-sm text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Right: User Profile */}
        <div className="flex items-center gap-4">
          <UserProfile
            name={profile?.full_name || user?.email || 'User'}
            role={profile?.role || 'user'}
            onLogout={logout}
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
