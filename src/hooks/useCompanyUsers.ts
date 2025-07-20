
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CompanyUser {
  id: string;
  full_name: string;
  role: string;
  email?: string;
}

export const useCompanyUsers = () => {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile, user } = useAuth();

  const fetchCompanyUsers = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('company_id', profile.company_id)
        .neq('id', user?.id); // Exclude current user

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching company users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchCompanyUsers();
    }
  }, [profile]);

  return {
    users,
    loading,
    fetchCompanyUsers
  };
};
