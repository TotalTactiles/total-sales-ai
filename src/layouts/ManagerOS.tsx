
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DevModeToggle from '@/components/DeveloperMode/DevModeToggle';

const ManagerOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DevModeToggle />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerOS;
