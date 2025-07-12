
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/hooks/useDemoMode';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { isDemoMode } = useDemoMode();

  // Determine if we should show developer navigation
  const showDeveloperNav = () => {
    // Check for developer mode
    const devMode = localStorage.getItem('developerMode') === 'true';
    const viewMode = localStorage.getItem('viewMode');
    
    if (devMode && viewMode === 'developer') {
      return true;
    }
    
    // Check if user is actually a developer
    if (profile?.role === 'developer' || profile?.role === 'admin') {
      return true;
    }
    
    // Check if on developer route
    return location.pathname.startsWith('/developer');
  };

  const shouldShowDevNav = showDeveloperNav();

  return (
    <div className="flex h-screen w-full bg-gray-900">
      {/* Developer Navigation Sidebar */}
      {shouldShowDevNav && <DeveloperNavigation />}
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-gray-900">
        <div className="h-full overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default UnifiedLayout;
