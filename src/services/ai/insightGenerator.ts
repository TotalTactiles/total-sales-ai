
import { supabase } from '@/integrations/supabase/client';
import { AIIngestionEvent, AIInsight } from './types';
import { safeJsonToObject } from './utils';

export class InsightGenerator {
  async generateInsightsFromEvent(event: AIIngestionEvent): Promise<void> {
    // AI-powered insight generation based on event patterns
    const insights: Partial<AIInsight>[] = [];

    switch (event.event_type) {
      case 'user_action':
        if (event.data.action === 'call_completed' && event.data.outcome === 'no_answer') {
          const callHistory = await this.getRecentCallHistory(event.user_id);
          if (callHistory.filter(c => c.outcome === 'no_answer').length >= 3) {
            insights.push({
              type: 'recommendation',
              title: 'Call Timing Optimization',
              description: 'Consider adjusting call times - detected pattern of no-answers',
              confidence: 0.75,
              impact: 'medium',
              actionable: true,
              metadata: { suggested_times: ['10:00 AM', '2:00 PM', '4:00 PM'] }
            });
          }
        }
        break;

      case 'email_interaction':
        if (event.data.action === 'opened' && event.data.subject?.includes('follow-up')) {
          insights.push({
            type: 'trend',
            title: 'Follow-up Email Engagement',
            description: 'Follow-up emails showing high engagement rates',
            confidence: 0.85,
            impact: 'medium',
            actionable: true,
            metadata: { engagement_rate: event.data.engagement_rate }
          });
        }
        break;
    }

    // Store insights
    for (const insight of insights) {
      await this.storeInsight({
        ...insight,
        id: crypto.randomUUID(),
        company_id: event.company_id,
        user_id: event.user_id,
        timestamp: new Date()
      } as AIInsight);
    }
  }

  private async getRecentCallHistory(userId: string): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      return data || [];
    } catch (error) {
      console.error('Error fetching call history:', error);
      return [];
    }
  }

  private async storeInsight(insight: AIInsight): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_brain_insights')
        .insert({
          type: insight.type,
          company_id: insight.company_id,
          user_id: insight.user_id,
          context: {
            title: insight.title,
            description: insight.description,
            confidence: insight.confidence,
            impact: insight.impact,
            actionable: insight.actionable,
            metadata: insight.metadata
          },
          triggered_by: 'master_ai_brain'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing insight:', error);
    }
  }
}
