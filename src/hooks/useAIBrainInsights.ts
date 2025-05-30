
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
      console.error('Error fetching AI insights:', error);
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
      console.error('Error accepting insight:', error);
      toast.error('Failed to accept insight');
    }
  };

  const generateInsight = async (context: any) => {
    if (!user?.id || !profile?.company_id) return;

    try {
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
      console.error('Error generating insight:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [user?.id, profile?.company_id]);

  return {
    insights,
    isLoading,
    fetchInsights,
    acceptInsight,
    generateInsight
  };
};
