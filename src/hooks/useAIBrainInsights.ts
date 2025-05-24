
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
      // Log the ghost intent (action user tried but couldn't complete)
      await supabase
        .from('ai_brain_logs')
        .insert({
          user_id: user.id,
          company_id: profile.company_id,
          log_type: 'ghost_intent',
          action,
          context: window.location.pathname,
          metadata: { reasoning, timestamp: new Date().toISOString() }
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
          user_id: user.id,
          company_id: profile.company_id,
          log_type: 'interaction',
          feature,
          action,
          outcome,
          context: window.location.pathname,
          metadata: { ...metadata, timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  const generateInsights = async () => {
    if (!user?.id || !profile?.company_id) return;
    
    setIsAnalyzing(true);
    
    try {
      // Fetch recent usage patterns
      const { data: recentLogs } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('company_id', profile.company_id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1000);

      if (!recentLogs) return;

      // Analyze patterns and generate insights
      const generatedInsights: AIInsight[] = [];

      // Pattern: High ghost intent on specific features
      const ghostIntents = recentLogs.filter(log => log.log_type === 'ghost_intent');
      if (ghostIntents.length > 5) {
        const commonActions = ghostIntents.reduce((acc, log) => {
          acc[log.action] = (acc[log.action] || 0) + 1;
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
            timestamp: new Date()
          });
        }
      }

      // Pattern: Call success rates
      const callLogs = recentLogs.filter(log => 
        log.feature === 'dialer' && log.outcome
      );
      
      if (callLogs.length > 10) {
        const successRate = callLogs.filter(log => 
          log.outcome?.includes('success') || log.outcome?.includes('converted')
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
            timestamp: new Date()
          });
        }
      }

      // Pattern: Feature usage trends
      const featureUsage = recentLogs.reduce((acc, log) => {
        if (log.feature) {
          acc[log.feature] = (acc[log.feature] || 0) + 1;
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
          timestamp: new Date()
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
        .lt('created_at', cutoffDate);
        
      if (error) throw error;
      
      console.log('Pruned old AI brain data');
    } catch (error) {
      console.error('Error pruning AI brain data:', error);
    }
  };

  return {
    insights,
    isAnalyzing,
    generateInsights,
    logGhostIntent,
    logInteraction,
    pruneOldData
  };
};
