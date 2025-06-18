
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SalesRepOS from './SalesRepOS';
import ManagerOS from './ManagerOS';
import DeveloperOS from './DeveloperOS';
import NavigationFallback from '@/components/Navigation/NavigationFallback';
import ErrorBoundary from '@/components/auth/ErrorBoundary';
import { logger } from '@/utils/logger';

const MainLayout: React.FC = () => {
  const { user, profile, loading, isDemoMode } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle demo mode
  if (isDemoMode()) {
    const demoRole = localStorage.getItem('demoRole') as 'manager' | 'sales_rep' | 'developer' | null;
    logger.info('Demo mode active with role:', demoRole);
    
    switch (demoRole) {
      case 'manager':
        return (
          <ErrorBoundary>
            <ManagerOS />
          </ErrorBoundary>
        );
      case 'sales_rep':
        return (
          <ErrorBoundary>
            <SalesRepOS />
          </ErrorBoundary>
        );
      case 'developer':
        return (
          <ErrorBoundary>
            <DeveloperOS />
          </ErrorBoundary>
        );
      default:
        return <NavigationFallback />;
    }
  }

  // Handle authenticated users
  if (user && profile) {
    logger.info('Authenticated user with role:', profile.role);
    
    switch (profile.role) {
      case 'manager':
        return (
          <ErrorBoundary>
            <ManagerOS />
          </ErrorBoundary>
        );
      case 'sales_rep':
        return (
          <ErrorBoundary>
            <SalesRepOS />
          </ErrorBoundary>
        );
      case 'developer':
      case 'admin':
        return (
          <ErrorBoundary>
            <DeveloperOS />
          </ErrorBoundary>
        );
      default:
        logger.warn('Unknown user role:', profile.role);
        return <NavigationFallback />;
    }
  }

  // Fallback for edge cases
  logger.warn('MainLayout fallback triggered', { user: !!user, profile: !!profile });
  return <NavigationFallback />;
};

export default MainLayout;
