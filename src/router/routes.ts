
import { Role } from '@/contexts/auth/types';

export interface RouteConfig {
  path: string;
  label: string;
  icon: string;
}

export const ROUTE_CONFIGS = {
  developer: [
    { path: '/developer/dashboard', label: 'Dashboard', icon: 'Grid3X3' },
    { path: '/developer/system', label: 'System', icon: 'Settings' },
    { path: '/developer/users', label: 'Users', icon: 'UserCog' },
    { path: '/developer/ai-monitor', label: 'AI Monitor', icon: 'Activity' },
  ],
  manager: [
    { path: '/manager/dashboard', label: 'Dashboard', icon: 'Grid3X3' },
    { path: '/manager/team', label: 'Team', icon: 'Users' },
    { path: '/manager/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/manager/leads', label: 'Leads', icon: 'Target' },
  ],
  sales_rep: [
    { path: '/sales/dashboard', label: 'Dashboard', icon: 'Grid3X3' },
    { path: '/sales/leads', label: 'Leads', icon: 'Users' },
    { path: '/sales/dialer', label: 'Dialer', icon: 'Phone' },
    { path: '/sales/analytics', label: 'Analytics', icon: 'BarChart3' },
  ]
};

export const getOSTheme = (role: Role): 'dark' | 'manager' | 'sales' => {
  switch (role) {
    case 'developer':
    case 'admin':
      return 'dark';
    case 'manager':
      return 'manager';
    case 'sales_rep':
    default:
      return 'sales';
  }
};

export const getDashboardRoute = (role: Role): string => {
  switch (role) {
    case 'developer':
    case 'admin':
      return '/developer/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'sales_rep':
    default:
      return '/sales/dashboard';
  }
};
