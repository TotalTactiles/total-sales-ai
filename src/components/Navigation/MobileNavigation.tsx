
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
        <div className="px-4 py-2 flex justify-between items-center border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-sidebar-foreground"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-full p-1.5">
              <div className="relative">
                <Bell className="h-4.5 w-4.5" />
                <Badge className="absolute -top-1 -right-1 bg-dashRed rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold p-0">
                  3
                </Badge>
              </div>
            </Button>
            <div className="h-6 border-l border-sidebar-border mx-1"></div>
            <UserProfile name="Sam" role="" />
          </div>
        </div>
        
        {/* Mobile Menu (Slide down) */}
        {mobileMenuOpen && (
          <div className="bg-sidebar-accent/30 py-2 animate-slide-up">
            {navItems.map((item) => (
              <Link 
                key={item.id}
                to={item.href}
                className={`px-4 py-3 font-medium transition-colors flex items-center gap-3 ${
                  activeItem === item.id 
                    ? 'text-sidebar-foreground bg-sidebar-accent/80' 
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Mobile Bottom Tab Bar - Visible on small screens */}
      <div className="md:hidden mobile-tab-bar">
        <Link to={getDashboardUrl()} className={`mobile-tab-item ${activeItem === 'dashboard' ? 'active' : ''}`}>
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        <Link to="/leads" className={`mobile-tab-item ${activeItem === 'leads' ? 'active' : ''}`}>
          <Users className="h-5 w-5 mb-1" />
          <span>Leads</span>
        </Link>
        <Link to="/dialer" className={`mobile-tab-item ${activeItem === 'dialer' ? 'active' : ''}`}>
          <Headphones className="h-5 w-5 mb-1" />
          <span>Calls</span>
        </Link>
        <Link to="/analytics" className={`mobile-tab-item ${activeItem === 'analytics' ? 'active' : ''}`}>
          <BarChart className="h-5 w-5 mb-1" />
          <span>Stats</span>
        </Link>
        <Link to="/settings" className={`mobile-tab-item ${activeItem === 'settings' ? 'active' : ''}`}>
          <Settings className="h-5 w-5 mb-1" />
          <span>More</span>
        </Link>
      </div>
    </>
  );
};

export default MobileNavigation;
