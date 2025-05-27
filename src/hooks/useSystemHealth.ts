
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { retellAIService } from '@/services/ai/retellAIService';
import { elevenLabsService } from '@/services/ai/elevenLabsService';

interface SystemHealthMetrics {
  apiHealth: 'healthy' | 'degraded' | 'down';
  databaseHealth: 'healthy' | 'degraded' | 'down';
  voiceSystemHealth: 'healthy' | 'degraded' | 'down';
  aiSystemHealth: 'healthy' | 'degraded' | 'down';
  retellAIHealth: 'healthy' | 'degraded' | 'down';
  elevenLabsHealth: 'healthy' | 'degraded' | 'down';
  lastChecked: Date;
  uptime: number;
  errorRate: number;
  responseTime: number;
}

export const useSystemHealth = () => {
  const [metrics, setMetrics] = useState<SystemHealthMetrics>({
    apiHealth: 'healthy',
    databaseHealth: 'healthy',
    voiceSystemHealth: 'healthy',
    aiSystemHealth: 'healthy',
    retellAIHealth: 'down',
    elevenLabsHealth: 'down',
    lastChecked: new Date(),
    uptime: 0,
    errorRate: 0,
    responseTime: 0
  });

  const [isChecking, setIsChecking] = useState(false);

  const checkSystemHealth = async () => {
    setIsChecking(true);
    const startTime = performance.now();

    try {
      // Check database health
      const dbStart = performance.now();
      const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
      const dbTime = performance.now() - dbStart;
      
      // Check AI system health
      const aiStart = performance.now();
      const { error: aiError } = await supabase.functions.invoke('ai-brain-query', {
        body: { query: 'health check', context: { workspace: 'health' } }
      });
      const aiTime = performance.now() - aiStart;

      // Check voice system capabilities
      const voiceSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
      const micSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

      // Check Retell AI health
      const retellHealthy = retellAIService.isServiceReady();

      // Check ElevenLabs health
      const elevenLabsHealthy = elevenLabsService.isServiceReady();

      const totalTime = performance.now() - startTime;

      setMetrics({
        apiHealth: 'healthy',
        databaseHealth: dbError ? 'down' : dbTime > 1000 ? 'degraded' : 'healthy',
        voiceSystemHealth: (!voiceSupported || !micSupported) ? 'down' : 'healthy',
        aiSystemHealth: aiError ? 'degraded' : aiTime > 5000 ? 'degraded' : 'healthy',
        retellAIHealth: retellHealthy ? 'healthy' : 'down',
        elevenLabsHealth: elevenLabsHealthy ? 'healthy' : 'down',
        lastChecked: new Date(),
        uptime: Date.now() - performance.timeOrigin,
        errorRate: 0, // Would calculate from recent error logs
        responseTime: totalTime
      });

      logger.info('System health check completed', {
        dbTime,
        aiTime,
        totalTime,
        voiceSupported,
        micSupported,
        retellHealthy,
        elevenLabsHealthy
      }, 'system_health');

    } catch (error) {
      logger.error('System health check failed', error, 'system_health');
      
      setMetrics(prev => ({
        ...prev,
        apiHealth: 'down',
        lastChecked: new Date(),
        responseTime: performance.now() - startTime
      }));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial health check
    checkSystemHealth();

    // Set up periodic health checks
    const interval = setInterval(checkSystemHealth, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const getOverallHealth = (): 'healthy' | 'degraded' | 'down' => {
    const { apiHealth, databaseHealth, aiSystemHealth } = metrics;
    
    if ([apiHealth, databaseHealth].includes('down')) {
      return 'down';
    }
    
    if ([apiHealth, databaseHealth, aiSystemHealth].includes('degraded')) {
      return 'degraded';
    }
    
    return 'healthy';
  };

  return {
    metrics,
    isChecking,
    checkSystemHealth,
    overallHealth: getOverallHealth()
  };
};
