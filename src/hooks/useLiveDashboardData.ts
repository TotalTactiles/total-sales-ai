
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface DashboardStats {
  activeLeads: number;
  callsToday: number;
  revenuePipeline: string;
  conversionRate: string;
}

interface DashboardData {
  deals: any[];
  stats: DashboardStats;
  activities: any[];
  loading: boolean;
  error: string | null;
}

export const useLiveDashboardData = (): DashboardData => {
  const { user, session } = useAuth();
  const [data, setData] = useState<DashboardData>({
    deals: [],
    stats: {
      activeLeads: 0,
      callsToday: 0,
      revenuePipeline: '$0',
      conversionRate: '0%'
    },
    activities: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    console.log('📊 useLiveDashboardData effect - Session check:', {
      hasUser: !!user,
      hasSession: !!session,
      userId: user?.id
    });

    if (!user?.id || !session) {
      console.log('🔍 No user ID or session available for dashboard data');
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchDashboardData = async () => {
      try {
        console.log('📦 Fetching live dashboard data for user:', user.id);
        
        // Get user's company_id from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (!profile?.company_id) {
          console.log('⚠️ No company_id found for user');
          setData(prev => ({ ...prev, loading: false }));
          return;
        }

        console.log('🏢 Found company_id:', profile.company_id);

        // Fetch leads (deals)
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .eq('company_id', profile.company_id)
          .order('created_at', { ascending: false });

        if (leadsError) {
          console.error('❌ Error fetching leads:', leadsError);
          throw leadsError;
        }

        // Fetch call logs for today's calls
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: callLogs, error: callsError } = await supabase
          .from('call_logs')
          .select('*')
          .eq('company_id', profile.company_id)
          .gte('created_at', today.toISOString());

        if (callsError) {
          console.error('❌ Error fetching call logs:', callsError);
        }

        // Calculate stats from real data
        const activeLeads = leads?.filter(lead => 
          ['new', 'contacted', 'qualified'].includes(lead.status)
        ).length || 0;

        const callsToday = callLogs?.length || 0;
        
        const pipelineValue = leads?.reduce((sum, lead) => {
          // Assuming leads have a value field or we estimate based on status
          const estimatedValue = lead.status === 'qualified' ? 5000 : 
                               lead.status === 'contacted' ? 2000 : 1000;
          return sum + estimatedValue;
        }, 0) || 0;

        const conversionRate = activeLeads > 0 ? 
          Math.round((leads?.filter(l => l.status === 'closed-won').length || 0) / activeLeads * 100) : 0;

        const dashboardStats: DashboardStats = {
          activeLeads,
          callsToday,
          revenuePipeline: `$${Math.round(pipelineValue / 1000)}K`,
          conversionRate: `${conversionRate}%`
        };

        console.log('📦 Loaded live dashboard data', { 
          leadsCount: leads?.length, 
          callsToday, 
          stats: dashboardStats 
        });

        setData({
          deals: leads || [],
          stats: dashboardStats,
          activities: callLogs || [],
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('💥 Dashboard data fetch error:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load dashboard data'
        }));
      }
    };

    fetchDashboardData();
  }, [user?.id, session]);

  return data;
};
