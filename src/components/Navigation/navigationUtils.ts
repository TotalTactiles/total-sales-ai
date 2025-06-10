
import { Profile, Role } from '@/contexts/auth/types';

export const getDashboardUrl = (profile?: Profile | { role: Role } | null): string => {
  if (!profile?.role) {
    return '/sales/dashboard'; // Default fallback
  }

  switch (profile.role) {
    case 'developer':
      return '/developer/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'sales_rep':
      return '/sales/dashboard';
    default:
      return '/sales/dashboard';
  }
};

export const updateActiveItem = (pathname: string, setActiveItem: (item: string) => void) => {
  if (pathname.includes('/dashboard')) {
    setActiveItem('dashboard');
  } else if (pathname.includes('/lead')) {
    setActiveItem('leads');
  } else if (pathname.includes('/dialer')) {
    setActiveItem('dialer');
  } else if (pathname.includes('/brain')) {
    setActiveItem('brain');
  } else if (pathname.includes('/analytics')) {
    setActiveItem('analytics');
  } else if (pathname.includes('/settings')) {
    setActiveItem('settings');
  } else if (pathname.includes('/system-monitor')) {
    setActiveItem('system-monitor');
  } else if (pathname.includes('/ai-brain-logs')) {
    setActiveItem('ai-brain-logs');
  } else if (pathname.includes('/api-logs')) {
    setActiveItem('api-logs');
  } else if (pathname.includes('/error-logs')) {
    setActiveItem('error-logs');
  } else if (pathname.includes('/qa-checklist')) {
    setActiveItem('qa-checklist');
  } else if (pathname.includes('/testing-sandbox')) {
    setActiveItem('testing-sandbox');
  } else if (pathname.includes('/version-control')) {
    setActiveItem('version-control');
  } else if (pathname.includes('/crm-integrations')) {
    setActiveItem('crm-integrations');
  } else {
    setActiveItem('dashboard');
  }
};
