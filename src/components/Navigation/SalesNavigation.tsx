
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid, Users, BarChart3, GraduationCap, Wrench, Phone, Bot } from 'lucide-react';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const SalesNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/sales/dashboard', icon: Grid },
    { label: 'Lead Management', href: '/sales/lead-management', icon: Users },
    { label: 'AI Agent', href: '/sales/ai', icon: Bot },
    { label: 'Dialer', href: '/sales/dialer', icon: Phone },
    { label: 'Analytics', href: '/sales/analytics', icon: BarChart3 },
    { label: 'Academy', href: '/sales/academy', icon: GraduationCap },
    { label: 'Settings', href: '/sales/settings', icon: Wrench },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-6">
        <div className="flex items-center">
          <Logo />
          <div className="flex items-center space-x-1 text-sm text-muted-foreground ml-2">
            <Users className="h-4 w-4" />
            <span className="text-xs">Sales OS</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map(item => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href.includes('dashboard') && location.pathname === '/sales') ||
              (item.href.includes('lead-management') && location.pathname.includes('lead-management'));
            
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
                <IconComponent className="h-4 w-4" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserProfile 
            name={profile?.full_name || "Sales Rep"} 
            role="Sales Representative" 
          />
        </div>
      </div>
    </header>
  );
};

export default SalesNavigation;
