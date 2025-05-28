
import { supabase } from '@/integrations/supabase/client';
import { AILog } from './types';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  async logAIEvent(log: Omit<AILog, 'id'>): Promise<void> {
    try {
      await supabase.from('ai_brain_logs').insert({
        event_summary: log.event_summary,
        type: log.type,
        payload: log.payload,
        company_id: log.company_id,
        visibility: log.visibility
      });

      console.log('AI event logged:', log.event_summary);
    } catch (error) {
      console.error('Failed to log AI event:', error);
    }
  }

  startPerformanceMonitoring(): void {
    this.monitorAPIPerformance();
    this.monitorUserEngagement();
    this.monitorSystemHealth();
  }

  private monitorAPIPerformance(): void {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;
        
        if (duration > 5000) {
          await this.logAIEvent({
            event_summary: 'Slow API response detected',
            type: 'optimization',
            payload: {
              url: args[0],
              duration,
              status: response.status
            },
            visibility: 'admin_only'
          });
        }
        
        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        await this.logAIEvent({
          event_summary: 'API error detected',
          type: 'optimization',
          payload: {
            url: args[0],
            duration,
            error: error.message
          },
          visibility: 'admin_only'
        });
        throw error;
      }
    };
  }

  private monitorUserEngagement(): void {
    let sessionStartTime = Date.now();
    let activityCount = 0;

    const trackActivity = () => {
      activityCount++;
      
      if (activityCount % 50 === 0) {
        const sessionDuration = Date.now() - sessionStartTime;
        this.logAIEvent({
          event_summary: 'User engagement session',
          type: 'optimization',
          payload: {
            sessionDuration,
            activityCount,
            avgTimePerAction: sessionDuration / activityCount
          },
          visibility: 'manager_visible'
        });
      }
    };

    document.addEventListener('click', trackActivity);
    document.addEventListener('keydown', trackActivity);
  }

  private async monitorSystemHealth(): Promise<void> {
    setInterval(async () => {
      const memoryUsage = (performance as any).memory;
      
      await this.logAIEvent({
        event_summary: 'System health check',
        type: 'optimization',
        payload: {
          memoryUsage: memoryUsage ? {
            used: memoryUsage.usedJSHeapSize,
            total: memoryUsage.totalJSHeapSize,
            limit: memoryUsage.jsHeapSizeLimit
          } : null,
          online: navigator.onLine,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        },
        visibility: 'admin_only'
      });
    }, 300000); // Every 5 minutes
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
