
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface PersonalizedProfile {
  id: string;
  full_name: string | null;
  role: string;
  industry: string | null;
  assistant_name: string;
  voice_style: string;
  onboarding_complete: boolean;
  launched_at: string | null;
  user_metadata: any;
  company_id: string | null;
  // Sales Rep specific fields
  sales_personality: string | null;
  primary_goal: string | null;
  motivation_trigger: string | null;
  weakness: string | null;
  mental_state_trigger: string | null;
  wishlist: string | null;
  // Manager specific fields
  management_style: string | null;
  team_size: number | null;
  preferred_team_personality: string | null;
  team_obstacle: string | null;
  business_goal: string | null;
  influence_style: string | null;
  // AI Assistant configuration
  ai_assistant: any;
}

export const usePersonalizedProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PersonalizedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('🔍 Fetching personalized profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        console.log('✅ Profile fetched:', data);
        logger.info('Personalized profile loaded', { 
          userId: user.id, 
          assistantName: data.assistant_name,
          voiceStyle: data.voice_style,
          industry: data.industry,
          role: data.role 
        });

        setProfile(data);
      } catch (err: any) {
        console.error('❌ Failed to fetch profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error, refetch: () => {
    if (user) {
      setLoading(true);
      setError(null);
    }
  }};
};
