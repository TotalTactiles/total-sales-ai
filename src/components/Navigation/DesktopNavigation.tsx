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
  return <div className="hidden lg:block">
      <div className="bg-sidebar text-sidebar-foreground shadow-lg border-r border-sidebar-border">
        
        
        
      </div>
    </div>;
};
export default DesktopNavigation;