
import React from 'react';
import Navigation from './Navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="dashboard-layout">
      <Navigation />
      <main className={`dashboard-content responsive-container ${isMobile ? 'pb-20' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
