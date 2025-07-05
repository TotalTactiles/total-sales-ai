
import { Role } from '@/contexts/auth/types';

export interface RouteConfig {
  path: string;
  label: string;
  icon: string;
  allowedRoles: Role[];
  isPublic?: boolean;
  component?: string;
}

export const OS_ROUTES = {
  // Developer OS Routes
  DEVELOPER: {
    BASE: '/developer',
    DASHBOARD: '/developer/dashboard',
    SYSTEM_MONITOR: '/developer/system-monitor',
    API_LOGS: '/developer/api-logs',
    AGENT_HEALTH: '/developer/agent-health',
    FEATURE_FLAGS: '/developer/feature-flags',
    TSAM_BRAIN: '/developer/tsam-brain',
    AI_INTEGRATION: '/developer/ai-integration',
    SYSTEM_UPDATES: '/developer/system-updates',
    ERROR_LOGS: '/developer/error-logs'
  },
  
  // Manager OS Routes
  MANAGER: {
    BASE: '/manager',
    DASHBOARD: '/manager/dashboard',
    BUSINESS_OPS: '/manager/business-ops',
    TEAM: '/manager/team',
    LEADS: '/manager/leads',
    AI_ASSISTANT: '/manager/ai',
    COMPANY_BRAIN: '/manager/company-brain',
    SECURITY: '/manager/security',
    REPORTS: '/manager/reports',
    SETTINGS: '/manager/settings'
  },
  
  // Sales OS Routes
  SALES: {
    BASE: '/sales',
    DASHBOARD: '/sales/dashboard',
    LEADS: '/sales/leads',
    AI_AGENT: '/sales/ai-agent',
    DIALER: '/sales/dialer',
    ANALYTICS: '/sales/analytics',
    ACADEMY: '/sales/academy',
    SETTINGS: '/sales/settings'
  }
} as const;

export const ROUTE_CONFIGS: Record<string, RouteConfig[]> = {
  developer: [
    { path: OS_ROUTES.DEVELOPER.DASHBOARD, label: 'Dashboard', icon: 'LayoutDashboard', allowedRoles: ['developer'] },
    { path: OS_ROUTES.DEVELOPER.TSAM_BRAIN, label: 'TSAM Brain', icon: 'Brain', allowedRoles: ['developer'] },
    { path: OS_ROUTES.DEVELOPER.SYSTEM_MONITOR, label: 'System Monitor', icon: 'Monitor', allowedRoles: ['developer'] },
    { path: OS_ROUTES.DEVELOPER.API_LOGS, label: 'API Logs', icon: 'FileText', allowedRoles: ['developer'] },
    { path: OS_ROUTES.DEVELOPER.FEATURE_FLAGS, label: 'Feature Flags', icon: 'Flag', allowedRoles: ['developer'] },
    { path: OS_ROUTES.DEVELOPER.SYSTEM_UPDATES, label: 'System Updates', icon: 'TrendingUp', allowedRoles: ['developer'] },
    { path: OS_ROUTES.DEVELOPER.AI_INTEGRATION, label: 'AI Integration', icon: 'Network', allowedRoles: ['developer'] },
    { path: OS_ROUTES.DEVELOPER.ERROR_LOGS, label: 'Error Debug', icon: 'AlertTriangle', allowedRoles: ['developer'] },
    { path: OS_ROUTES.DEVELOPER.AGENT_HEALTH, label: 'Agent Health', icon: 'Activity', allowedRoles: ['developer'] }
  ],
  
  manager: [
    { path: OS_ROUTES.MANAGER.DASHBOARD, label: 'Dashboard', icon: 'Grid3X3', allowedRoles: ['manager'] },
    { path: OS_ROUTES.MANAGER.BUSINESS_OPS, label: 'Business Ops', icon: 'Building2', allowedRoles: ['manager'] },
    { path: OS_ROUTES.MANAGER.TEAM, label: 'Team', icon: 'Users', allowedRoles: ['manager'] },
    { path: OS_ROUTES.MANAGER.LEADS, label: 'Leads', icon: 'Target', allowedRoles: ['manager'] },
    { path: OS_ROUTES.MANAGER.AI_ASSISTANT, label: 'AI Assistant', icon: 'Bot', allowedRoles: ['manager'] },
    { path: OS_ROUTES.MANAGER.COMPANY_BRAIN, label: 'Company Brain', icon: 'Brain', allowedRoles: ['manager'] },
    { path: OS_ROUTES.MANAGER.SECURITY, label: 'Security', icon: 'Shield', allowedRoles: ['manager'] },
    { path: OS_ROUTES.MANAGER.REPORTS, label: 'Reports', icon: 'BarChart3', allowedRoles: ['manager'] },
    { path: OS_ROUTES.MANAGER.SETTINGS, label: 'Settings', icon: 'Settings', allowedRoles: ['manager'] }
  ],
  
  sales: [
    { path: OS_ROUTES.SALES.DASHBOARD, label: 'Dashboard', icon: 'Grid3X3', allowedRoles: ['sales_rep'] },
    { path: OS_ROUTES.SALES.LEADS, label: 'Lead Management', icon: 'Users', allowedRoles: ['sales_rep'] },
    { path: OS_ROUTES.SALES.AI_AGENT, label: 'AI Agent', icon: 'Bot', allowedRoles: ['sales_rep'] },
    { path: OS_ROUTES.SALES.DIALER, label: 'Dialer', icon: 'Phone', allowedRoles: ['sales_rep'] },
    { path: OS_ROUTES.SALES.ANALYTICS, label: 'Analytics', icon: 'BarChart3', allowedRoles: ['sales_rep'] },
    { path: OS_ROUTES.SALES.ACADEMY, label: 'Academy', icon: 'GraduationCap', allowedRoles: ['sales_rep'] },
    { path: OS_ROUTES.SALES.SETTINGS, label: 'Settings', icon: 'Settings', allowedRoles: ['sales_rep'] }
  ]
};

export const getDashboardRoute = (role: Role): string => {
  switch (role) {
    case 'manager':
      return OS_ROUTES.MANAGER.DASHBOARD;
    case 'developer':
    case 'admin':
      return OS_ROUTES.DEVELOPER.DASHBOARD;
    case 'sales_rep':
    default:
      return OS_ROUTES.SALES.DASHBOARD;
  }
};

export const getRoutesForRole = (role: Role): RouteConfig[] => {
  switch (role) {
    case 'manager':
      return ROUTE_CONFIGS.manager;
    case 'developer':
    case 'admin':
      return ROUTE_CONFIGS.developer;
    case 'sales_rep':
    default:
      return ROUTE_CONFIGS.sales;
  }
};

export const getOSTheme = (role: Role): string => {
  switch (role) {
    case 'developer':
      return 'dark';
    case 'manager':
      return 'manager';
    case 'sales_rep':
      return 'sales';
    default:
      return 'light';
  }
};
