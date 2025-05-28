
import { Profile } from '@/contexts/auth/types';

export const getDashboardUrl = (profile: Profile | null): string => {
  if (!profile) return '/sales/dashboard';
  
  switch (profile.role) {
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

export const updateActiveItem = (pathname: string, setActiveItem: (item: string) => void) => {
  if (pathname === '/' || pathname.includes('dashboard')) {
    setActiveItem('dashboard');
  } else if (pathname.includes('analytics')) {
    setActiveItem('analytics');
  } else if (pathname.includes('manager-analytics')) {
    setActiveItem('manager-analytics');
  } else if (pathname.includes('leads')) {
    setActiveItem('leads');
  } else if (pathname.includes('company-brain') || pathname.includes('academy')) {
    setActiveItem('company-brain');
  } else if (pathname.includes('dialer')) {
    setActiveItem('dialer');
  } else if (pathname.includes('ai-agent') || pathname.includes('/ai')) {
    setActiveItem('ai-agent');
  } else if (pathname.includes('reports')) {
    setActiveItem('reports');
  } else if (pathname.includes('settings')) {
    setActiveItem('settings');
  }
};

export const shouldShowNavItem = (href: string, profile: Profile | null): boolean => {
  // Manager Analytics is only for managers and admins
  if (href === '/manager-analytics' || href === '/manager/analytics') {
    return profile?.role === 'manager' || profile?.role === 'admin';
  }
  
  // All other items are visible to everyone
  return true;
};
