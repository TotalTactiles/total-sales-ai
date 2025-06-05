
import { logger } from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import ManagerOverviewCards from '@/components/Manager/ManagerOverviewCards';
import ManagerTeamTable from '@/components/Manager/ManagerTeamTable';
import ManagerAIAssistant from '@/components/ManagerAI/ManagerAIAssistant';
import ManagerRecognitionEngine from '@/components/Manager/ManagerRecognitionEngine';
import ManagerEscalationCenter from '@/components/Manager/ManagerEscalationCenter';
import ManagerBookingSystem from '@/components/Manager/ManagerBookingSystem';

type TeamMember = {
  id: string;
  full_name: string | null;
  last_login: string | null;
  role: string;
  stats: {
    call_count: number;
    win_count: number;
    current_streak: number;
    burnout_risk: number;
    last_active: string | null;
    mood_score: number | null;
  }
};

type AIRecommendation = {
  id: string;
  type: 'follow-up' | 'burnout' | 'trending-down' | 'reward';
  rep_name: string;
  rep_id: string;
  message: string;
  action: string;
};

const ManagerDashboard = () => {
  const { user, profile } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  // Check if in demo mode
  useEffect(() => {
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    if (isDemoMode) {
      setDemoMode(true);
      initializeDemoData();
    } else {
      fetchData();
    }
  }, [user]);

  const initializeDemoData = () => {
    // Mock team members data
    const mockTeamMembers: TeamMember[] = [
      {
        id: 'demo-tm-1',
        full_name: 'Sarah Johnson',
        last_login: new Date().toISOString(),
        role: 'sales_rep',
        stats: {
          call_count: 172,
          win_count: 45,
          current_streak: 5,
          burnout_risk: 10,
          last_active: new Date().toISOString(),
          mood_score: 85
        }
      },
      {
        id: 'demo-tm-2',
        full_name: 'Michael Chen',
        last_login: new Date(Date.now() - 3600000).toISOString(),
        role: 'sales_rep',
        stats: {
          call_count: 143,
          win_count: 32,
          current_streak: 0,
          burnout_risk: 75,
          last_active: new Date(Date.now() - 3600000).toISOString(),
          mood_score: 45
        }
      },
      {
        id: 'demo-tm-3',
        full_name: 'Jasmine Lee',
        last_login: new Date(Date.now() - 86400000).toISOString(),
        role: 'sales_rep',
        stats: {
          call_count: 198,
          win_count: 57,
          current_streak: 7,
          burnout_risk: 20,
          last_active: new Date(Date.now() - 43200000).toISOString(),
          mood_score: 90
        }
      }
    ];
    
    const mockRecommendations: AIRecommendation[] = [
      {
        id: 'demo-rec-1',
        type: 'follow-up',
        rep_name: 'Sarah Johnson',
        rep_id: 'demo-tm-1',
        message: 'Sarah missed 3 follow-ups with Enterprise leads this week',
        action: 'Assign Recovery Mode'
      },
      {
        id: 'demo-rec-2',
        type: 'burnout',
        rep_name: 'Michael Chen',
        rep_id: 'demo-tm-2',
        message: 'Michael worked 12+ hours overtime this week and mood score is dropping',
        action: 'Schedule 1-on-1'
      }
    ];
    
    setTeamMembers(mockTeamMembers);
    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, we would fetch all team members for the manager
      // and their associated stats
      
      // Fetch all profiles that are sales reps
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'sales_rep');
      
      if (profilesError) throw profilesError;
      
      // Get stats for each sales rep
      const teamData: TeamMember[] = [];
      
      for (const profile of profilesData) {
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', profile.id)
          .single();
          
        if (statsError && statsError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          logger.error('Error fetching stats for user', profile.id, statsError.message);
          continue;
        }
        
        teamData.push({
          id: profile.id,
          full_name: profile.full_name,
          last_login: profile.last_login,
          role: profile.role,
          stats: statsData || {
            call_count: 0,
            win_count: 0,
            current_streak: 0,
            burnout_risk: 0,
            last_active: null,
            mood_score: null
          }
        });
      }
      
      setTeamMembers(teamData);
      
      // In a real implementation, AI recommendations would be generated based on team data
      // Here we'll just set empty recommendations for simplicity
      setRecommendations([]);
      
    } catch (error) {
      logger.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salesBlue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      
      <main className="pt-[60px]">
        <div className="flex-1 px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <ManagerOverviewCards 
              teamMembers={teamMembers}
              recommendations={recommendations}
              demoMode={demoMode}
              profile={profile}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-6">
                <ManagerTeamTable teamMembers={teamMembers} />
                <ManagerRecognitionEngine />
              </div>
              
              <div className="space-y-6">
                <ManagerAIAssistant />
                <ManagerBookingSystem demoMode={demoMode} />
                <ManagerEscalationCenter demoMode={demoMode} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
