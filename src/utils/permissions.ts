
import { Role } from '@/contexts/auth/types';

export const PERMISSIONS = {
  // Developer permissions
  SYSTEM_MONITOR: ['developer', 'admin'],
  API_LOGS: ['developer', 'admin'],
  FEATURE_FLAGS: ['developer', 'admin'],
  AGENT_HEALTH: ['developer', 'admin'],
  
  // Manager permissions
  TEAM_MANAGEMENT: ['manager', 'admin'],
  BUSINESS_OPS: ['manager', 'admin'],
  REPORTS: ['manager', 'admin'],
  
  // Sales permissions
  LEAD_MANAGEMENT: ['sales_rep', 'manager', 'admin'],
  DIALER: ['sales_rep', 'manager', 'admin'],
  
  // Shared permissions
  DASHBOARD: ['developer', 'manager', 'sales_rep', 'admin'],
  SETTINGS: ['developer', 'manager', 'sales_rep', 'admin']
} as const;

export const hasPermission = (userRole: Role, permission: keyof typeof PERMISSIONS): boolean => {
  return PERMISSIONS[permission].includes(userRole);
};

export const canAccessRoute = (userRole: Role, routePath: string): boolean => {
  // Route-based permission checking
  if (routePath.startsWith('/developer')) {
    return ['developer', 'admin'].includes(userRole);
  }
  
  if (routePath.startsWith('/manager')) {
    return ['manager', 'admin'].includes(userRole);
  }
  
  if (routePath.startsWith('/sales')) {
    return ['sales_rep', 'manager', 'admin'].includes(userRole);
  }
  
  return true; // Public routes
};
