
import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import MobileBottomNav from './MobileBottomNav';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({ 
  children, 
  showBottomNav = true 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className={`${isMobile && showBottomNav ? 'pb-16' : ''}`}>
        {children}
      </div>
      {isMobile && showBottomNav && <MobileBottomNav />}
    </div>
  );
};

export default MobileOptimizedLayout;
