
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Settings, Phone, Brain, GraduationCap, Building2 } from 'lucide-react';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const SalesRepNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/sales/dashboard', icon: BarChart3 },
    { label: 'Analytics', href: '/sales/analytics', icon: BarChart3 },
    { label: 'Leads', href: '/sales/leads', icon: Users },
    { label: 'Dialer', href: '/sales/dialer', icon: Phone },
    { label: 'Academy', href: '/sales/academy', icon: GraduationCap },
    { label: 'AI', href: '/sales/ai', icon: Brain },
    { label: 'Settings', href: '/sales/settings', icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-4 lg:px-6">
        {/* Left side - Logo and role indicator */}
        <div className="flex items-center space-x-2 min-w-0">
          <Logo />
          <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="my-[8px] mx-[8px]">Sales Rep</span>
          </div>
        </div>

        {/* Center - Navigation Icons */}
        <nav className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-center max-w-4xl overflow-x-auto">
          {navItems.map(item => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                title={item.label}
              >
                <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            );
          })}
        </nav>

        {/* Right side - Theme toggle and user profile */}
        <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
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

export default SalesRepNavigation;
