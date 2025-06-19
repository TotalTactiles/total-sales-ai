
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

const Index: React.FC = () => {
  const { user, profile, loading, isDemoMode } = useAuth();

  // Show loading while checking auth state
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
    const demoRole = localStorage.getItem('demoRole');
    logger.info('Demo mode active, redirecting to role dashboard:', demoRole);
    
    switch (demoRole) {
      case 'developer':
        return <Navigate to="/developer/dashboard" replace />;
      case 'manager':
        return <Navigate to="/manager/dashboard" replace />;
      case 'sales_rep':
        return <Navigate to="/sales/dashboard" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  // Handle authenticated users
  if (user && profile) {
    logger.info('Authenticated user, redirecting to role dashboard:', profile.role);
    
    switch (profile.role) {
      case 'developer':
      case 'admin':
        return <Navigate to="/developer/dashboard" replace />;
      case 'manager':
        return <Navigate to="/manager/dashboard" replace />;
      case 'sales_rep':
        return <Navigate to="/sales/dashboard" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  // No auth, redirect to auth page
  logger.info('No authenticated user, redirecting to auth');
  return <Navigate to="/auth" replace />;
};

export default Index;
