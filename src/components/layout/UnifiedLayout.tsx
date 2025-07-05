
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
        return 'bg-gray-900 text-white';
      case 'manager':
        return 'bg-gradient-to-br from-purple-50 to-blue-50';
      case 'sales':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50';
      default:
        return 'bg-white';
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
      return 'flex min-h-screen';
    }
    return 'min-h-screen';
  };

  const getMainClasses = () => {
    if (isDeveloper) {
      return 'flex-1 min-w-0';
    }
    return 'pt-16'; // Account for fixed top navigation
  };

  return (
    <div className={cn(getLayoutClasses(), getThemeClasses())}>
      {renderNavigation()}
      <main className={cn(getMainClasses())}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default UnifiedLayout;
