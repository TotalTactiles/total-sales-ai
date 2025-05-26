
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { shouldShowNavItem } from './navigationUtils';
import { NavItem } from './navigationConfig';

interface MobileNavigationProps {
  navItems: NavItem[];
  activeItem: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  getDashboardUrl: () => string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  navItems, 
  activeItem, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  getDashboardUrl 
}) => {
  const location = useLocation();
  const { profile } = useAuth();

  const filteredNavItems = navItems.filter(item => shouldShowNavItem(item.href, profile));

  return (
    <div className="lg:hidden">
      {/* Mobile menu button */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={getDashboardUrl()} className="text-xl font-bold text-sidebar-foreground">
          SalesOS
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="px-4 py-2 space-y-1 bg-sidebar border-t border-sidebar-border">
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname === item.href || 
                           (item.href.includes('dashboard') && location.pathname === '/') ||
                           activeItem === item.label.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <Link
                key={index}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
