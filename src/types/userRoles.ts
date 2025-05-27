
export type UserRole = 'developer' | 'manager' | 'sales_rep' | 'admin';

export interface UserPermissions {
  canAccessDeveloperOS: boolean;
  canAccessManagerOS: boolean;
  canAccessSalesRepOS: boolean;
  canViewSystemLogs: boolean;
  canManageUsers: boolean;
  canAccessSandbox: boolean;
}

export const getRolePermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case 'admin':
      return {
        canAccessDeveloperOS: true,
        canAccessManagerOS: true,
        canAccessSalesRepOS: true,
        canViewSystemLogs: true,
        canManageUsers: true,
        canAccessSandbox: true
      };
    case 'developer':
      return {
        canAccessDeveloperOS: true,
        canAccessManagerOS: false,
        canAccessSalesRepOS: false,
        canViewSystemLogs: true,
        canManageUsers: true,
        canAccessSandbox: true
      };
    case 'manager':
      return {
        canAccessDeveloperOS: false,
        canAccessManagerOS: true,
        canAccessSalesRepOS: false,
        canViewSystemLogs: false,
        canManageUsers: false,
        canAccessSandbox: false
      };
    case 'sales_rep':
      return {
        canAccessDeveloperOS: false,
        canAccessManagerOS: false,
        canAccessSalesRepOS: true,
        canViewSystemLogs: false,
        canManageUsers: false,
        canAccessSandbox: false
      };
  }
};
