
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
      return 'w-full px-4 sm:px-6';
    }
    
    return 'transition-all duration-300 ease-in-out px-6';
  };

  const getContentStyle = () => {
    if (isMobile) {
      return {
        width: '100%',
        marginLeft: '0px'
      };
    }
    
    // Desktop layout with proper sidebar spacing
    const sidebarWidth = open ? 256 : 64; // 16rem expanded, 4rem collapsed
    return {
      marginLeft: `${sidebarWidth}px`,
      width: `calc(100vw - ${sidebarWidth}px)`,
      maxWidth: `calc(100vw - ${sidebarWidth}px)`,
      transition: 'all 0.3s ease-in-out'
    };
  };

  return (
    <div 
      className={`min-h-screen ${getLayoutClasses()} ${className}`}
      style={getContentStyle()}
    >
      <div className="max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
