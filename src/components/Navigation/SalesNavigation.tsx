import React from 'react';
import { Grid, Users, BarChart3, GraduationCap, Wrench, Phone, Bot } from 'lucide-react';
import OSNavigation from './OSNavigation';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/sales/dashboard', icon: Grid },
  { label: 'Lead Management', href: '/sales/lead-management', icon: Users },
  { label: 'AI Agent', href: '/sales/ai', icon: Bot },
  { label: 'Dialer', href: '/sales/dialer', icon: Phone },
  { label: 'Analytics', href: '/sales/analytics', icon: BarChart3 },
  { label: 'Academy', href: '/sales/academy', icon: GraduationCap },
  { label: 'Settings', href: '/sales/settings', icon: Wrench },
];

const SalesNavigation: React.FC = () => {
  const { profile } = useAuth();

  return (
    <OSNavigation
      items={navItems}
      role="Sales OS"
      icon={Users}
      actions={
        <>
          <ThemeToggle />
          <UserProfile
            name={profile?.full_name || 'Sales Rep'}
            role="Sales Representative"
          />
        </>
      }
    />
  );
};

export default SalesNavigation;
