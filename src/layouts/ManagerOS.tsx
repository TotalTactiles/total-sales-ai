
import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import DevModeToggle from '@/components/DeveloperMode/DevModeToggle';

const ManagerOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      <DevModeToggle />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerOS;
