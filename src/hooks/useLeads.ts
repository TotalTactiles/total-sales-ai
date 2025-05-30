
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DatabaseLead {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status: string;
  priority: string;
  score: number;
  tags: string[];
  last_contact?: string;
  conversion_likelihood: number;
  speed_to_lead: number;
  is_sensitive: boolean;
  notes?: string;
  value?: number;
  created_at: string;
  updated_at: string;
}

export const useLeads = () => {
  const [leads, setLeads] = useState<DatabaseLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchLeads = async () => {
    if (!user?.id || !profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  const createLead = async (leadData: Omit<DatabaseLead, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!profile?.company_id) {
      toast.error('Company not found');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...leadData,
          company_id: profile.company_id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setLeads(prev => [data, ...prev]);
      toast.success('Lead created successfully');
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to create lead');
      return null;
    }
  };

  const updateLead = async (id: string, updates: Partial<DatabaseLead>) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setLeads(prev => prev.map(lead => lead.id === id ? data : lead));
      toast.success('Lead updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
      return null;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setLeads(prev => prev.filter(lead => lead.id !== id));
      toast.success('Lead deleted successfully');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user?.id, profile?.company_id]);

  return {
    leads,
    isLoading,
    createLead,
    updateLead,
    deleteLead,
    refetch: fetchLeads
  };
};
