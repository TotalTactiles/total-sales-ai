import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserDropdown from './UserDropdown';
import UnifiedNotificationCenter from './UnifiedNotificationCenter';
const ManagerNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    profile
  } = useAuth();
  const navItems = [{
    name: 'Dashboard',
    href: '/manager/dashboard'
  }, {
    name: 'Business Ops',
    href: '/manager/business-ops'
  }, {
    name: 'Team',
    href: '/manager/team'
  }, {
    name: 'Leads',
    href: '/manager/leads'
  }, {
    name: 'AI Assistant',
    href: '/manager/ai'
  }, {
    name: 'Company Brain',
    href: '/manager/company-brain'
  }, {
    name: 'Security',
    href: '/manager/security'
  }, {
    name: 'Reports',
    href: '/manager/reports'
  }, {
    name: 'Settings',
    href: '/manager/settings'
  }];
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };
  return <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
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
            {navItems.map(item => {
            return <Link key={item.name} to={item.href} className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer hover:bg-gray-100 ${isActive(item.href) ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'}`}>
                  {item.name}
                </Link>;
          })}
          </div>

          {/* Right Side - Notifications, AI Status, User Menu */}
          <div className="flex items-center gap-3">
            {/* AI Assistant Status */}
            

            {/* Notifications */}
            <UnifiedNotificationCenter />

            {/* User Profile */}
            <UserDropdown />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && <div className="lg:hidden border-t border-gray-200 py-3">
            <div className="space-y-1">
              {navItems.map(item => {
            return <Link key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isActive(item.href) ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                    {item.name}
                  </Link>;
          })}
            </div>
          </div>}
      </div>
    </nav>;
};
export default ManagerNavigation;