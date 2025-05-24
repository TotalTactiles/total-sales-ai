
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import UserProfile from '../UserProfile';
import { ThemeToggle } from '../ThemeProvider';
import { Bell, Calendar, Zap, MessageCircle } from "lucide-react";
import { NavItem } from './navigationConfig';

interface DesktopNavigationProps {
  navItems: NavItem[];
  activeItem: string;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ navItems, activeItem }) => {
  return (
    <div className="hidden md:block">
      {/* Desktop Navigation */}
      <div className="px-6 py-3 flex justify-between items-center border-b border-sidebar-border">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-full p-2">
            <div className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 bg-dashRed rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold p-0">
                3
              </Badge>
            </div>
          </Button>
          <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-full p-2">
            <div className="relative">
              <Calendar className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 bg-dashBlue rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold p-0">
                5
              </Badge>
            </div>
          </Button>
          <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-full p-2">
            <div className="relative">
              <Zap className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 bg-dashGreen rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold p-0">
                2
              </Badge>
            </div>
          </Button>
          
          <div className="h-8 border-l border-sidebar-border mx-2"></div>
          
          {/* Gamification Bar */}
          <div className="hidden md:flex items-center gap-3 bg-sidebar-accent/70 px-3 py-1.5 rounded-full text-xs">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-dashGreen" />
              <span>Level 12</span>
            </div>
            <div className="h-3 border-l border-sidebar-border"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-dashYellow">🔥 3 Day Streak</span>
            </div>
            <div className="h-3 border-l border-sidebar-border"></div>
            <div>
              <span>250 Credits</span>
            </div>
          </div>
          
          <div className="h-8 border-l border-sidebar-border mx-2"></div>
          
          <ThemeToggle />
          
          <div className="h-8 border-l border-sidebar-border mx-2"></div>
          
          {/* User Profile */}
          <div>
            <UserProfile name="Sam Smith" role="Sales Representative" />
          </div>
        </div>
      </div>
      
      {/* Desktop Menu */}
      <div className="px-4 py-1 flex overflow-x-auto scrollbar-none">
        {navItems.slice(0, 8).map((item) => (
          <Link 
            key={item.id}
            to={item.href}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeItem === item.id 
                ? 'text-sidebar-foreground border-b-2 border-dashBlue' 
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
            }`}
          >
            {item.icon && <span className="hidden lg:inline-block">{item.icon}</span>}
            {item.label}
          </Link>
        ))}
        
        {/* Focus Mode Button */}
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-dashBlue text-dashBlue hover:bg-sidebar-accent hover:text-sidebar-foreground flex items-center gap-1.5 my-1.5"
          >
            <MessageCircle className="h-4 w-4" />
            Focus Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavigation;
