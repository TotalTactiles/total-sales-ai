
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface RepMetrics {
  calls_made: number;
  demos_booked: number;
  closes: number;
  objections_logged: Record<string, number>;
  avg_tone_score: number;
}

export const useRepMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RepMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMetrics = async () => {
      try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        
        const { data, error } = await supabase
          .from('rep_metrics')
          .select('*')
          .eq('rep_id', user.id)
          .eq('week_start', startOfWeek.toISOString().split('T')[0])
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching rep metrics:', error);
          return;
        }

        setMetrics(data || {
          calls_made: 0,
          demos_booked: 0,
          closes: 0,
          objections_logged: {},
          avg_tone_score: 0
        });
      } catch (error) {
        console.error('Error in fetchMetrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  return { metrics, loading };
};
