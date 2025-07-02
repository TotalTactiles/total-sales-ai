import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import EnhancedSalesRepDashboard from './EnhancedSalesRepDashboard';
import { logger } from '@/utils/logger';

export default function SalesDashboardPage() {
  const { session, user, profile, loading } = useAuth();

  useEffect(() => {
    logger.info('🏠 Sales Dashboard mounted:', { 
      hasSession: !!session, 
      hasUser: !!user, 
      hasProfile: !!profile,
      role: profile?.role 
    }, 'dashboard');
  }, [session, user, profile]);

  if (loading) {
    logger.info('📱 Dashboard loading...', {}, 'dashboard');
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (!session || !user) {
    logger.warn('🚫 No session in dashboard, redirecting to auth', {}, 'dashboard');
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    logger.warn('🚫 No profile in dashboard, redirecting to auth', {}, 'dashboard');
    return <Navigate to="/auth" replace />;
  }

  try {
    logger.info('✅ Rendering sales dashboard', { role: profile.role }, 'dashboard');
    return <EnhancedSalesRepDashboard />;
  } catch (error) {
    logger.error('❌ Error rendering dashboard:', error, 'dashboard');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-destructive mb-4">Dashboard Error</h1>
          <p className="text-muted-foreground">Please refresh the page or contact support.</p>
        </div>
      </div>
    );
  }
}