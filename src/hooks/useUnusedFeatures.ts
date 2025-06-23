
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Simple logger for client-side
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};

interface UnusedFeature {
  id: string;
  feature: string;
  usage_count: number;
  flagged: boolean;
  last_seen: string | null;
}

export const useUnusedFeatures = () => {
  const [unusedFeatures, setUnusedFeatures] = useState<UnusedFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();

  const fetchUnusedFeatures = async () => {
    if (!profile?.company_id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('unused_features')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('usage_count', { ascending: true });
        
      if (error) throw error;
      
      setUnusedFeatures(data || []);
      
    } catch (error) {
      logger.error('Error fetching unused features:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeatureUsage = async (feature: string) => {
    if (!profile?.company_id) return;
    
    try {
      // Check if feature exists
      const { data: existing } = await supabase
        .from('unused_features')
        .select('*')
        .eq('company_id', profile.company_id)
        .eq('feature', feature)
        .single();
        
      if (existing) {
        // Update usage count
        await supabase
          .from('unused_features')
          .update({ 
            usage_count: existing.usage_count + 1,
            last_seen: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Create new entry
        await supabase
          .from('unused_features')
          .insert({
            company_id: profile.company_id,
            feature,
            usage_count: 1,
            last_seen: new Date().toISOString()
          });
      }
      
    } catch (error) {
      logger.error('Error updating feature usage:', error);
    }
  };

  const flagFeatureForRemoval = async (featureId: string) => {
    try {
      const { error } = await supabase
        .from('unused_features')
        .update({ flagged: true })
        .eq('id', featureId);
        
      if (error) throw error;
      
      fetchUnusedFeatures();
      
    } catch (error) {
      logger.error('Error flagging feature:', error);
    }
  };

  useEffect(() => {
    if (profile?.company_id) {
      fetchUnusedFeatures();
    }
  }, [profile?.company_id]);

  return {
    unusedFeatures,
    isLoading,
    updateFeatureUsage,
    flagFeatureForRemoval,
    refreshUnusedFeatures: fetchUnusedFeatures
  };
};
