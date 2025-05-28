
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { shouldShowNavItem } from './navigationUtils';
import { NavItem } from './navigationConfig';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';

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
      <div className="flex items-center justify-between px-6 py-3 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <div className="flex items-center">
          <Logo />
        </div>

        <nav className="flex items-center space-x-6">
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname === item.href || 
                           (item.href.includes('dashboard') && location.pathname === '/') ||
                           activeItem === item.label.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <Link
                key={index}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserProfile 
            name={profile?.full_name || "User"}
            role={profile?.role || "sales_rep"}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopNavigation;
