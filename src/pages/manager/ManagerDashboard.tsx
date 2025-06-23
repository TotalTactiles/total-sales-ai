
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDemoData } from '@/contexts/DemoDataContext';
import { logger } from '@/utils/logger';
import ManagerOverviewCards from '@/components/Manager/ManagerOverviewCards';
import ManagerTeamTable from '@/components/Manager/ManagerTeamTable';
import ManagerAIAssistant from '@/components/ManagerAI/ManagerAIAssistant';
import ManagerRecognitionEngine from '@/components/Manager/ManagerRecognitionEngine';
import ManagerEscalationCenter from '@/components/Manager/ManagerEscalationCenter';
import ManagerBookingSystem from '@/components/Manager/ManagerBookingSystem';
import ErrorBoundary from '@/components/auth/ErrorBoundary';

import type { DemoTeamMember, DemoAIRecommendation } from '@/data/demoData';

const ManagerDashboard = () => {
  const { user, profile, isDemoMode } = useAuth();
  const [teamMembers, setTeamMembers] = useState<DemoTeamMember[]>([]);
  const [recommendations, setRecommendations] = useState<DemoAIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  // Get demo data from context
  const demoData = useDemoData();

  // Check if in demo mode
  useEffect(() => {
    if (isDemoMode()) {
      setDemoMode(true);
      initializeDemoData();
    } else {
      fetchData();
    }
  }, [user]);

  const initializeDemoData = () => {
    try {
      setTeamMembers(demoData.teamMembers);
      setRecommendations(demoData.recommendations);
      setError(null);
    } catch (err) {
      logger.error('Error initializing demo data:', err);
      setError('Failed to load demo data');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      
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
      setError('Failed to fetch team data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salesBlue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex-1 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <ErrorBoundary>
            <ManagerOverviewCards 
              teamMembers={teamMembers}
              recommendations={recommendations}
              demoMode={demoMode}
              profile={profile}
            />
          </ErrorBoundary>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <ErrorBoundary>
                <ManagerTeamTable teamMembers={teamMembers} />
              </ErrorBoundary>
              <ErrorBoundary>
                <ManagerRecognitionEngine />
              </ErrorBoundary>
            </div>
            
            <div className="space-y-6">
              <ErrorBoundary>
                <ManagerAIAssistant />
              </ErrorBoundary>
              <ErrorBoundary>
                <ManagerBookingSystem demoMode={demoMode} />
              </ErrorBoundary>
              <ErrorBoundary>
                <ManagerEscalationCenter demoMode={demoMode} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ManagerDashboard;
