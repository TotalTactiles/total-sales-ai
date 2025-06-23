
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppState } from '@/hooks/useAppState';
import SalesRepOS from './SalesRepOS';
import ManagerOS from './ManagerOS';
import DeveloperOS from './DeveloperOS';
import NavigationFallback from '@/components/Navigation/NavigationFallback';
import EnhancedErrorBoundary from '@/components/ErrorBoundary/EnhancedErrorBoundary';
import UnifiedAIAssistant from '@/components/AI/UnifiedAIAssistant';
import { logger } from '@/utils/logger';
import { useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const { setError } = useAppState();
  const location = useLocation();

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

  // Handle authenticated users
  if (user && profile) {
    logger.info('Authenticated user with role:', profile.role);
    
    try {
      const getAIContext = () => ({
        workspace: location.pathname.split('/')[1] || 'dashboard',
        userRole: profile.role,
        userId: user.id,
        companyId: profile.company_id
      });

      switch (profile.role) {
        case 'manager':
          return (
            <EnhancedErrorBoundary>
              <ManagerOS />
              <UnifiedAIAssistant context={getAIContext()} />
            </EnhancedErrorBoundary>
          );
        case 'sales_rep':
          return (
            <EnhancedErrorBoundary>
              <SalesRepOS />
              <UnifiedAIAssistant context={getAIContext()} />
            </EnhancedErrorBoundary>
          );
        case 'developer':
        case 'admin':
          return (
            <EnhancedErrorBoundary>
              <DeveloperOS />
              <UnifiedAIAssistant context={getAIContext()} />
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
