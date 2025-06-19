
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppState } from '@/hooks/useAppState';
import SalesRepOS from './SalesRepOS';
import ManagerOS from './ManagerOS';
import DeveloperOS from './DeveloperOS';
import NavigationFallback from '@/components/Navigation/NavigationFallback';
import EnhancedErrorBoundary from '@/components/ErrorBoundary/EnhancedErrorBoundary';
import { logger } from '@/utils/logger';

const MainLayout: React.FC = () => {
  const { user, profile, loading, isDemoMode } = useAuth();
  const { setError } = useAppState();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle demo mode
  if (isDemoMode()) {
    const demoRole = localStorage.getItem('demoRole') as 'manager' | 'sales_rep' | 'developer' | null;
    logger.info('Demo mode active with role:', demoRole);
    
    try {
      switch (demoRole) {
        case 'manager':
          return (
            <EnhancedErrorBoundary>
              <ManagerOS />
            </EnhancedErrorBoundary>
          );
        case 'sales_rep':
          return (
            <EnhancedErrorBoundary>
              <SalesRepOS />
            </EnhancedErrorBoundary>
          );
        case 'developer':
          return (
            <EnhancedErrorBoundary>
              <DeveloperOS />
            </EnhancedErrorBoundary>
          );
        default:
          return <NavigationFallback />;
      }
    } catch (error) {
      logger.error('Error in demo mode layout:', error);
      return <NavigationFallback />;
    }
  }

  // Handle authenticated users
  if (user && profile) {
    logger.info('Authenticated user with role:', profile.role);
    
    try {
      switch (profile.role) {
        case 'manager':
          return (
            <EnhancedErrorBoundary>
              <ManagerOS />
            </EnhancedErrorBoundary>
          );
        case 'sales_rep':
          return (
            <EnhancedErrorBoundary>
              <SalesRepOS />
            </EnhancedErrorBoundary>
          );
        case 'developer':
        case 'admin':
          return (
            <EnhancedErrorBoundary>
              <DeveloperOS />
            </EnhancedErrorBoundary>
          );
        default:
          logger.warn('Unknown user role:', profile.role);
          return <NavigationFallback />;
      }
    } catch (error) {
      logger.error('Error in authenticated layout:', error);
      setError('Failed to load dashboard');
      return <NavigationFallback />;
    }
  }

  // Fallback for edge cases
  logger.warn('MainLayout fallback triggered', { user: !!user, profile: !!profile });
  return <NavigationFallback />;
};

export default MainLayout;
