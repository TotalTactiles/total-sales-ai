import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Grid3X3, 
  Users, 
  Bot, 
  Phone, 
  BarChart3, 
  GraduationCap,
  Building2,
  Target,
  Brain,
  Shield,
  FileText
} from 'lucide-react';

interface NavigationProps {
  hasAutomationNotifications?: boolean;
  notificationCount?: number;
}

const Navigation: React.FC<NavigationProps> = ({ hasAutomationNotifications, notificationCount }) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isManagerRoute = location.pathname.startsWith('/manager');
  const isSalesRoute = location.pathname.startsWith('/sales');

  const managerNavItems = [
    { path: '/manager/dashboard', label: 'Dashboard', icon: Grid3X3 },
    { path: '/manager/business-ops', label: 'Business Ops', icon: Building2 },
    { path: '/manager/team', label: 'Team', icon: Users },
    { path: '/manager/leads', label: 'Leads', icon: Target },
    { path: '/manager/ai', label: 'AI Assistant', icon: Bot },
    { path: '/manager/company-brain', label: 'Company Brain', icon: Brain },
    { path: '/manager/security', label: 'Security', icon: Shield },
    { path: '/manager/reports', label: 'Reports', icon: BarChart3 },
    { path: '/manager/settings', label: 'Settings', icon: Settings }
  ];

  const salesNavItems = [
    { path: '/sales/dashboard', label: 'Dashboard', icon: Grid3X3 },
    { path: '/sales/leads', label: 'Lead Management', icon: Users },
    { path: '/sales/ai-agent', label: 'AI Agent', icon: Bot },
    { path: '/sales/dialer', label: 'Dialer', icon: Phone },
    { path: '/sales/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/sales/academy', label: 'Academy', icon: GraduationCap },
    { path: '/sales/settings', label: 'Settings', icon: Settings }
  ];

  const currentNavItems = isManagerRoute ? managerNavItems : salesNavItems;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-blue-600 text-white rounded-lg p-2 mr-3">
              <span className="font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">TSAM</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {isManagerRoute ? 'Manager OS' : 'Sales OS'}
            </Badge>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:ml-8 md:flex md:space-x-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
              {hasAutomationNotifications && notificationCount && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">{notificationCount}</span>
                </div>
              )}
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {profile?.full_name || user?.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
