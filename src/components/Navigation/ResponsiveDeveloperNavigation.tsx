
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/useIsMobile';
import { 
  LayoutDashboard, 
  FileText, 
  Activity,
  Brain,
  LogOut,
  Monitor,
  Flag,
  TrendingUp,
  Network,
  AlertTriangle,
  Menu
} from 'lucide-react';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';

const ResponsiveDeveloperNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useOptimizedLogout();
  const isMobile = useIsMobile();
  const { open, setOpen } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    const savedState = localStorage.getItem('developer-sidebar-open');
    if (savedState !== null) {
      setOpen(JSON.parse(savedState));
    }
  }, [setOpen]);

  useEffect(() => {
    localStorage.setItem('developer-sidebar-open', JSON.stringify(open));
  }, [open]);

  const navItems = [
    { path: '/developer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/developer/tsam-brain', label: 'TSAM Brain', icon: Brain },
    { path: '/developer/system-monitor', label: 'System Monitor', icon: Monitor },
    { path: '/developer/api-logs', label: 'API Logs', icon: FileText },
    { path: '/developer/feature-flags', label: 'Feature Flags', icon: Flag },
    { path: '/developer/system-updates', label: 'System Updates', icon: TrendingUp },
    { path: '/developer/ai-integration', label: 'AI Integration', icon: Network },
    { path: '/developer/error-logs', label: 'Error Debug', icon: AlertTriangle },
    { path: '/developer/agent-health', label: 'Agent Health', icon: Activity },
  ];

  const handleSignOut = () => {
    logout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="mb-8">
          <h2 className={`text-xl font-bold text-green-400 transition-all duration-300 ${
            !open && !isMobile ? 'text-center text-sm' : ''
          }`}>
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
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full gap-3 transition-all duration-300 ${
                  !open && !isMobile ? 'justify-center px-2' : 'justify-start'
                } ${
                  isActive 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                onClick={() => handleNavigation(item.path)}
                title={!open && !isMobile ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {(open || isMobile) && (
                  <span className="truncate">{item.label}</span>
                )}
              </Button>
            );
          })}
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className={`w-full gap-3 text-red-400 border-red-400 hover:bg-red-900/20 transition-all duration-300 ${
              !open && !isMobile ? 'justify-center px-2' : 'justify-start'
            }`}
            onClick={handleSignOut}
            title={!open && !isMobile ? 'Sign Out' : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {(open || isMobile) && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </>
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
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-gray-900 text-white p-0">
              <div className="relative h-full">
                <SidebarContent />
              </div>
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
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white shadow-lg z-40 transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      }`}
      collapsible="icon"
    >
      <SidebarTrigger className="absolute -right-3 top-6 bg-gray-900 border border-gray-700 hover:bg-gray-800 z-50" />
      <div className="relative h-full">
        <SidebarContent />
      </div>
    </Sidebar>
  );
};

export default ResponsiveDeveloperNavigation;
