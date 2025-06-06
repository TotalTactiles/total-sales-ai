
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DesktopNavigation from './Navigation/DesktopNavigation';
import MobileNavigation from './Navigation/MobileNavigation';
import { getDashboardUrl, updateActiveItem } from './Navigation/navigationUtils';
import { createNavItems } from './Navigation/navigationConfig';
import type { Role } from '@/contexts/auth/types';

interface NavigationProps {
  role?: Role;
}

const Navigation: React.FC<NavigationProps> = ({ role }) => {
  const location = useLocation();
  const { profile } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Create dashboard URL function with current profile
  const dashboardUrl = () => getDashboardUrl(profile);
  
  // Update active item based on current location
  useEffect(() => {
    updateActiveItem(location.pathname, setActiveItem);
  }, [location]);

  const userRole = role || profile?.role || 'sales_rep';

  const navItems = createNavItems(userRole, dashboardUrl);
  
  return (
    <div className="bg-sidebar text-sidebar-foreground shadow-lg">
      <DesktopNavigation navItems={navItems} activeItem={activeItem} />
      <MobileNavigation 
        navItems={navItems} 
        activeItem={activeItem}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        getDashboardUrl={dashboardUrl}
      />
    </div>
  );
};

export default Navigation;
