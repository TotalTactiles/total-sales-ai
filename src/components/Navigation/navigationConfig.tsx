
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
  Target,
  GraduationCap
} from 'lucide-react';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
  description?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType;
  description?: string;
}

export const createNavItems = (getDashboardUrl: () => string): NavItem[] => [
  {
    icon: <Grid className="h-5 w-5" />,
    label: 'Dashboard',
    href: getDashboardUrl(),
    description: 'Overview and key metrics'
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: 'Leads',
    href: '/leads',
    badge: '24',
    description: 'Lead management and tracking'
  },
  {
    icon: <Bot className="h-5 w-5" />,
    label: 'AI Agent',
    href: '/ai-agent',
    description: 'AI-powered calling assistant'
  },
  {
    icon: <Phone className="h-5 w-5" />,
    label: 'Dialer',
    href: '/dialer',
    description: 'Auto-dialer and call management'
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    label: 'Analytics',
    href: '/analytics',
    description: 'Performance insights and reports'
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    label: 'Manager Analytics',
    href: '/manager-analytics',
    description: 'Executive command center'
  },
  {
    icon: <Brain className="h-5 w-5" />,
    label: 'Company Brain',
    href: '/company-brain',
    description: 'Knowledge base and AI insights'
  },
  {
    icon: <GraduationCap className="h-5 w-5" />,
    label: 'Academy',
    href: '/academy',
    description: 'Training and learning resources'
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: 'Reports',
    href: '/reports',
    description: 'Detailed reports and analytics'
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: 'Settings',
    href: '/settings',
    description: 'Account and system settings'
  }
];

export const getDeveloperNavigation = (): NavigationItem[] => [
  {
    name: 'Relevance AI Monitor',
    href: '/developer/relevance-ai',
    icon: Bot,
    description: 'Monitor Relevance AI agent health and task execution'
  }
];
