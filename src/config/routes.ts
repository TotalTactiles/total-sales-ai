
import { Role } from '@/contexts/auth/types';

export interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
  allowedRoles: Role[];
  isPublic?: boolean;
}

export const ROUTES = {
  // Public routes
  AUTH: '/auth',
  LANDING: '/',
  
  // Sales Rep routes
  SALES_DASHBOARD: '/sales/dashboard',
  SALES_LEADS: '/sales/leads',
  SALES_LEAD_WORKSPACE: '/sales/leads/:leadId',
  SALES_DIALER: '/sales/dialer',
  SALES_BRAIN: '/sales/brain',
  
  // Manager routes
  MANAGER_DASHBOARD: '/manager/dashboard',
  MANAGER_TEAM: '/manager/team',
  MANAGER_ANALYTICS: '/manager/analytics',
  MANAGER_LEADS: '/manager/leads',
  MANAGER_LEAD_WORKSPACE: '/manager/leads/:leadId',
  
  // Developer routes
  DEVELOPER_DASHBOARD: '/developer/dashboard',
  DEVELOPER_AGENTS: '/developer/agents',
  DEVELOPER_AI_MONITOR: '/developer/ai-monitor',
  DEVELOPER_USERS: '/developer/users',
  DEVELOPER_SYSTEM: '/developer/system',
  
  // Shared routes
  LEAD_WORKSPACE: '/lead-workspace/:leadId',
  SETTINGS: '/settings'
} as const;

export const ROUTE_CONFIGS: RouteConfig[] = [
  // Sales Rep routes
  {
    path: ROUTES.SALES_DASHBOARD,
    label: 'Dashboard',
    icon: 'Grid3X3',
    allowedRoles: ['sales_rep']
  },
  {
    path: ROUTES.SALES_LEADS,
    label: 'Leads',
    icon: 'Users',
    allowedRoles: ['sales_rep']
  },
  {
    path: ROUTES.SALES_DIALER,
    label: 'Dialer',
    icon: 'Phone',
    allowedRoles: ['sales_rep']
  },
  {
    path: ROUTES.SALES_BRAIN,
    label: 'Company Brain',
    icon: 'Brain',
    allowedRoles: ['sales_rep']
  },
  
  // Manager routes
  {
    path: ROUTES.MANAGER_DASHBOARD,
    label: 'Dashboard',
    icon: 'Grid3X3',
    allowedRoles: ['manager']
  },
  {
    path: ROUTES.MANAGER_TEAM,
    label: 'Team',
    icon: 'Users',
    allowedRoles: ['manager']
  },
  {
    path: ROUTES.MANAGER_ANALYTICS,
    label: 'Analytics',
    icon: 'BarChart3',
    allowedRoles: ['manager']
  },
  {
    path: ROUTES.MANAGER_LEADS,
    label: 'Leads',
    icon: 'Target',
    allowedRoles: ['manager']
  },
  
  // Developer routes
  {
    path: ROUTES.DEVELOPER_DASHBOARD,
    label: 'Dashboard',
    icon: 'Grid3X3',
    allowedRoles: ['developer', 'admin']
  },
  {
    path: ROUTES.DEVELOPER_AGENTS,
    label: 'AI Agents',
    icon: 'Bot',
    allowedRoles: ['developer', 'admin']
  },
  {
    path: ROUTES.DEVELOPER_AI_MONITOR,
    label: 'AI Monitor',
    icon: 'Activity',
    allowedRoles: ['developer', 'admin']
  },
  {
    path: ROUTES.DEVELOPER_USERS,
    label: 'Users',
    icon: 'UserCog',
    allowedRoles: ['developer', 'admin']
  },
  {
    path: ROUTES.DEVELOPER_SYSTEM,
    label: 'System',
    icon: 'Settings',
    allowedRoles: ['developer', 'admin']
  }
];

export const getDashboardRoute = (role: Role): string => {
  switch (role) {
    case 'manager':
      return ROUTES.MANAGER_DASHBOARD;
    case 'developer':
    case 'admin':
      return ROUTES.DEVELOPER_DASHBOARD;
    case 'sales_rep':
    default:
      return ROUTES.SALES_DASHBOARD;
  }
};

export const getRoutesForRole = (role: Role): RouteConfig[] => {
  return ROUTE_CONFIGS.filter(route => route.allowedRoles.includes(role));
};
