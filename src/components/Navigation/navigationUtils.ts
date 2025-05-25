
import { Role } from '@/contexts/auth/types';

export const getDashboardUrl = (profile: { role: Role } | null) => {
  const userStatus = localStorage.getItem('userStatus');
  const demoRole = localStorage.getItem('demoRole');
  
  // Handle demo mode
  if (userStatus === 'demo' && demoRole) {
    switch (demoRole) {
      case 'manager':
        return '/manager-dashboard';
      case 'admin':
        return '/admin-dashboard';
      case 'sales-rep':
      default:
        return '/';
    }
  }
  
  // Handle authenticated users based on profile role
  const role = profile?.role || 'sales_rep';
  switch (role) {
    case 'manager':
      return '/manager-dashboard';
    case 'admin':
      return '/admin-dashboard';
    case 'sales_rep':
    default:
      return '/';
  }
};

export const updateActiveItem = (pathname: string, setActiveItem: (item: string) => void) => {
  if (pathname === '/' || pathname.includes('sales-rep-dashboard')) {
    setActiveItem('dashboard');
  } else if (pathname.includes('manager-dashboard')) {
    setActiveItem('dashboard');
  } else if (pathname.includes('admin-dashboard')) {
    setActiveItem('dashboard');
  } else if (pathname === '/dialer') {
    setActiveItem('dialer');
  } else if (pathname === '/leads' || pathname.startsWith('/leads/')) {
    setActiveItem('leads');
  } else if (pathname === '/analytics') {
    setActiveItem('analytics');
  } else if (pathname === '/agent-missions') {
    setActiveItem('agent-missions');
  } else if (pathname === '/company-brain') {
    setActiveItem('company-brain');
  } else if (pathname === '/tools') {
    setActiveItem('tools');
  } else if (pathname === '/reports') {
    setActiveItem('reports');
  } else if (pathname === '/access') {
    setActiveItem('access');
  } else if (pathname === '/settings') {
    setActiveItem('settings');
  } else if (pathname === '/ai-agent') {
    setActiveItem('ai-agent');
  } else {
    // Default to dashboard for unknown routes
    setActiveItem('dashboard');
  }
};
