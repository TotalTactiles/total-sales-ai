
import { supabase } from '@/integrations/supabase/client';
import { accessControlService } from '@/services/security/accessControlService';
import { performanceMonitor } from './monitoring/performanceMonitor';
import { insightManager } from './monitoring/insightManager';
import { usageTracker } from './monitoring/usageTracker';
import type { AIInsight, AILog, UsageEvent } from './monitoring/types';

// Re-export types for backward compatibility
export type { AIInsight, AILog };

export class AIMonitoringService {
  private static instance: AIMonitoringService;

  static getInstance(): AIMonitoringService {
    if (!AIMonitoringService.instance) {
      AIMonitoringService.instance = new AIMonitoringService();
    }
    return AIMonitoringService.instance;
  }

  async logAIEvent(log: Omit<AILog, 'id'>): Promise<void> {
    const sanitizedPayload = accessControlService.sanitizeAIOutput(log.payload);
    return performanceMonitor.logAIEvent({
      ...log,
      payload: sanitizedPayload
    });
  }

  async generateInsight(insight: Omit<AIInsight, 'id'>): Promise<void> {
    return insightManager.generateInsight(insight);
  }

  async trackUsageEvent(event: UsageEvent): Promise<void> {
    await usageTracker.trackUsageEvent(event);
    await insightManager.acceptInsight(''); // Track insight acceptance
  }

  async getAIInsights(companyId: string): Promise<AIInsight[]> {
    return insightManager.getAIInsights(companyId);
  }

  async acceptInsight(insightId: string): Promise<void> {
    await insightManager.acceptInsight(insightId);
    
    await this.trackUsageEvent({
      feature: 'ai_insights',
      action: 'accepted',
      context: 'insight_interaction',
      metadata: { insightId },
      outcome: 'success'
    });
  }

  async startPerformanceMonitoring(): Promise<void> {
    performanceMonitor.startPerformanceMonitoring();
  }
}

export const aiMonitoringService = AIMonitoringService.getInstance();
