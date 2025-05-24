
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AIInsight {
  id: string;
  type: 'pattern' | 'trend' | 'optimization' | 'alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  metadata: Record<string, any>;
  timestamp: Date;
  accepted?: boolean | null;
  suggestion_text?: string;
  triggered_by?: string;
  context?: any;
}

export interface GhostIntent {
  action: string;
  context: string;
  reasoning?: string;
  timestamp: Date;
}

export const useAIBrainInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user, profile } = useAuth();

  const logGhostIntent = async (action: string, reasoning?: string) => {
    if (!user?.id || !profile?.company_id) return;
    
    try {
      // Log the ghost intent using the correct table structure
      await supabase
        .from('ai_brain_logs')
        .insert({
          company_id: profile.company_id,
          type: 'ghost_intent',
          event_summary: `Ghost intent: ${action}`,
          payload: { 
            user_id: user.id,
            action, 
            context: window.location.pathname,
            reasoning, 
            timestamp: new Date().toISOString() 
          }
        });
        
      console.log('Ghost intent logged:', { action, reasoning });
    } catch (error) {
      console.error('Error logging ghost intent:', error);
    }
  };

  const logInteraction = async (
    feature: string, 
    action: string, 
    outcome?: string, 
    metadata?: Record<string, any>
  ) => {
    if (!user?.id || !profile?.company_id) return;
    
    try {
      await supabase
        .from('ai_brain_logs')
        .insert({
          company_id: profile.company_id,
          type: 'interaction',
          event_summary: `${feature}: ${action}`,
          payload: { 
            user_id: user.id,
            feature,
            action,
            outcome,
            context: window.location.pathname,
            metadata: { ...metadata, timestamp: new Date().toISOString() }
          }
        });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  const acceptInsight = async (insightId: string) => {
    try {
      // Update insight in database
      await supabase
        .from('ai_brain_insights')
        .update({ accepted: true })
        .eq('id', insightId);

      // Update local state
      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, accepted: true }
          : insight
      ));

      toast.success('Insight accepted and will be implemented');
    } catch (error) {
      console.error('Error accepting insight:', error);
      toast.error('Failed to accept insight');
    }
  };

  const dismissInsight = async (insightId: string) => {
    try {
      // Update insight in database
      await supabase
        .from('ai_brain_insights')
        .update({ accepted: false })
        .eq('id', insightId);

      // Update local state
      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, accepted: false }
          : insight
      ));

      toast.info('Insight dismissed');
    } catch (error) {
      console.error('Error dismissing insight:', error);
      toast.error('Failed to dismiss insight');
    }
  };

  const generateInsights = async () => {
    if (!user?.id || !profile?.company_id) return;
    
    setIsAnalyzing(true);
    
    try {
      // Fetch recent usage patterns using correct column names
      const { data: recentLogs } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('company_id', profile.company_id)
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (!recentLogs) return;

      // Analyze patterns and generate insights
      const generatedInsights: AIInsight[] = [];

      // Pattern: High ghost intent on specific features
      const ghostIntents = recentLogs.filter(log => log.type === 'ghost_intent');
      if (ghostIntents.length > 5) {
        const commonActions = ghostIntents.reduce((acc, log) => {
          const action = log.payload?.action;
          if (action) {
            acc[action] = (acc[action] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        const topGhostAction = Object.entries(commonActions)
          .sort(([,a], [,b]) => b - a)[0];

        if (topGhostAction && topGhostAction[1] > 2) {
          generatedInsights.push({
            id: `ghost-${Date.now()}`,
            type: 'optimization',
            title: 'Feature Request Pattern Detected',
            description: `Users are frequently trying to ${topGhostAction[0]} but hitting limitations. Consider prioritizing this feature.`,
            confidence: 0.85,
            impact: 'high',
            actionable: true,
            metadata: { action: topGhostAction[0], frequency: topGhostAction[1] },
            timestamp: new Date(),
            accepted: null,
            suggestion_text: `Implement ${topGhostAction[0]} feature`,
            triggered_by: 'ghost_intent_analysis'
          });
        }
      }

      // Pattern: Call success rates
      const callLogs = recentLogs.filter(log => 
        log.payload?.feature === 'dialer' && log.payload?.outcome
      );
      
      if (callLogs.length > 10) {
        const successRate = callLogs.filter(log => 
          log.payload?.outcome?.includes('success') || log.payload?.outcome?.includes('converted')
        ).length / callLogs.length;

        if (successRate < 0.3) {
          generatedInsights.push({
            id: `calls-${Date.now()}`,
            type: 'alert',
            title: 'Call Success Rate Below Average',
            description: `Current call success rate is ${Math.round(successRate * 100)}%. Industry average is 45%. Consider additional coaching.`,
            confidence: 0.92,
            impact: 'high',
            actionable: true,
            metadata: { successRate, totalCalls: callLogs.length },
            timestamp: new Date(),
            accepted: null,
            suggestion_text: 'Implement additional call coaching',
            triggered_by: 'call_performance_analysis'
          });
        }
      }

      // Pattern: Feature usage trends
      const featureUsage = recentLogs.reduce((acc, log) => {
        const feature = log.payload?.feature;
        if (feature) {
          acc[feature] = (acc[feature] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const underusedFeatures = Object.entries(featureUsage)
        .filter(([feature, count]) => count < 5 && feature !== 'login')
        .map(([feature]) => feature);

      if (underusedFeatures.length > 0) {
        generatedInsights.push({
          id: `underused-${Date.now()}`,
          type: 'optimization',
          title: 'Underutilized Features Detected',
          description: `Features like ${underusedFeatures.join(', ')} are rarely used. Consider training or UI improvements.`,
          confidence: 0.75,
          impact: 'medium',
          actionable: true,
          metadata: { underusedFeatures },
          timestamp: new Date(),
          accepted: null,
          suggestion_text: 'Improve feature discoverability',
          triggered_by: 'feature_usage_analysis'
        });
      }

      setInsights(generatedInsights);
      
      if (generatedInsights.length > 0) {
        toast.success(`Generated ${generatedInsights.length} AI insights`);
      }
      
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate AI insights');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const pruneOldData = async () => {
    if (!user?.id || !profile?.company_id) return;
    
    try {
      // Delete logs older than 90 days to prevent data bloat
      const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from('ai_brain_logs')
        .delete()
        .eq('company_id', profile.company_id)
        .lt('timestamp', cutoffDate);
        
      if (error) throw error;
      
      console.log('Pruned old AI brain data');
    } catch (error) {
      console.error('Error pruning AI brain data:', error);
    }
  };

  return {
    insights,
    isAnalyzing,
    isLoading: isAnalyzing, // Add alias for compatibility
    generateInsights,
    logGhostIntent,
    logInteraction,
    acceptInsight,
    dismissInsight,
    pruneOldData
  };
};
