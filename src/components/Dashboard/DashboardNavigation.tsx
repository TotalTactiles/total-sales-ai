
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid, Users, BarChart3, GraduationCap, Wrench } from 'lucide-react';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';

const DashboardNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const dashboardHref = getDashboardUrl({ role: profile?.role ?? 'sales_rep' });

  const navItems = [
    { label: 'Dashboard', href: dashboardHref, icon: Grid },
    { label: 'Leads', href: '/leads', icon: Users },
    { label: 'Statistics', href: '/analytics', icon: BarChart3 },
    { label: 'Rep Dev', href: '/company-brain', icon: GraduationCap },
    { label: 'Tools', href: '/dialer', icon: Wrench },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              location.pathname === item.href ||
              ((item.href === '/sales/dashboard' || item.href === '/manager/dashboard') &&
                location.pathname === '/');
            
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

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserProfile 
            name={profile?.full_name || "Sam Smith"}
            role={profile?.role === 'sales_rep' ? "Sales Representative" : "Manager"}
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavigation;
