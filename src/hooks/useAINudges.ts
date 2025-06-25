
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface AINudge {
  id: string;
  nudge_type: string;
  title: string;
  message: string;
  action_url?: string;
  priority: number;
  seen: boolean;
  dismissed: boolean;
}

export const useAINudges = () => {
  const { user } = useAuth();
  const [nudges, setNudges] = useState<AINudge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNudges = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_nudges')
          .select('*')
          .eq('rep_id', user.id)
          .eq('dismissed', false)
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching AI nudges:', error);
          return;
        }

        setNudges(data || []);
      } catch (error) {
        console.error('Error in fetchNudges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNudges();
  }, [user]);

  const markAsSeen = async (nudgeId: string) => {
    try {
      await supabase
        .from('ai_nudges')
        .update({ seen: true })
        .eq('id', nudgeId);
      
      setNudges(prev => prev.map(nudge => 
        nudge.id === nudgeId ? { ...nudge, seen: true } : nudge
      ));
    } catch (error) {
      console.error('Error marking nudge as seen:', error);
    }
  };

  const dismissNudge = async (nudgeId: string) => {
    try {
      await supabase
        .from('ai_nudges')
        .update({ dismissed: true })
        .eq('id', nudgeId);
      
      setNudges(prev => prev.filter(nudge => nudge.id !== nudgeId));
    } catch (error) {
      console.error('Error dismissing nudge:', error);
    }
  };

  return { nudges, loading, markAsSeen, dismissNudge };
};
