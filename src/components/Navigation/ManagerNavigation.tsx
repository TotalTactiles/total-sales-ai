
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Brain,
  FileText,
  Shield,
  Settings,
  Building2
} from 'lucide-react';

const ManagerNavigation: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/manager/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/manager/lead-management', label: 'Leads', icon: Users },
    { href: '/manager/company-brain', label: 'Company Brain', icon: Brain },
    { href: '/manager/team-management', label: 'Team', icon: Users },
    { href: '/manager/crm-integrations', label: 'CRM', icon: Building2 },
    { href: '/manager/reports', label: 'Reports', icon: FileText },
    { href: '/manager/security', label: 'Security', icon: Shield },
    { href: '/manager/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-4">
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
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Right side controls */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <UserProfile 
            name={profile?.full_name || "Manager"}
            role="Manager"
          />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
            
            {/* Mobile user section */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between">
                <UserProfile 
                  name={profile?.full_name || "Manager"}
                  role="Manager"
                />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ManagerNavigation;
