
import React from 'react';
import Navigation from './Navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className={`main-content ${isMobile ? 'pb-20' : ''}`}>
        <div className="responsive-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
