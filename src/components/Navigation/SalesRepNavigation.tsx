import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';
import { Bell, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
const SalesRepNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profile,
    user
  } = useAuth();
  const {
    logout
  } = useOptimizedLogout();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const navItems = [{
    name: 'Dashboard',
    href: '/sales/dashboard',
    emoji: '📊'
  }, {
    name: 'Lead Management',
    href: '/sales/leads',
    emoji: '👥'
  }, {
    name: 'AI Agent',
    href: '/sales/ai-agent',
    emoji: '🤖'
  }, {
    name: 'Dialer',
    href: '/sales/dialer',
    emoji: '📞'
  }, {
    name: 'Analytics',
    href: '/sales/analytics',
    emoji: '📈'
  }, {
    name: 'Academy',
    href: '/sales/brain',
    emoji: '🎓'
  }, {
    name: 'Settings',
    href: '/sales/settings',
    emoji: '⚙️'
  }];
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between px-6 h-full max-w-7xl mx-auto">
        {/* Left: TSAM Branding */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-blue-600">TSAM</h1>
            <span className="text-sm text-gray-500">AI Sales OS</span>
          </div>
        </div>
        
        {/* Center: Navigation Items */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map(item => <button key={item.href} onClick={() => navigate(item.href)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href) ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              
              <span className="text-center">{item.name}</span>
            </button>)}
        </div>
        
        {/* Right: User Profile & Actions */}
        <div className="flex items-center space-x-4">
          {/* AI Assistant Active Indicator */}
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hidden md:flex">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            AI Assistant Active
          </Badge>
          
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SR'}
            </div>
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-800 hidden md:block">
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {navItems.slice(0, 4).map(item => <button key={item.href} onClick={() => navigate(item.href)} className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${isActive(item.href) ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <span>{item.emoji}</span>
              <span>{item.name}</span>
            </button>)}
        </div>
      </div>
    </nav>;
};
export default SalesRepNavigation;