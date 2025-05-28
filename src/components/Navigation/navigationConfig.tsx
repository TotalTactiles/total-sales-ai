
import React from 'react';
import { 
  BarChart3, 
  Users, 
  Brain, 
  Phone, 
  Settings, 
  FileText,
  Grid,
  TrendingUp,
  Bot,
  Target
} from 'lucide-react';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
  description?: string;
}

export const createNavItems = (getDashboardUrl: () => string, profile: any): NavItem[] => {
  const items: NavItem[] = [
    {
      icon: <Grid className="h-5 w-5" />,
      label: 'Dashboard',
      href: getDashboardUrl(),
      description: 'Overview and key metrics'
    }
  ];

  // Add role-specific analytics
  if (profile?.role === 'sales_rep' || profile?.role === 'admin' || profile?.role === 'developer') {
    items.push({
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Analytics',
      href: '/sales/analytics',
      description: 'Personal performance insights'
    });
  }

  if (profile?.role === 'manager' || profile?.role === 'admin' || profile?.role === 'developer') {
    items.push({
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Manager Analytics',
      href: '/manager/analytics',
      description: 'Executive command center'
    });
  }

  // Add common items
  items.push(
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Leads',
      href: getDashboardUrl().replace('/dashboard', '/leads'),
      badge: '24',
      description: 'Lead management and tracking'
    },
    {
      icon: <Brain className="h-5 w-5" />,
      label: 'Company Brain',
      href: getDashboardUrl().replace('/dashboard', '/academy'),
      description: 'Knowledge base and AI insights'
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Dialer',
      href: getDashboardUrl().replace('/dashboard', '/dialer'),
      description: 'Auto-dialer and call management'
    },
    {
      icon: <Bot className="h-5 w-5" />,
      label: 'AI Agent',
      href: getDashboardUrl().replace('/dashboard', '/ai'),
      description: 'AI-powered calling assistant'
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Reports',
      href: getDashboardUrl().replace('/dashboard', '/reports'),
      description: 'Detailed reports and analytics'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      href: getDashboardUrl().replace('/dashboard', '/settings'),
      description: 'Account and system settings'
    }
  );

  return items;
};
