
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid, Users, Phone, Bot, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const getNavItems = () => {
    if (profile?.role === 'manager') {
      return [
        { label: 'Dashboard', href: '/manager/dashboard', icon: Grid },
        { label: 'Team', href: '/manager/team', icon: Users },
        { label: 'Analytics', href: '/manager/analytics', icon: BarChart3 },
        { label: 'Settings', href: '/manager/settings', icon: Settings },
      ];
    }
    
    return [
      { label: 'Dashboard', href: '/sales/dashboard', icon: Grid },
      { label: 'Leads', href: '/sales/lead-management', icon: Users },
      { label: 'Dialer', href: '/sales/dialer', icon: Phone },
      { label: 'AI', href: '/sales/ai', icon: Bot },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-neutral-200 px-2 py-1">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.href || 
            (item.href.includes('dashboard') && location.pathname.includes('dashboard'));
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-primary-500 bg-primary-50'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
