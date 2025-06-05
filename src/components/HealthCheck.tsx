
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface HealthStatus {
  auth: boolean;
  database: boolean;
  routing: boolean;
  timestamp: Date;
}

const HealthCheck: React.FC = () => {
  const { user, loading } = useAuth();
  const [health, setHealth] = useState<HealthStatus>({
    auth: false,
    database: false,
    routing: true, // Assume routing works if component renders
    timestamp: new Date()
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Check authentication
        const authHealthy = !loading && (!!user || window.location.pathname.includes('/auth'));
        
        // Check database connectivity
        let dbHealthy = false;
        try {
          const { error } = await supabase.from('profiles').select('id').limit(1);
          dbHealthy = !error;
        } catch (dbError) {
          logger.warn('Database health check failed:', dbError);
        }

        setHealth({
          auth: authHealthy,
          database: dbHealthy,
          routing: true,
          timestamp: new Date()
        });

        logger.info('Health check completed:', {
          auth: authHealthy,
          database: dbHealthy,
          user: !!user,
          loading,
          pathname: window.location.pathname
        });
      } catch (error) {
        logger.error('Health check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkHealth();
  }, [user, loading]);

  // Only show if there are issues or in development
  const hasIssues = !health.auth || !health.database;
  const showHealthCheck = process.env.NODE_ENV === 'development' || hasIssues;

  if (!showHealthCheck || isChecking) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border rounded-lg shadow-lg p-3 text-xs">
      <div className="font-semibold mb-2">System Health</div>
      <div className="space-y-1">
        <div className={`flex items-center gap-2 ${health.auth ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-2 h-2 rounded-full ${health.auth ? 'bg-green-500' : 'bg-red-500'}`}></div>
          Auth: {health.auth ? 'OK' : 'Issue'}
        </div>
        <div className={`flex items-center gap-2 ${health.database ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-2 h-2 rounded-full ${health.database ? 'bg-green-500' : 'bg-red-500'}`}></div>
          DB: {health.database ? 'OK' : 'Issue'}
        </div>
        <div className={`flex items-center gap-2 ${health.routing ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-2 h-2 rounded-full ${health.routing ? 'bg-green-500' : 'bg-red-500'}`}></div>
          Route: {health.routing ? 'OK' : 'Issue'}
        </div>
      </div>
      <div className="text-gray-500 mt-2">
        {health.timestamp.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default HealthCheck;
