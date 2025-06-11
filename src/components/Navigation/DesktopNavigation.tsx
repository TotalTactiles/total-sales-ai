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
  const {
    profile
  } = useAuth();
  const filteredNavItems = navItems.filter(item => shouldShowNavItem(item.href, profile));
  return (
    <div className="hidden lg:block">
      <div className="bg-sidebar text-sidebar-foreground shadow-lg border-r border-sidebar-border h-screen w-64">
        <ul className="py-4 space-y-1">
          {filteredNavItems.map((item, index) => {
            const isActive =
              location.pathname === item.href ||
              (item.href.includes('dashboard') && location.pathname === '/') ||
              activeItem === item.label.toLowerCase().replace(/\s+/g, '-');

            return (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default DesktopNavigation;