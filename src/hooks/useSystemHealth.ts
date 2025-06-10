
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { retellAIService } from '@/services/ai/retellAIService';
import { elevenLabsService } from '@/services/ai/elevenLabsService';

interface ProviderMetric {
  endpoint: string;
  statusCode: number;
  latencyMs: number;
}

interface SystemHealthMetrics {
  apiHealth: 'healthy' | 'degraded' | 'down';
  databaseHealth: 'healthy' | 'degraded' | 'down';
  voiceSystemHealth: 'healthy' | 'degraded' | 'down';
  aiSystemHealth: 'healthy' | 'degraded' | 'down';
  retellAIHealth: 'healthy' | 'degraded' | 'down';
  elevenLabsHealth: 'healthy' | 'degraded' | 'down';
  authHealth: 'healthy' | 'degraded' | 'down';
  lastChecked: Date;
  uptime: number;
  errorRate: number;
  responseTime: number;
  providerMetrics: ProviderMetric[];
}

export const useSystemHealth = () => {
  const [metrics, setMetrics] = useState<SystemHealthMetrics>({
    apiHealth: 'healthy',
    databaseHealth: 'healthy',
    voiceSystemHealth: 'healthy',
    aiSystemHealth: 'healthy',
    retellAIHealth: 'down',
    elevenLabsHealth: 'down',
    authHealth: 'down',
    lastChecked: new Date(),
    uptime: 0,
    errorRate: 0,
    responseTime: 0,
    providerMetrics: []
  });

  const [isChecking, setIsChecking] = useState(false);

  const checkSystemHealth = async () => {
    setIsChecking(true);
    const startTime = performance.now();

    try {
      const providerMetrics: ProviderMetric[] = [];
      const { data: authData, error: authError } = await (async () => {
        const t0 = performance.now();
        const result = await supabase.auth.getUser();
        providerMetrics.push({
          endpoint: 'auth',
          statusCode: result.error ? 500 : 200,
          latencyMs: performance.now() - t0
        });
        return result;
      })();

      const agentId = authData?.user?.id ?? null;

      const { error: dbError } = await (async () => {
        const t0 = performance.now();
        const res = await supabase.from('profiles').select('id').limit(1);
        providerMetrics.push({
          endpoint: 'database',
          statusCode: res.error ? 500 : 200,
          latencyMs: performance.now() - t0
        });
        return res;
      })();

      const { error: openaiError } = await (async () => {
        const t0 = performance.now();
        const res = await supabase.functions.invoke('openai-chat', { body: { prompt: 'ping' } });
        providerMetrics.push({
          endpoint: 'openai-chat',
          statusCode: res.error ? 500 : 200,
          latencyMs: performance.now() - t0
        });
        return res;
      })();

      const { error: claudeError } = await (async () => {
        const t0 = performance.now();
        const res = await supabase.functions.invoke('claude-chat', { body: { prompt: 'ping' } });
        providerMetrics.push({
          endpoint: 'claude-chat',
          statusCode: res.error ? 500 : 200,
          latencyMs: performance.now() - t0
        });
        return res;
      })();

      const retellHealthy = await (async () => {
        const t0 = performance.now();
        const res = await supabase.functions.invoke('retell-ai', { body: { test: true } });
        providerMetrics.push({
          endpoint: 'retell-ai',
          statusCode: res.error ? 500 : 200,
          latencyMs: performance.now() - t0
        });
        return !res.error;
      })();

      const elevenLabsHealthy = await (async () => {
        const t0 = performance.now();
        const res = await supabase.functions.invoke('elevenlabs-speech', { body: { test: true } });
        providerMetrics.push({
          endpoint: 'elevenlabs-speech',
          statusCode: res.error ? 500 : 200,
          latencyMs: performance.now() - t0
        });
        return !res.error;
      })();

      const voiceSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
      const micSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

      const totalTime = performance.now() - startTime;

      setMetrics({
        apiHealth: 'healthy',
        databaseHealth: dbError
          ? 'down'
          : (providerMetrics.find(p => p.endpoint === 'database')?.latencyMs || 0) > 1000
            ? 'degraded'
            : 'healthy',
        voiceSystemHealth: (!voiceSupported || !micSupported) ? 'down' : 'healthy',
        aiSystemHealth: openaiError || claudeError ? 'degraded' : 'healthy',
        retellAIHealth: retellHealthy ? 'healthy' : 'down',
        elevenLabsHealth: elevenLabsHealthy ? 'healthy' : 'down',
        authHealth: authError ? 'down' : 'healthy',
        lastChecked: new Date(),
        uptime: Date.now() - performance.timeOrigin,
        errorRate: 0,
        responseTime: totalTime,
        providerMetrics
      });

      logger.info('System health check completed', { providerMetrics, totalTime }, 'system_health');

      for (const metric of providerMetrics) {
        const severity = metric.statusCode >= 500 ? 'error' : metric.statusCode >= 400 ? 'warning' : 'info';
        await supabase.from('ai_brain_logs').insert({
          type: 'system_health_metric',
          event_summary: `${metric.endpoint}: ${metric.statusCode} (${Math.round(metric.latencyMs)}ms)`,
          payload: {
            endpoint: metric.endpoint,
            status_code: metric.statusCode,
            latency_ms: Math.round(metric.latencyMs),
            agent_id: agentId
          },
          timestamp: new Date().toISOString(),
          visibility: 'admin_only'
        });
      }

    } catch (error) {
      logger.error('System health check failed', error, 'system_health');

      setMetrics(prev => ({
        ...prev,
        apiHealth: 'down',
        lastChecked: new Date(),
        responseTime: performance.now() - startTime,
        providerMetrics: []
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
