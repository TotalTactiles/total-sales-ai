
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useAutomationNotifications } from '@/hooks/useAutomationNotifications';

const UnifiedLayout: React.FC = () => {
  const { hasNewNotifications, notificationCount } = useAutomationNotifications();

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        hasAutomationNotifications={hasNewNotifications} 
        notificationCount={notificationCount} 
      />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default UnifiedLayout;
