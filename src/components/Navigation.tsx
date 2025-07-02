
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import DesktopNavigation from './Navigation/DesktopNavigation';
import MobileNavigation from './Navigation/MobileNavigation';
import { getDashboardUrl, updateActiveItem } from './Navigation/navigationUtils';
import { createNavItems } from './Navigation/navigationConfig';

const Navigation = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');
  
  // Create dashboard URL function with current profile
  const dashboardUrl = () => getDashboardUrl(profile);
  
  // Update active item based on current location
  useEffect(() => {
    updateActiveItem(location.pathname, setActiveItem);
  }, [location]);
  
  const navItems = createNavItems(dashboardUrl);
  
  return (
    <div className="bg-sidebar text-sidebar-foreground shadow-lg">
      <DesktopNavigation navItems={navItems} activeItem={activeItem} />
      <MobileNavigation />
    </div>
  );
};

export default Navigation;
