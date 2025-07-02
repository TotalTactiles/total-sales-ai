
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Users, Settings, LogOut, BarChart3, Phone, Brain, Wrench } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const MobileNavigation = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const getNavItems = () => {
    if (!profile) return [];

    const baseItems = [
      { 
        icon: Home, 
        label: 'Dashboard', 
        path: profile.role === 'manager' ? '/manager' : profile.role === 'developer' ? '/developer' : '/sales',
        active: location.pathname.includes('/dashboard')
      }
    ];

    switch (profile.role) {
      case 'manager':
        return [
          ...baseItems,
          { icon: Users, label: 'Team', path: '/manager/team', active: location.pathname.includes('/team') },
          { icon: BarChart3, label: 'Analytics', path: '/manager/analytics', active: location.pathname.includes('/analytics') },
          { icon: Brain, label: 'AI Brain', path: '/manager/brain', active: location.pathname.includes('/brain') }
        ];
      case 'sales_rep':
        return [
          ...baseItems,
          { icon: Phone, label: 'Dialer', path: '/sales/dialer', active: location.pathname.includes('/dialer') },
          { icon: Users, label: 'Leads', path: '/sales/leads', active: location.pathname.includes('/leads') },
          { icon: Brain, label: 'AI Assistant', path: '/sales/assistant', active: location.pathname.includes('/assistant') }
        ];
      case 'developer':
        return [
          ...baseItems,
          { icon: Wrench, label: 'System Health', path: '/developer/health', active: location.pathname.includes('/health') },
          { icon: Users, label: 'User Management', path: '/developer/users', active: location.pathname.includes('/users') },
          { icon: Settings, label: 'Settings', path: '/developer/settings', active: location.pathname.includes('/settings') }
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  if (!profile) return null;

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                T
              </div>
              TSAM
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* User Profile Section */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {profile.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-sm">{profile.full_name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {profile.role.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={item.active ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* Sign Out */}
            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
