
import { supabase } from '@/integrations/supabase/client';
import { accessControlService } from '@/services/security/accessControlService';

export interface AIInsight {
  id?: string;
  type: 'performance_optimization' | 'lead_scoring' | 'conversation_analysis' | 'workflow_suggestion';
  suggestion_text: string;
  context: Record<string, any>;
  triggered_by: string;
  user_id?: string;
  company_id?: string;
  accepted?: boolean;
}

export interface AILog {
  id?: string;
  event_summary: string;
  type: 'query' | 'training' | 'insight_generation' | 'optimization';
  payload: Record<string, any>;
  company_id?: string;
  visibility: 'admin_only' | 'manager_visible' | 'public';
}

export class AIMonitoringService {
  private static instance: AIMonitoringService;

  static getInstance(): AIMonitoringService {
    if (!AIMonitoringService.instance) {
      AIMonitoringService.instance = new AIMonitoringService();
    }
    return AIMonitoringService.instance;
  }

  async logAIEvent(log: Omit<AILog, 'id'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const sanitizedPayload = accessControlService.sanitizeAIOutput(log.payload);

      await supabase.from('ai_brain_logs').insert({
        event_summary: log.event_summary,
        type: log.type,
        payload: sanitizedPayload,
        company_id: log.company_id,
        visibility: log.visibility
      });

      console.log('AI event logged:', log.event_summary);
    } catch (error) {
      console.error('Failed to log AI event:', error);
    }
  }

  async generateInsight(insight: Omit<AIInsight, 'id'>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('ai_brain_insights').insert({
        type: insight.type,
        suggestion_text: insight.suggestion_text,
        context: insight.context,
        triggered_by: insight.triggered_by,
        user_id: insight.user_id || user?.id,
        company_id: insight.company_id
      });

      console.log('AI insight generated:', insight.type);
    } catch (error) {
      console.error('Failed to generate AI insight:', error);
    }
  }

  async trackUsageEvent(event: {
    feature: string;
    action: string;
    context: string;
    metadata?: Record<string, any>;
    outcome?: string;
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, role')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      await supabase.from('usage_events').insert({
        user_id: user.id,
        company_id: profile.company_id,
        role: profile.role,
        feature: event.feature,
        action: event.action,
        context: event.context,
        metadata: event.metadata,
        outcome: event.outcome
      });

      console.log('Usage event tracked:', event.feature, event.action);
    } catch (error) {
      console.error('Failed to track usage event:', error);
    }
  }

  async getAIInsights(companyId: string): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_insights')
        .select('*')
        .eq('company_id', companyId)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Type cast the database response to match our interface
      return (data || []).map(item => ({
        id: item.id,
        type: item.type as AIInsight['type'],
        suggestion_text: item.suggestion_text,
        context: item.context || {},
        triggered_by: item.triggered_by,
        user_id: item.user_id,
        company_id: item.company_id,
        accepted: item.accepted
      }));
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
      return [];
    }
  }

  async acceptInsight(insightId: string): Promise<void> {
    try {
      await supabase
        .from('ai_brain_insights')
        .update({ accepted: true })
        .eq('id', insightId);

      await this.trackUsageEvent({
        feature: 'ai_insights',
        action: 'accepted',
        context: 'insight_interaction',
        metadata: { insightId },
        outcome: 'success'
      });
    } catch (error) {
      console.error('Failed to accept insight:', error);
    }
  }

  async startPerformanceMonitoring(): Promise<void> {
    // Monitor API response times
    this.monitorAPIPerformance();
    
    // Track user engagement patterns
    this.monitorUserEngagement();
    
    // Monitor system health
    this.monitorSystemHealth();
  }

  private monitorAPIPerformance(): void {
    // Override fetch to monitor API calls
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

    // Track user activity
    const trackActivity = () => {
      activityCount++;
      
      // Log session summary every 30 minutes
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

    // Listen for user interactions
    document.addEventListener('click', trackActivity);
    document.addEventListener('keydown', trackActivity);
  }

  private async monitorSystemHealth(): Promise<void> {
    setInterval(async () => {
      const memoryUsage = (performance as any).memory;
      const connectionCount = navigator.onLine ? 1 : 0;
      
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

export const aiMonitoringService = AIMonitoringService.getInstance();
