
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CallLog {
  id: string;
  company_id: string;
  user_id: string;
  lead_id?: string;
  call_type: string;
  duration: number;
  status: string;
  notes?: string;
  recording_url?: string;
  call_sid?: string;
  created_at: string;
}

export const useCallLogs = () => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchCallLogs = async () => {
    if (!user?.id || !profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCallLogs(data || []);
    } catch (error) {
      console.error('Error fetching call logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCallLog = async (callData: Omit<CallLog, 'id' | 'company_id' | 'user_id' | 'created_at'>) => {
    if (!user?.id || !profile?.company_id) return null;

    try {
      const { data, error } = await supabase
        .from('call_logs')
        .insert({
          ...callData,
          company_id: profile.company_id,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setCallLogs(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating call log:', error);
      toast.error('Failed to log call');
      return null;
    }
  };

  const updateCallLog = async (id: string, updates: Partial<CallLog>) => {
    try {
      const { data, error } = await supabase
        .from('call_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCallLogs(prev => prev.map(log => log.id === id ? data : log));
      return data;
    } catch (error) {
      console.error('Error updating call log:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, [user?.id, profile?.company_id]);

  return {
    callLogs,
    isLoading,
    createCallLog,
    updateCallLog,
    refetch: fetchCallLogs
  };
};
