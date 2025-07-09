
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  Phone, 
  BarChart3, 
  Settings,
  User,
  LogOut,
  Bell,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SalesOSNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const navItems = [
    { path: '/sales/dashboard', label: 'Dashboard', icon: Home },
    { path: '/sales/leads', label: 'Leads', icon: Users },
    { path: '/sales/dialer', label: 'Dialer', icon: Phone },
    { path: '/sales/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings/integrations', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth?logout=true', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      navigate('/auth?logout=true', { replace: true });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-16 flex items-center justify-between px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TSAM</span>
          <Badge variant="outline" className="text-xs">Sales OS</Badge>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            return (
              <Button
                key={item.path}
                variant={active ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 ${
                  active 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Invite Button */}
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Invite
          </Button>

          {/* AI Assistant Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Hey TSAM</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {profile?.full_name || 'Sales Rep'}
              </p>
              <p className="text-xs text-gray-500">Sales Representative</p>
            </div>
            
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              <User className="h-4 w-4" />
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-2 ml-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          {navItems.slice(0, 4).map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            return (
              <Button
                key={item.path}
                variant={active ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 ${
                  active 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default SalesOSNavigation;
