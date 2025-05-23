
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import UserProfile from './UserProfile';
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from './ThemeProvider';
import { 
  Bell, 
  Calendar, 
  Zap, 
  MessageCircle, 
  BarChart, 
  Users,
  Settings,
  BookOpen,
  ShoppingBag,
  Headphones,
  Home,
  Briefcase,
  FileText,
  Shield,
  Menu,
  X
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Update active item based on current location
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setActiveItem('dashboard');
    else if (path === '/dialer') setActiveItem('dialer');
    else if (path === '/leads') setActiveItem('leads');
    else if (path === '/analytics') setActiveItem('analytics');
    else if (path === '/missions') setActiveItem('missions');
    else if (path === '/brain') setActiveItem('brain');
    else if (path === '/tools') setActiveItem('tools');
    else if (path === '/settings') setActiveItem('settings');
    else if (path === '/ai-agent') setActiveItem('ai-agent');
  }, [location]);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/', icon: <Home className="h-5 w-5" /> },
    { id: 'dialer', label: 'Smart Dialer', href: '/dialer', icon: <Headphones className="h-5 w-5" /> }, 
    { id: 'leads', label: 'Lead Management', href: '/leads', icon: <Users className="h-5 w-5" /> },
    { id: 'analytics', label: 'Analytics', href: '/analytics', icon: <BarChart className="h-5 w-5" /> },
    { id: 'missions', label: 'Agent Missions', href: '/missions', icon: <Briefcase className="h-5 w-5" /> }, 
    { id: 'brain', label: 'Company Brain', href: '/brain', icon: <BookOpen className="h-5 w-5" /> }, 
    { id: 'tools', label: 'Agent Tools', href: '/tools', icon: <ShoppingBag className="h-5 w-5" /> }, 
    { id: 'reports', label: 'Reports', href: '/reports', icon: <FileText className="h-5 w-5" /> },
    { id: 'access', label: 'Access Control', href: '/access', icon: <Shield className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> }, 
    { id: 'ai-agent', label: '🧠 AI Agent (Beta)', href: '/ai-agent', icon: null },
  ];
  
  return (
    <div className="bg-sidebar text-sidebar-foreground shadow-lg">
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
      
      {/* Mobile Navigation */}
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
        <Link to="/" className={`mobile-tab-item ${activeItem === 'dashboard' ? 'active' : ''}`}>
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
    </div>
  );
};

export default Navigation;
