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
