
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Badge } from '@/components/ui/badge';
import { Menu, Brain } from 'lucide-react';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';
import { ROUTE_CONFIGS } from '@/router/routes';
import * as Icons from 'lucide-react';

const ResponsiveDeveloperNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useOptimizedLogout();
  const isMobile = useIsMobile();
  const { open, setOpen } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Persist sidebar state only for desktop
  useEffect(() => {
    if (!isMobile) {
      const savedState = localStorage.getItem('developer-sidebar-open');
      if (savedState !== null) {
        setOpen(JSON.parse(savedState));
      }
    }
  }, [setOpen, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('developer-sidebar-open', JSON.stringify(open));
    }
  }, [open, isMobile]);

  const navItems = ROUTE_CONFIGS.developer;

  const handleSignOut = () => {
    logout();
  };

  const handleNavigation = (path: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Prevent multiple rapid clicks
    if (isNavigating) return;
    
    console.log('Navigating to:', path, 'from:', location.pathname);
    setIsNavigating(true);
    
    try {
      // Close mobile menu immediately
      if (isMobile) {
        setMobileMenuOpen(false);
      }
      
      // Force clean navigation for dashboard
      if (path === '/developer/dashboard') {
        console.log('Dashboard navigation - force clean routing');
        
        // Clear any navigation state
        window.history.replaceState(null, '', path);
        
        // Use navigate with replace and force refresh
        navigate(path, { 
          replace: true,
          state: { 
            fromNavigation: true, 
            timestamp: Date.now(),
            forceRefresh: true
          }
        });
        
        // Ensure page loads by forcing a small delay
        setTimeout(() => {
          if (window.location.pathname !== path) {
            window.location.href = path;
          }
        }, 100);
        
      } else {
        // Regular navigation for other routes
        navigate(path, { 
          replace: false,
          state: { fromNavigation: true, timestamp: Date.now() }
        });
      }
      
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: force page reload as last resort
      window.location.href = path;
    } finally {
      // Reset navigation state after a delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <Icons.Circle className="h-4 w-4" />;
  };

  const SidebarContentComponent = () => (
    <SidebarContent className="bg-gray-900 text-white border-r border-gray-700">
      <div className="p-6">
        <div className="mb-8">
          <h2 className={`text-xl font-bold text-green-400 transition-all duration-300 ${!open && !isMobile ? 'text-center text-sm' : ''}`}>
            {!open && !isMobile ? 'DEV' : 'Developer OS'}
          </h2>
          {(open || isMobile) && (
            <>
              <p className="text-sm text-gray-400">TSAM Development</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">TSAM Brain Active</span>
              </div>
            </>
          )}
        </div>
      </div>

      <SidebarGroup>
        <SidebarGroupLabel className="text-gray-300">Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path === '/developer/dashboard' && location.pathname === '/developer/');
              
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    onClick={(e) => handleNavigation(item.path, e)} 
                    isActive={isActive}
                    disabled={isNavigating}
                    tooltip={!open && !isMobile ? item.label : undefined}
                    className={`text-white hover:bg-gray-800 transition-colors cursor-pointer ${
                      isActive ? 'bg-gray-800 text-green-400' : ''
                    } ${isNavigating ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {getIcon(item.icon)}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <div className="mt-auto p-6">
        <Button 
          variant="outline" 
          className="w-full gap-3 text-red-400 border-red-400 hover:bg-red-900/20 bg-transparent" 
          onClick={handleSignOut}
          disabled={isNavigating}
        >
          <Icons.LogOut className="h-4 w-4" />
          {(open || isMobile) && <span>Sign Out</span>}
        </Button>
      </div>
    </SidebarContent>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-green-400">Developer OS</h2>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">TSAM Active</span>
            </div>
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isNavigating}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-gray-900 text-white p-0">
              <SidebarContentComponent />
            </SheetContent>
          </Sheet>
        </div>
        {/* Mobile spacer */}
        <div className="h-16 lg:hidden"></div>
      </>
    );
  }

  return (
    <Sidebar 
      className="bg-gray-900 text-white shadow-lg border-r border-gray-700 w-[240px]" 
      collapsible="icon"
    >
      <SidebarContentComponent />
    </Sidebar>
  );
};

export default ResponsiveDeveloperNavigation;
