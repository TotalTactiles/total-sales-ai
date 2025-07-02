
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';
import { 
  User, 
  LogOut, 
  Settings, 
  Bell,
  Search
} from 'lucide-react';

const TopNavigation: React.FC = () => {
  const { profile, user } = useAuth();
  const { logout } = useOptimizedLogout();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
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

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and search */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#7B61FF]">TSAM</h1>
            <Badge variant="outline" className="text-xs">
              OS v2.1
            </Badge>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm w-64"
            />
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User info */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {profile?.full_name || user?.email || 'User'}
              </p>
              <Badge className={`text-xs ${getRoleColor(profile?.role || 'user')}`}>
                {getRoleDisplayName(profile?.role || 'user')}
              </Badge>
            </div>
            
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              <User className="h-4 w-4" />
            </div>
          </div>

          {/* Logout */}
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
    </nav>
  );
};

export default TopNavigation;
