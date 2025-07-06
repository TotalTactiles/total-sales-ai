
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { getOSTheme } from '@/router/routes';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import { cn } from '@/lib/utils';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const { profile } = useAuth();
  const location = useLocation();
  
  const osTheme = getOSTheme(profile?.role || 'sales_rep');
  const isDeveloper = profile?.role === 'developer';
  const isManager = profile?.role === 'manager';
  const isSales = profile?.role === 'sales_rep';

  const getThemeClasses = () => {
    switch (osTheme) {
      case 'dark':
        return 'bg-gray-900 text-white min-h-screen';
      case 'manager':
        return 'bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen';
      case 'sales':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen';
      default:
        return 'bg-white min-h-screen';
    }
  };

  const renderNavigation = () => {
    if (isDeveloper) {
      return <DeveloperNavigation />;
    }
    if (isManager) {
      return <ManagerNavigation />;
    }
    return <SalesRepNavigation />;
  };

  const getLayoutClasses = () => {
    if (isDeveloper) {
      return 'flex w-full min-h-screen';
    }
    return 'w-full min-h-screen';
  };

  const getMainClasses = () => {
    if (isDeveloper) {
      return 'flex-1 w-full min-w-0 overflow-hidden';
    }
    return 'w-full pt-16'; // Account for fixed top navigation
  };

  const getContentClasses = () => {
    if (isDeveloper) {
      return 'w-full h-full p-6 overflow-y-auto';
    }
    return 'w-full px-4 sm:px-6 lg:px-8 py-6';
  };

  return (
    <div className={cn(getLayoutClasses(), getThemeClasses())}>
      {renderNavigation()}
      <main className={cn(getMainClasses())}>
        <div className={cn(getContentClasses())}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default UnifiedLayout;
