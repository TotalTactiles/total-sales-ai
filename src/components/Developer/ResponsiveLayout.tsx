
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
      return 'w-full px-4 sm:px-6 py-6';
    }
    
    return 'transition-all duration-300 ease-in-out px-8 py-6';
  };

  const getContentStyle = () => {
    if (isMobile) {
      return {
        width: '100%',
        marginLeft: '0px'
      };
    }
    
    // No need to manually calculate margins - sidebar component handles this
    return {
      width: '100%',
      maxWidth: '100%',
      transition: 'all 0.3s ease-in-out'
    };
  };

  return (
    <div 
      className={`min-h-screen bg-background ${getLayoutClasses()} ${className}`}
      style={getContentStyle()}
    >
      <div className="max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
