
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface CompanyMasterAI {
  id: string;
  company_id: string;
  top_weaknesses: string[];
  most_clicked_features: string[];
  wishlist_tags: string[];
  last_synced_at: string;
}

export const useCompanyMasterAI = () => {
  const { user, profile } = useAuth();
  const [masterAI, setMasterAI] = useState<CompanyMasterAI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !profile?.company_id) {
      setLoading(false);
      return;
    }

    const fetchMasterAI = async () => {
      try {
        const { data, error } = await supabase
          .from('company_master_ai')
          .select('*')
          .eq('company_id', profile.company_id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        setMasterAI(data);
        logger.info('Company Master AI loaded', { companyId: profile.company_id });
      } catch (err: any) {
        console.error('Failed to fetch company master AI:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterAI();
  }, [user, profile?.company_id]);

  const updateMasterAI = async (updates: Partial<CompanyMasterAI>) => {
    if (!profile?.company_id) return;

    try {
      const { error } = await supabase
        .from('company_master_ai')
        .upsert({
          company_id: profile.company_id,
          ...updates,
          last_synced_at: new Date().toISOString()
        }, {
          onConflict: 'company_id'
        });

      if (error) throw error;

      // Refresh data
      const { data } = await supabase
        .from('company_master_ai')
        .select('*')
        .eq('company_id', profile.company_id)
        .single();

      setMasterAI(data);
    } catch (err: any) {
      console.error('Failed to update company master AI:', err);
      setError(err.message);
    }
  };

  return { masterAI, loading, error, updateMasterAI };
};
