
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useAutomationNotifications } from '@/hooks/useAutomationNotifications';

interface UnifiedLayoutProps {
  children?: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const { hasNewNotifications, notificationCount } = useAutomationNotifications();

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        hasAutomationNotifications={hasNewNotifications} 
        notificationCount={notificationCount} 
      />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default UnifiedLayout;
