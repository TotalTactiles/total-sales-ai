
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/useIsMobile';
import MobileOptimizedLayout from './MobileOptimizedLayout';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) {
    return <div className="min-h-screen bg-neutral-50">{children}</div>;
  }

  if (isMobile) {
    return (
      <MobileOptimizedLayout>
        {children}
      </MobileOptimizedLayout>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Navigation />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
