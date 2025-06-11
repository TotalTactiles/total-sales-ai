import React from 'react';
import {
  BarChart3,
  Users,
  Settings,
  Brain,
  Building2,
  Database,
  Shield,
  FileText,
} from 'lucide-react';
import OSNavigation from './OSNavigation';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

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
const ManagerNavigation = () => {
  const location = useLocation();
  const {
    profile
  } = useAuth();
  const navItems = [{
    label: 'Dashboard',
    href: '/manager/dashboard',
    icon: BarChart3
  }, {
    label: 'Analytics',
    href: '/manager/analytics',
    icon: BarChart3
  }, {
    label: 'Lead Management',
    href: '/manager/lead-management',
    icon: Users
  }, {
    label: 'Company Brain',
    href: '/manager/company-brain',
    icon: Database
  }, {
    label: 'AI Assistant',
    href: '/manager/ai',
    icon: Brain
  }, {
    label: 'CRM Integrations',
    href: '/manager/crm-integrations',
    icon: Database
  }, {
    label: 'Team Management',
    href: '/manager/team-management',
    icon: Users
  }, {
    label: 'Security',
    href: '/manager/security',
    icon: Shield
  }, {
    label: 'Reports',
    href: '/manager/reports',
    icon: FileText
  }, {
    label: 'Settings',
    href: '/manager/settings',
    icon: Settings
  }];
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <Logo />
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="my-[8px] mx-[12px]">Manager</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-6 overflow-x-auto whitespace-nowrap">
        <nav className="hidden md:flex items-center space-x-6" aria-label="Manager navigation">
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>
            {navItems.map(item => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            return <Link key={item.label} to={item.href} aria-current={isActive ? 'page' : undefined} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>;
          })}
          </div>
        </nav>

const ManagerNavigation: React.FC = () => {
  const { profile } = useAuth();

  return (
    <OSNavigation
      items={navItems}
      role="Manager"
      icon={Building2}
      actions={
        <>
          <ThemeToggle />
          <UserProfile name={profile?.full_name || 'Manager'} role="Sales Manager" />
        </>
      }
    />
  );
};

export default ManagerNavigation;
