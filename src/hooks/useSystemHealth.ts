
import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface ProviderMetric {
  endpoint: string;
  statusCode: number;
  latencyMs: number;
}

interface SystemMetrics {
  aiSystemHealth: 'healthy' | 'degraded' | 'down';
  databaseHealth: 'healthy' | 'degraded' | 'down';
  voiceSystemHealth: 'healthy' | 'degraded' | 'down';
  apiHealth: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  errorCount: number;
  activeUsers: number;
  providerMetrics: ProviderMetric[];
  lastChecked: Date;
}

export const useSystemHealth = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    aiSystemHealth: 'healthy',
    databaseHealth: 'healthy',
    voiceSystemHealth: 'healthy',
    apiHealth: 'healthy',
    responseTime: 45,
    errorCount: 2,
    activeUsers: 23,
    providerMetrics: [
      { endpoint: 'Claude API', statusCode: 200, latencyMs: 120 },
      { endpoint: 'OpenAI API', statusCode: 200, latencyMs: 95 },
      { endpoint: 'Retell AI', statusCode: 200, latencyMs: 180 }
    ],
    lastChecked: new Date()
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
        apiHealth: Math.random() > 0.1 ? 'healthy' : 'degraded',
        responseTime: Math.floor(Math.random() * 100) + 20,
        errorCount: Math.floor(Math.random() * 10),
        activeUsers: Math.floor(Math.random() * 50) + 10,
        providerMetrics: [
          { endpoint: 'Claude API', statusCode: Math.random() > 0.1 ? 200 : 500, latencyMs: Math.floor(Math.random() * 200) + 50 },
          { endpoint: 'OpenAI API', statusCode: Math.random() > 0.1 ? 200 : 500, latencyMs: Math.floor(Math.random() * 200) + 50 },
          { endpoint: 'Retell AI', statusCode: Math.random() > 0.1 ? 200 : 500, latencyMs: Math.floor(Math.random() * 200) + 50 }
        ],
        lastChecked: new Date()
      };
      
      setMetrics(newMetrics);
      
      // Determine overall health
      const healthStates = [
        newMetrics.aiSystemHealth,
        newMetrics.databaseHealth,
        newMetrics.voiceSystemHealth,
        newMetrics.apiHealth
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
