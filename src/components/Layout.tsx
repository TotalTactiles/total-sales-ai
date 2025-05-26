
import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <main className={`${isMobile ? 'pb-20' : 'pb-10'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
