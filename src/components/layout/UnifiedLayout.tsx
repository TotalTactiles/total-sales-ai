
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import LogoutButton from '@/components/auth/LogoutButton';
import SalesNavigation from '@/components/Navigation/SalesNavigation';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const { profile } = useAuth();
  const { isDemoUser, demoRole } = useDemoMode();

  const userRole = isDemoUser ? demoRole : profile?.role;

  const renderNavigation = () => {
    switch (userRole) {
      case 'sales_rep':
        return <SalesNavigation />;
      case 'manager':
        return <ManagerNavigation />;
      case 'developer':
      case 'admin':
        return <DeveloperNavigation />;
      default:
        return <SalesNavigation />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Panel */}
      {renderNavigation()}

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <div className="fixed top-0 right-0 left-64 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">
              {userRole === 'sales_rep' ? 'Sales OS' : 
               userRole === 'manager' ? 'Manager OS' : 
               'Developer OS'}
            </h1>
            {isDemoUser && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Demo Mode
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile?.full_name || 'Demo User'}
            </span>
            <LogoutButton variant="outline" size="sm" />
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UnifiedLayout;
