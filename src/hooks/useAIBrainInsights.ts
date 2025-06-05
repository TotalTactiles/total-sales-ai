import { logger } from '@/utils/logger';

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AIInsight {
  id: string;
  type: string;
  suggestion_text: string;
  context: any;
  triggered_by: string;
  accepted: boolean;
  timestamp: string;
}

export const useAIBrainInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user, profile } = useAuth();

  const safeNumber = (value: unknown): number => {
    return typeof value === 'number' ? value : 0;
  };

  const fetchInsights = async () => {
    if (!user?.id || !profile?.company_id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_brain_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('company_id', profile.company_id)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      logger.error('Error fetching AI insights:', error);
      toast.error('Failed to fetch AI insights');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptInsight = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from('ai_brain_insights')
        .update({ accepted: true })
        .eq('id', insightId);

      if (error) throw error;

      setInsights(prev => 
        prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, accepted: true }
            : insight
        )
      );

      toast.success('Insight accepted');
    } catch (error) {
      logger.error('Error accepting insight:', error);
      toast.error('Failed to accept insight');
    }
  };

  const dismissInsight = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from('ai_brain_insights')
        .delete()
        .eq('id', insightId);

      if (error) throw error;

      setInsights(prev => prev.filter(insight => insight.id !== insightId));
      toast.success('Insight dismissed');
    } catch (error) {
      logger.error('Error dismissing insight:', error);
      toast.error('Failed to dismiss insight');
    }
  };

  const logGhostIntent = (intent: string, details?: string) => {
    logger.info('Ghost intent logged:', intent, details);
    // Could store this for analytics later
  };

  const logInteraction = (data: any) => {
    logger.info('Interaction logged:', data);
    // Could store this for analytics later
  };

  const generateInsight = async (context: any) => {
    if (!user?.id || !profile?.company_id) return null;

    try {
      setIsAnalyzing(true);
      // Generate AI insight based on context
      const insight = {
        type: 'performance',
        suggestion_text: 'Consider focusing on high-priority leads first',
        context,
        triggered_by: 'user_action',
        user_id: user.id,
        company_id: profile.company_id
      };

      const { data, error } = await supabase
        .from('ai_brain_insights')
        .insert(insight)
        .select()
        .single();

      if (error) throw error;

      setInsights(prev => [data, ...prev]);
      return data;
    } catch (error) {
      logger.error('Error generating insight:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [user?.id, profile?.company_id]);

  return {
    insights,
    isLoading,
    isAnalyzing,
    fetchInsights,
    acceptInsight,
    dismissInsight,
    generateInsight,
    logGhostIntent,
    logInteraction
  };
};
