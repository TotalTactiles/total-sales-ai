
import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSidebar } from '@/components/ui/sidebar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, className = '' }) => {
  const isMobile = useIsMobile();
  const { collapsed } = useSidebar();

  const getLayoutClasses = () => {
    if (isMobile) {
      return 'w-full px-4 sm:px-6';
    }
    
    const sidebarWidth = collapsed ? 64 : 256; // 16px = 4rem collapsed, 64px = 16rem expanded
    return `transition-all duration-300 ease-in-out`;
  };

  const getMarginStyle = () => {
    if (isMobile) return {};
    
    const sidebarWidth = collapsed ? 64 : 256;
    return {
      marginLeft: `${sidebarWidth}px`,
      width: `calc(100vw - ${sidebarWidth}px)`
    };
  };

  return (
    <div 
      className={`${getLayoutClasses()} ${className}`}
      style={getMarginStyle()}
    >
      <div className="max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
