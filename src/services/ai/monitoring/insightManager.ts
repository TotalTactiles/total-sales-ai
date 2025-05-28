
import { supabase } from '@/integrations/supabase/client';
import { accessControlService } from '@/services/security/accessControlService';
import { AIInsight } from './types';

export class InsightManager {
  private static instance: InsightManager;

  static getInstance(): InsightManager {
    if (!InsightManager.instance) {
      InsightManager.instance = new InsightManager();
    }
    return InsightManager.instance;
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

  async getAIInsights(companyId: string): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase
        .from('ai_brain_insights')
        .select('*')
        .eq('company_id', companyId)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        type: item.type as AIInsight['type'],
        suggestion_text: item.suggestion_text,
        context: typeof item.context === 'object' && item.context !== null ? item.context as Record<string, any> : {},
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

      console.log('Insight accepted:', insightId);
    } catch (error) {
      console.error('Failed to accept insight:', error);
    }
  }
}

export const insightManager = InsightManager.getInstance();
