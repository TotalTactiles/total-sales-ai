
import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSidebar } from '@/components/ui/sidebar';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { open } = useSidebar();

  return (
    <div className="flex w-full min-h-screen bg-gray-900">
      {children}
    </div>
  );
};

export default UnifiedLayout;
