
import React from 'react';
import { cn } from '@/lib/utils';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn(
      "w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col",
      className
    )}>
      <ManagerNavigation />
    </div>
  );
};
