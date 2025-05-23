
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface BrainInsight {
  id: string;
  type: string;
  suggestion_text: string;
  triggered_by: string;
  timestamp: string;
  accepted: boolean | null;
  context: any;
}

export const useAIBrainInsights = () => {
  const [insights, setInsights] = useState<BrainInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();

  const fetchInsights = async () => {
    if (!profile?.company_id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('ai_brain_insights')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('timestamp', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      setInsights(data || []);
      
    } catch (error) {
      console.error('Error fetching AI brain insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptInsight = async (insightId: string) => {
    if (!profile?.company_id) return;
    
    try {
      const { error } = await supabase
        .from('ai_brain_insights')
        .update({ accepted: true })
        .eq('id', insightId)
        .eq('company_id', profile.company_id);
        
      if (error) throw error;
      
      // Update local state
      setInsights(prev => 
        prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, accepted: true }
            : insight
        )
      );
      
      toast.success('Insight accepted! We\'ll prioritize this feature.');
      
    } catch (error) {
      console.error('Error accepting insight:', error);
      toast.error('Failed to accept insight');
    }
  };

  const dismissInsight = async (insightId: string) => {
    if (!profile?.company_id) return;
    
    try {
      const { error } = await supabase
        .from('ai_brain_insights')
        .update({ accepted: false })
        .eq('id', insightId)
        .eq('company_id', profile.company_id);
        
      if (error) throw error;
      
      // Update local state
      setInsights(prev => 
        prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, accepted: false }
            : insight
        )
      );
      
    } catch (error) {
      console.error('Error dismissing insight:', error);
      toast.error('Failed to dismiss insight');
    }
  };

  const logGhostIntent = async (featureAttempted: string, intentDescription: string, metadata?: any) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('ghost_intent_events')
        .insert({
          user_id: user.id,
          feature_attempted: featureAttempted,
          intent_description: intentDescription,
          metadata
        });
        
      if (error) throw error;
      
      // Generate an AI insight based on this ghost intent
      await generateInsightFromGhostIntent(featureAttempted, intentDescription);
      
    } catch (error) {
      console.error('Error logging ghost intent:', error);
    }
  };

  const generateInsightFromGhostIntent = async (feature: string, intent: string) => {
    if (!profile?.company_id || !user?.id) return;
    
    try {
      const suggestionText = `We noticed you tried to use ${feature}. ${intent}. Would you like us to prioritize this feature for your industry?`;
      
      const { error } = await supabase
        .from('ai_brain_insights')
        .insert({
          company_id: profile.company_id,
          user_id: user.id,
          type: 'feature_suggestion',
          suggestion_text: suggestionText,
          triggered_by: 'ghost_intent',
          context: { feature, intent }
        });
        
      if (error) throw error;
      
      // Refresh insights
      fetchInsights();
      
    } catch (error) {
      console.error('Error generating insight from ghost intent:', error);
    }
  };

  useEffect(() => {
    if (profile?.company_id) {
      fetchInsights();
    }
  }, [profile?.company_id]);

  return {
    insights,
    isLoading,
    acceptInsight,
    dismissInsight,
    logGhostIntent,
    refreshInsights: fetchInsights
  };
};
