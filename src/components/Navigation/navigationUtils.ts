
import { Profile, Role } from '@/contexts/auth/types';

export const getDashboardUrl = (
  profileOrRole: Profile | { role: Role } | null
): string => {
  if (!profileOrRole) return '/sales/dashboard';

  const role = profileOrRole.role;
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'developer':
      return '/developer/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'sales_rep':
    default:
      return '/sales/dashboard';
  }
};

export const updateActiveItem = (pathname: string, setActiveItem: (item: string) => void) => {
  if (pathname === '/' || pathname.includes('dashboard')) {
    setActiveItem('dashboard');
  } else if (pathname === '/analytics') {
    setActiveItem('analytics');
  } else if (pathname === '/manager-analytics') {
    setActiveItem('manager-analytics');
  } else if (pathname.includes('leads')) {
    setActiveItem('leads');
  } else if (pathname.includes('company-brain')) {
    setActiveItem('company-brain');
  } else if (pathname.includes('dialer')) {
    setActiveItem('dialer');
  } else if (pathname.includes('ai-agent')) {
    setActiveItem('ai-agent');
  } else if (pathname.includes('reports')) {
    setActiveItem('reports');
  } else if (pathname.includes('settings')) {
    setActiveItem('settings');
  }
};

export const shouldShowNavItem = (href: string, profile: Profile | null): boolean => {
  // Manager Analytics is only for managers and admins
  if (href === '/manager-analytics') {
    return profile?.role === 'manager' || profile?.role === 'admin';
  }
  
  // All other items are visible to everyone
  return true;
};
