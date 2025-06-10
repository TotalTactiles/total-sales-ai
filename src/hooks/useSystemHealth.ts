
import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface SystemMetrics {
  aiSystemHealth: 'healthy' | 'degraded' | 'down';
  databaseHealth: 'healthy' | 'degraded' | 'down';
  voiceSystemHealth: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  errorCount: number;
  activeUsers: number;
}

export const useSystemHealth = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    aiSystemHealth: 'healthy',
    databaseHealth: 'healthy',
    voiceSystemHealth: 'healthy',
    responseTime: 45,
    errorCount: 2,
    activeUsers: 23
  });
  const [isChecking, setIsChecking] = useState(false);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'degraded' | 'down'>('healthy');

  const checkSystemHealth = useCallback(async () => {
    setIsChecking(true);
    
    try {
      logger.info('Starting system health check');
      
      // Simulate health checks
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newMetrics: SystemMetrics = {
        aiSystemHealth: Math.random() > 0.1 ? 'healthy' : 'degraded',
        databaseHealth: Math.random() > 0.05 ? 'healthy' : 'degraded',
        voiceSystemHealth: Math.random() > 0.15 ? 'healthy' : 'degraded',
        responseTime: Math.floor(Math.random() * 100) + 20,
        errorCount: Math.floor(Math.random() * 10),
        activeUsers: Math.floor(Math.random() * 50) + 10
      };
      
      setMetrics(newMetrics);
      
      // Determine overall health
      const healthStates = [
        newMetrics.aiSystemHealth,
        newMetrics.databaseHealth,
        newMetrics.voiceSystemHealth
      ];
      
      if (healthStates.includes('down')) {
        setOverallHealth('down');
      } else if (healthStates.includes('degraded')) {
        setOverallHealth('degraded');
      } else {
        setOverallHealth('healthy');
      }
      
      logger.info('System health check completed', newMetrics);
      
    } catch (error) {
      logger.error('System health check failed:', error);
      setOverallHealth('down');
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    metrics,
    isChecking,
    checkSystemHealth,
    overallHealth
  };
};
