import { logger } from '@/utils/logger';

import { useEffect, useRef } from 'react';
import { useUsageTracking } from './useUsageTracking';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const { trackEvent } = useUsageTracking();
  const renderStartTime = useRef<number>(Date.now());
  const loadStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const loadTime = Date.now() - loadStartTime.current;
    const renderTime = Date.now() - renderStartTime.current;

    // Track performance metrics
    const metrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      interactionTime: 0
    };

    // Add memory usage if available
    if ('memory' in performance) {
      metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    // Track component performance
    trackEvent({
      feature: 'performance_monitor',
      action: 'component_render',
      context: componentName,
      metadata: metrics
    });

    // Monitor for performance issues
    if (loadTime > 2000) {
      logger.warn(`Slow component load detected: ${componentName} took ${loadTime}ms`);
      trackEvent({
        feature: 'performance_issue',
        action: 'slow_load',
        context: componentName,
        metadata: { loadTime }
      });
    }

    if (renderTime > 500) {
      logger.warn(`Slow component render detected: ${componentName} took ${renderTime}ms`);
      trackEvent({
        feature: 'performance_issue',
        action: 'slow_render',
        context: componentName,
        metadata: { renderTime }
      });
    }
  }, [componentName, trackEvent]);

  const trackInteraction = (interactionType: string) => {
    const interactionTime = Date.now();
    trackEvent({
      feature: 'user_interaction',
      action: interactionType,
      context: componentName,
      metadata: { timestamp: interactionTime }
    });
  };

  return { trackInteraction };
};
