
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Settings,
  User,
  LogOut,
  BarChart,
  Activity,
  Code,
  Bug,
  Zap,
  FileText
} from 'lucide-react';

interface OSLayoutProps {
  children: React.ReactNode;
}

const OSLayout: React.FC<OSLayoutProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const { logout } = useOptimizedLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      navigate('/auth');
    }
  };

  const getNavigationTabs = () => {
    const navConfig = {
      'manager': [
        { name: 'Dashboard', href: '/dashboard/manager', icon: BarChart },
        { name: 'Leads', href: '/dashboard/manager/leads', icon: Target },
        { name: 'Team', href: '/dashboard/manager/team', icon: Users },
        { name: 'Insights', href: '/dashboard/manager/insights', icon: TrendingUp },
        { name: 'Profile', href: '/dashboard/manager/profile', icon: User }
      ],
      'sales_rep': [
        { name: 'Dashboard', href: '/dashboard/sales', icon: BarChart },
        { name: 'Leads', href: '/dashboard/sales/leads', icon: Target },
        { name: 'My Leads', href: '/dashboard/sales/my-leads', icon: Target },
        { name: 'Activity', href: '/dashboard/sales/activity', icon: Activity },
        { name: 'AI Insights', href: '/dashboard/sales/ai-insights', icon: Zap },
        { name: 'Profile', href: '/dashboard/sales/profile', icon: User }
      ],
      'developer': [
        { name: 'Dashboard', href: '/dashboard/developer', icon: BarChart },
        { name: 'Logs', href: '/dashboard/developer/logs', icon: FileText },
        { name: 'Features', href: '/dashboard/developer/features', icon: Settings },
        { name: 'Tickets', href: '/dashboard/developer/tickets', icon: Bug },
        { name: 'Performance', href: '/dashboard/developer/performance', icon: Activity },
        { name: 'Updates', href: '/dashboard/developer/updates', icon: Code },
        { name: 'Profile', href: '/dashboard/developer/profile', icon: User }
      ]
    };

    return navConfig[profile?.role as keyof typeof navConfig] || [];
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'sales_rep':
        return 'Sales Rep';
      case 'manager':
        return 'Manager';
      case 'developer':
        return 'Developer';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'sales_rep':
        return 'bg-green-100 text-green-800';
      case 'developer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B61FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TSAM OS...</p>
        </div>
      </div>
    );
  }

  const navigationTabs = getNavigationTabs();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#7B61FF]">TSAM</h1>
                <Badge variant="outline" className="text-xs">
                  OS v2.1
                </Badge>
              </div>
              
              {/* Navigation Tabs */}
              <div className="hidden md:flex space-x-1">
                {navigationTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.href}
                      onClick={() => navigate(tab.href)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPath === tab.href
                          ? 'bg-[#7B61FF] text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.full_name || user?.email || 'User'}
                </p>
                <Badge className={`text-xs ${getRoleColor(profile?.role || 'user')}`}>
                  {getRoleDisplayName(profile?.role || 'user')} OS
                </Badge>
              </div>
              
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                <User className="h-4 w-4" />
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {navigationTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.href}
                onClick={() => navigate(tab.href)}
                className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  currentPath === tab.href
                    ? 'bg-[#7B61FF] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default OSLayout;
