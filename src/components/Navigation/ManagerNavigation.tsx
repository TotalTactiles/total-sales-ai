
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Settings, Brain, Building2, Database, Shield, FileText } from 'lucide-react';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const ManagerNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  // Primary navigation items (always visible)
  const primaryNavItems = [
    { label: 'Dashboard', href: '/manager/dashboard', icon: BarChart3 },
    { label: 'Analytics', href: '/manager/analytics', icon: BarChart3 },
    { label: 'Leads', href: '/manager/lead-management', icon: Users },
    { label: 'Knowledge', href: '/manager/company-brain', icon: Database },
    { label: 'AI', href: '/manager/ai', icon: Brain },
  ];

  // Secondary navigation items (in dropdown for smaller screens)
  const secondaryNavItems = [
    { label: 'CRM', href: '/manager/crm-integrations', icon: Database },
    { label: 'Team', href: '/manager/team-management', icon: Users },
    { label: 'Security', href: '/manager/security', icon: Shield },
    { label: 'Reports', href: '/manager/reports', icon: FileText },
    { label: 'Settings', href: '/manager/settings', icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-4 lg:px-6">
        {/* Left side - Logo and role indicator */}
        <div className="flex items-center space-x-2 min-w-0">
          <Logo />
          <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="my-[8px] mx-[8px]">Manager</span>
          </div>
        </div>

        {/* Center - Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 justify-center max-w-4xl">
          {primaryNavItems.map(item => {
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

        {/* Mobile/Tablet Navigation */}
        <nav className="flex lg:hidden items-center space-x-2 flex-1 justify-center max-w-md overflow-x-auto">
          {primaryNavItems.slice(0, 3).map(item => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center space-x-1 px-2 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <IconComponent className="h-3 w-3" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side - Theme toggle and user profile */}
        <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
          <ThemeToggle />
          <UserProfile 
            name={profile?.full_name || "Manager"} 
            role="Sales Manager" 
          />
        </div>
      </div>

      {/* Secondary navigation for larger screens */}
      <div className="hidden xl:block border-t border-border">
        <div className="h-[40px] flex items-center justify-center px-6">
          <nav className="flex items-center space-x-6">
            {secondaryNavItems.map(item => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <IconComponent className="h-3 w-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default ManagerNavigation;
