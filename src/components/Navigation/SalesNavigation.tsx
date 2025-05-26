
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid, Users, BarChart3, GraduationCap, Wrench, Phone, Bot } from 'lucide-react';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import RoleToggle from '@/components/Navigation/RoleToggle';
import { useAuth } from '@/contexts/AuthContext';

const SalesNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/sales/dashboard', icon: Grid },
    { label: 'Leads', href: '/sales/leads', icon: Users },
    { label: 'Analytics', href: '/sales/analytics', icon: BarChart3 },
    { label: 'Rep Dev', href: '/sales/company-brain', icon: GraduationCap },
    { label: 'Dialer', href: '/sales/dialer', icon: Phone },
    { label: 'AI Agent', href: '/sales/ai-agent', icon: Bot },
    { label: 'Tools', href: '/sales/tools', icon: Wrench },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-6">
        <div className="flex items-center">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const IconComponent = item.icon;
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
                <IconComponent className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <RoleToggle />
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
