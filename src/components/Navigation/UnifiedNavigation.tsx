
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { getRoutesForRole } from '@/config/routes';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';

const UnifiedNavigation: React.FC = () => {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const routes = getRoutesForRole(profile.role);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  const isActiveRoute = (path: string) => {
    if (path.includes(':')) {
      const basePath = path.split('/:')[0];
      return location.pathname.startsWith(basePath);
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {routes.map((route) => {
            const isActive = isActiveRoute(route.path);
            
            return (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {route.icon && getIcon(route.icon)}
                <span>{route.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserProfile 
            name={profile.full_name || "User"}
            role={profile.role.replace('_', ' ')}
          />
        </div>
      </div>
    </header>
  );
};

export default UnifiedNavigation;
