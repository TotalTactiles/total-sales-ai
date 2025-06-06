import { logger } from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDemoData } from '@/contexts/DemoDataContext';
import Navigation from '@/components/Navigation';
import ManagerOverviewCards from '@/components/Manager/ManagerOverviewCards';
import ManagerTeamTable from '@/components/Manager/ManagerTeamTable';
import ManagerAIAssistant from '@/components/ManagerAI/ManagerAIAssistant';
import ManagerRecognitionEngine from '@/components/Manager/ManagerRecognitionEngine';
import ManagerEscalationCenter from '@/components/Manager/ManagerEscalationCenter';
import ManagerBookingSystem from '@/components/Manager/ManagerBookingSystem';

import type { DemoTeamMember, DemoAIRecommendation } from '@/data/demoData';

const ManagerDashboard = () => {
  const { user, profile, isDemoMode } = useAuth();
  const [teamMembers, setTeamMembers] = useState<DemoTeamMember[]>([]);
  const [recommendations, setRecommendations] = useState<DemoAIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  // Check if in demo mode
  useEffect(() => {
    if (isDemoMode()) {
      setDemoMode(true);
      initializeDemoData();
    } else {
      fetchData();
    }
  }, [user]);

  const { teamMembers: demoTeam, recommendations: demoRecs } = useDemoData();

  const initializeDemoData = () => {
    setTeamMembers(demoTeam);
    setRecommendations(demoRecs);
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
      const teamData: DemoTeamMember[] = [];
      
      for (const profile of profilesData) {
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', profile.id)
          .single();
          
        if (statsError && statsError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          logger.error('Error fetching stats for user', { userId: profile.id, error: statsError.message });
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
      logger.error('Error fetching data:', { error });
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
      <Navigation role="manager" />
      
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
