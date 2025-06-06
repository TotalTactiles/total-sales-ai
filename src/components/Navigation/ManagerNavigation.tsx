
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Settings,
  Brain,
  Building2,
  Database,
  Shield,
  FileText
} from 'lucide-react';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const ManagerNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/manager/dashboard', icon: BarChart3 },
    { label: 'Analytics', href: '/manager/analytics', icon: BarChart3 },
    { label: 'Lead Management', href: '/manager/lead-management', icon: Users },
    { label: 'Company Brain', href: '/manager/company-brain', icon: Database },
    { label: 'AI Assistant', href: '/manager/ai', icon: Brain },
    { label: 'CRM Integrations', href: '/manager/crm-integrations', icon: Database },
    { label: 'Team Management', href: '/manager/team-management', icon: Users },
    { label: 'Security', href: '/manager/security', icon: Shield },
    { label: 'Reports', href: '/manager/reports', icon: FileText },
    { label: 'Settings', href: '/manager/settings', icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <Logo />
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Manager OS</span>
          </div>
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
          <ThemeToggle />
          <UserProfile 
            name={profile?.full_name || "Manager"}
            role="Sales Manager"
          />
        </div>
      </div>
    </header>
  );
};

export default ManagerNavigation;
