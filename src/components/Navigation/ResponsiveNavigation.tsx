
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNavigation from './DashboardNavigation';
import SalesNavigation from './SalesNavigation';
import SalesRepNavigation from './SalesRepNavigation';
import ManagerNavigation from './ManagerNavigation';
import DeveloperNavigation from './DeveloperNavigation';

const ResponsiveNavigation: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuth();
  
  // Determine which navigation to show based on route
  const getNavigationComponent = () => {
    const path = location.pathname;
    
    // Developer routes
    if (path.startsWith('/developer')) {
      return <DeveloperNavigation />;
    }
    
    // Manager routes  
    if (path.startsWith('/manager')) {
      return <ManagerNavigation />;
    }
    
    // Sales routes
    if (path.startsWith('/sales/')) {
      return <SalesNavigation />;
    }
    
    // Sales Rep OS routes
    if (path.startsWith('/sales')) {
      return <SalesRepNavigation />;
    }
    
    // Default dashboard navigation
    return <DashboardNavigation />;
  };

  return (
    <div className="w-full">
      {getNavigationComponent()}
    </div>
  );
};

export default ResponsiveNavigation;
