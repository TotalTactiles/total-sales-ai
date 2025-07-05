
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

  const getLayoutClasses = () => {
    if (isMobile) {
      return 'w-full px-4 sm:px-6 py-6 pt-20'; // Add top padding for mobile header
    }
    
    return 'transition-all duration-300 ease-in-out px-8 py-6 w-full';
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${getLayoutClasses()} ${className}`}>
      <div className="max-w-[1440px] mx-auto">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
