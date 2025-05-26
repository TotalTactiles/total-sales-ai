
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { shouldShowNavItem } from './navigationUtils';
import { NavItem } from './navigationConfig';

interface DesktopNavigationProps {
  navItems: NavItem[];
  activeItem: string;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ navItems, activeItem }) => {
  const location = useLocation();
  const { profile } = useAuth();

  const filteredNavItems = navItems.filter(item => shouldShowNavItem(item.href, profile));

  return (
    <div className="hidden lg:block">
      <div className="px-6 py-4">
        <nav className="flex space-x-8">
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname === item.href || 
                           (item.href.includes('dashboard') && location.pathname === '/') ||
                           activeItem === item.label.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <Link
                key={index}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DesktopNavigation;
