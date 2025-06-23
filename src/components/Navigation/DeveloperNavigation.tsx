
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboard, 
  Monitor, 
  AlertTriangle, 
  Activity,
  LogOut,
  Settings,
  Brain,
  Users,
  Shield,
  Database,
  Code
} from 'lucide-react';
import Logo from '@/components/Logo';

const DeveloperNavigation: React.FC = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { path: '/developer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/developer/system-monitor', label: 'Monitor', icon: Monitor },
    { path: '/developer/error-logs', label: 'Errors', icon: AlertTriangle },
    { path: '/developer/agent-health', label: 'Agents', icon: Activity },
    { path: '/developer/ai-monitor', label: 'AI', icon: Brain },
    { path: '/developer/users', label: 'Users', icon: Users },
    { path: '/developer/system', label: 'System', icon: Shield },
    { path: '/developer/brain-monitor', label: 'Brain', icon: Database },
    { path: '/developer/api-logs', label: 'API', icon: Code },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/landing';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100 h-[60px] shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-6">
          <Logo />
          
          <div className="flex items-center space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                             (item.path !== '/developer/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/60">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'D'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{profile?.full_name || 'Developer'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Developer
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/developer/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default DeveloperNavigation;
