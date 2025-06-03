
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { shouldShowNavItem } from './navigationUtils';
import { NavItem } from './navigationConfig';

interface DesktopNavigationProps {
  navItems: NavItem[];
  activeItem: string;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navItems,
  activeItem
}) => {
  const location = useLocation();
  const { profile } = useAuth();
  
  const filteredNavItems = navItems.filter(item => shouldShowNavItem(item.href, profile));

  return (
    <div className="hidden lg:block">
      <div className="bg-sidebar text-sidebar-foreground shadow-lg border-r border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
          <Link to="/" className="text-lg font-bold text-sidebar-foreground">
            SalesOS
          </Link>
        </div>
        
        <nav className="px-3 py-4 space-y-1">
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname === item.href || 
                           (item.href.includes('dashboard') && location.pathname === '/') ||
                           activeItem === item.label.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <Link
                key={index}
                to={item.href}
                className={`nav-item flex items-center justify-between text-xs font-medium ${
                  isActive
                    ? 'active bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-2 text-xs">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-medium">
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
