
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import UserProfile from '../UserProfile';
import { ThemeToggle } from '../ThemeProvider';
import { Bell, Menu, X, Home, Users, Headphones, BarChart, Settings } from "lucide-react";
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
  return (
    <>
      <div className="md:hidden">
        <div className="px-4 py-3 flex justify-between items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-2 touch-target"
            >
              <div className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 bg-destructive rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold p-0">
                  3
                </Badge>
              </div>
            </Button>
            <div className="h-6 border-l border-border mx-1"></div>
            <UserProfile name="Sam" role="" />
          </div>
        </div>
        
        {/* Mobile Menu (Slide down) */}
        {mobileMenuOpen && (
          <div className="bg-background border-b border-border animate-slide-up">
            <div className="max-h-[60vh] overflow-y-auto mobile-scroll">
              {navItems.map((item) => (
                <Link 
                  key={item.id}
                  to={item.href}
                  className={`mobile-nav-item ${
                    activeItem === item.id ? 'active' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Bottom Tab Bar - Clean and minimal */}
      <div className="mobile-tab-bar md:hidden">
        <Link to={getDashboardUrl()} className={`mobile-tab-item ${activeItem === 'dashboard' ? 'active' : ''}`}>
          <Home className="h-5 w-5 flex-shrink-0" />
          <span>Home</span>
        </Link>
        <Link to="/leads" className={`mobile-tab-item ${activeItem === 'leads' ? 'active' : ''}`}>
          <Users className="h-5 w-5 flex-shrink-0" />
          <span>Leads</span>
        </Link>
        <Link to="/dialer" className={`mobile-tab-item ${activeItem === 'dialer' ? 'active' : ''}`}>
          <Headphones className="h-5 w-5 flex-shrink-0" />
          <span>Calls</span>
        </Link>
        <Link to="/analytics" className={`mobile-tab-item ${activeItem === 'analytics' ? 'active' : ''}`}>
          <BarChart className="h-5 w-5 flex-shrink-0" />
          <span>Stats</span>
        </Link>
        <Link to="/settings" className={`mobile-tab-item ${activeItem === 'settings' ? 'active' : ''}`}>
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span>More</span>
        </Link>
      </div>
    </>
  );
};

export default MobileNavigation;
