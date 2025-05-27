
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  Brain, 
  Settings,
  LogOut,
  User,
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SalesRepNavigation: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const navItems = [
    { href: '/sales', label: 'Dashboard', icon: Home },
    { href: '/sales/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/sales/leads', label: 'Lead Management', icon: Users },
    { href: '/sales/academy', label: 'Company Academy', icon: GraduationCap },
    { href: '/sales/ai', label: 'AI Assistant', icon: Brain },
    { href: '/sales/settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = async () => {
    try {
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Sales Rep OS</span>
            </div>
          </div>

          <div className="hidden md:ml-6 md:flex md:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-4 w-4" />
              <span className="text-sm">{profile?.full_name || 'Sales Rep'}</span>
            </div>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SalesRepNavigation;
