
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3,
  BarChart3,
  Users,
  Target,
  Brain,
  Puzzle,
  Shield,
  FileText,
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserDropdown from './UserDropdown';
import UnifiedNotificationCenter from './UnifiedNotificationCenter';

const ManagerNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/manager/dashboard', icon: Grid3X3 },
    { name: 'Business Ops', href: '/manager/business-ops', icon: BarChart3 },
    { name: 'Team', href: '/manager/team', icon: Users },
    { name: 'Analytics', href: '/manager/analytics', icon: Target },
    { name: 'Leads', href: '/manager/leads', icon: Target },
    { name: 'AI Assistant', href: '/manager/ai', icon: Brain },
    { name: 'Integrations', href: '/manager/integrations', icon: Puzzle },
    { name: 'Security', href: '/manager/security', icon: Shield },
    { name: 'Reports', href: '/manager/reports', icon: FileText },
    { name: 'Settings', href: '/manager/settings', icon: Settings }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TSAM</span>
            </div>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              Manager OS
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer hover:bg-gray-100 ${
                    isActive(item.href)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Notifications, AI Status, User Menu */}
          <div className="flex items-center gap-3">
            {/* AI Assistant Status */}
            <Badge variant="outline" className="hidden sm:flex bg-purple-50 text-purple-700 border-purple-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Manager AI Active
            </Badge>

            {/* Notifications */}
            <UnifiedNotificationCenter />

            {/* User Profile */}
            <UserDropdown />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive(item.href)
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ManagerNavigation;
