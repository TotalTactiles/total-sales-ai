
import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSidebar } from '@/components/ui/sidebar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, className = '' }) => {
  const isMobile = useIsMobile();
  const { open } = useSidebar();

  // This component is now handled by UnifiedLayout, so we just pass through
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;
