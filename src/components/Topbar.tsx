
import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';

export const Topbar: React.FC = () => {
  const { logout } = useOptimizedLogout();

  // Prefetch auth page for faster logout
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/auth';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Manager Dashboard
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <UserProfile 
          name="Manager User"
          role="Manager"
          onLogout={logout}
        />
      </div>
    </header>
  );
};
