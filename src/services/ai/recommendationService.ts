import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { AIRecommendation } from './types';
import { safeJsonToObject } from './utils';

export class RecommendationService {
  async getPersonalizedRecommendations(userId: string, companyId: string, context: Record<string, any>): Promise<AIRecommendation[]> {
    try {
      // Generate contextual recommendations based on user data and AI brain insights
      const { data: insights } = await supabase
        .from('ai_brain_insights')
        .select('*')
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(10);

      const recommendations: AIRecommendation[] = [];

      // Convert insights to actionable recommendations
      for (const insight of insights || []) {
        const insightContext = safeJsonToObject(insight.context);
        
        if (insightContext.actionable) {
          recommendations.push({
            id: crypto.randomUUID(),
            type: this.mapInsightToRecommendationType(insight.type),
            priority: this.mapImpactToPriority(insightContext.impact),
            title: insightContext.title || 'AI Recommendation',
            description: insightContext.description || 'AI-generated recommendation',
            confidence: insightContext.confidence || 0.5,
            impact: insightContext.impact || 'medium',
            implementation: this.generateSuggestedAction(insight),
            userId: userId,
            companyId: companyId,
            timestamp: new Date(),
            resolved: false
          });
        }
      }

      return recommendations;
    } catch (error) {
      logger.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  private mapInsightToRecommendationType(insightType: string): AIRecommendation['type'] {
    const mapping: Record<string, AIRecommendation['type']> = {
      'performance': 'performance',
      'recommendation': 'optimization',
      'optimization': 'optimization',
      'alert': 'security',
      'trend': 'feature_request'
    };
    return mapping[insightType] || 'optimization';
  }

  private mapImpactToPriority(impact: string): AIRecommendation['priority'] {
    const mapping: Record<string, AIRecommendation['priority']> = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'critical': 'critical'
    };
    return mapping[impact] || 'medium';
  }

  private generateSuggestedAction(insight: any): string {
    const insightContext = safeJsonToObject(insight.context);
    
    // Generate contextual action suggestions based on insight type and metadata
    switch (insight.type) {
      case 'recommendation':
        return `Take action based on: ${insightContext.description || 'AI recommendation'}`;
      case 'optimization':
        return `Optimize workflow: ${insightContext.title || 'Process optimization'}`;
      case 'alert':
        return `Address alert: ${insightContext.description || 'System alert'}`;
      default:
        return `Review and consider: ${insightContext.title || 'AI insight'}`;
    }
  }
}
