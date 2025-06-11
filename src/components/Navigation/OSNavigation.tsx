import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

export interface OSNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface OSNavigationProps {
  items: OSNavItem[];
  role: string;
  alignment?: 'top' | 'bottom';
  icon?: React.ComponentType<any>;
  roleBadge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const OSNavigation: React.FC<OSNavigationProps> = ({
  items,
  role,
  alignment = 'top',
  icon: RoleIcon,
  roleBadge,
  actions,
  className
}) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const positionClass = alignment === 'bottom' ? 'bottom-0' : 'top-0';

  return (
    <header
      className={cn(
        `fixed ${positionClass} left-0 right-0 z-50 border-b shadow-sm`,
        className || 'bg-background border-border'
      )}
    >
      <div className="h-[60px] flex items-center justify-between px-6">
        <div className="flex items-center">
          <Logo />
          <div className="flex items-center space-x-1 text-sm text-muted-foreground ml-2">
            {RoleIcon && <RoleIcon className="h-4 w-4" />}
            <span className="text-xs">{role}</span>
            {roleBadge}
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden p-2 rounded-md hover:bg-accent focus:outline-none"
          onClick={() => setMobileMenuOpen(prev => !prev)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center space-x-4">{actions}</div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4">
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>
            {items.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default OSNavigation;
