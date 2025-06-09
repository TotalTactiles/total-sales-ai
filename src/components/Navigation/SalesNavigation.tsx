
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid, Users, BarChart3, GraduationCap, Wrench, Phone, Bot, Menu, X, Brain, Bell } from 'lucide-react';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const SalesNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/sales/dashboard', icon: Grid },
    { label: 'Leads', href: '/sales/lead-management', icon: Users },
    { label: 'AI Agent', href: '/sales/ai', icon: Brain },
    { label: 'Dialer', href: '/sales/dialer', icon: Phone },
    { label: 'Analytics', href: '/sales/analytics', icon: BarChart3 },
    { label: 'Academy', href: '/sales/academy', icon: GraduationCap },
    { label: 'Settings', href: '/sales/settings', icon: Wrench },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-pill bg-lavender-100">
            <Users className="h-4 w-4 text-lavender-600" />
            <span className="text-xs font-medium text-lavender-700">Sales OS</span>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map(item => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href ||
              (item.href.includes('dashboard') && location.pathname === '/sales') ||
              (item.href.includes('lead-management') && location.pathname.includes('lead-management'));
            
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'gradient-lavender text-white shadow-card'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          <ThemeToggle />
          
          <UserProfile
            name={profile?.full_name || "Sales Rep"}
            role="Sales Representative"
          />

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(prev => !prev)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card p-4 space-y-2 shadow-card">
          {navItems.map(item => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href ||
              (item.href.includes('dashboard') && location.pathname === '/sales') ||
              (item.href.includes('lead-management') && location.pathname.includes('lead-management'));

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full ${
                  isActive
                    ? 'gradient-lavender text-white shadow-card'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default SalesNavigation;
