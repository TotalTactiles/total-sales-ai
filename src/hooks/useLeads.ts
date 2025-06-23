
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Lead, DatabaseLead } from '@/types/lead';
import { convertDatabaseLeadToLead } from '@/utils/leadUtils';

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

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchLeads = async () => {
    if (!user?.id || !profile?.company_id) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const convertedLeads = data?.map(convertDatabaseLeadToLead) || [];
      setLeads(convertedLeads);
    } catch (err) {
      logger.error('Error fetching leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user?.id, profile?.company_id]);

  return {
    leads,
    isLoading,
    error,
    refetch: fetchLeads
  };
};

export type { DatabaseLead };
