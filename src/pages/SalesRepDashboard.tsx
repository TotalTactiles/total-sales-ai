
import React, { useState, useEffect } from 'react';
import AIAssistant from '@/components/AIAssistant';
import DashboardNavigation from '@/components/Dashboard/DashboardNavigation';
import AIDailySummary from '@/components/Dashboard/AIDailySummary';
import PerformanceMetricsGrid from '@/components/Dashboard/PerformanceMetricsGrid';
import PipelinePulse from '@/components/Dashboard/PipelinePulse';
import AIOptimizedTimeBlocks from '@/components/Dashboard/AIOptimizedTimeBlocks';
import VictoryArchive from '@/components/Dashboard/VictoryArchive';
import AISummaryCard from '@/components/Dashboard/AISummaryCard';
import AIRecommendedActions from '@/components/Dashboard/AIRecommendedActions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AIPersona = {
  id: string;
  name: string;
  level: number;
  tone: string;
  delivery_style: string;
};

type UserStats = {
  call_count: number;
  win_count: number;
  current_streak: number;
  best_time_start: string | null;
  best_time_end: string | null;
  mood_score: number | null;
};

const SalesRepDashboard = () => {
  const { user, profile } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullUser, setIsFullUser] = useState(false);

  // Check if user is full user
  useEffect(() => {
    const userStatus = localStorage.getItem('userStatus');
    const planType = localStorage.getItem('planType');
    setIsFullUser(userStatus === 'full' && planType === 'pro');
    
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    if (isDemoMode || userStatus === 'full') {
      initializeFullUserData();
    } else {
      fetchData();
    }
  }, [user]);

  const initializeFullUserData = () => {
    setUserStats({
      call_count: 347,
      win_count: 89,
      current_streak: 12,
      best_time_start: '14:00',
      best_time_end: '16:00',
      mood_score: 92
    });
    setLoading(false);
    
    setTimeout(() => {
      toast.success("Welcome back! All Pro features are active.", {
        description: "Your AI assistant is fully trained and ready to help.",
      });
    }, 2000);
  };

  const fetchData = async () => {
    if (!user) return;
    
    try {
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (statsError) throw statsError;
      
      setUserStats(statsData as UserStats);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Sample data
  const dailySummary = isFullUser ? 
    "Good morning! Your AI assistant has analyzed your pipeline and identified 3 high-priority leads requiring immediate attention. Your performance is trending 23% above last week, with optimal call times between 2-4 PM. Today's focus: follow up with Enterprise Corp (Deal value: $50K) and schedule the demo with TechStart Inc. Your energy levels are optimal for high-stakes conversations." :
    "Good morning! You have 5 leads in your pipeline requiring follow-up. Your call performance is trending upward. Focus on your top 3 priority leads today for maximum impact.";

  const mockLeads = [
    { id: '1', name: 'Enterprise Corp', status: 'qualified' as const, priority: 'high' as const, lastContact: 'Yesterday', value: '$50,000' },
    { id: '2', name: 'TechStart Inc', status: 'contacted' as const, priority: 'high' as const, lastContact: '2 days ago', value: '$25,000' },
    { id: '3', name: 'Growth Solutions', status: 'new' as const, priority: 'medium' as const, lastContact: 'Today', value: '$15,000' },
    { id: '4', name: 'Scale Dynamics', status: 'proposal' as const, priority: 'high' as const, lastContact: '3 days ago', value: '$75,000' },
    { id: '5', name: 'Innovation Labs', status: 'contacted' as const, priority: 'low' as const, lastContact: '1 week ago', value: '$10,000' },
  ];

  const mockVictories = [
    { id: '1', clientName: 'DataFlow Systems', dealValue: '$85,000', dateClosed: '2024-12-15', type: 'new' as const },
    { id: '2', clientName: 'CloudTech Solutions', dealValue: '$45,000', dateClosed: '2024-12-10', type: 'upsell' as const },
    { id: '3', clientName: 'StartupX', dealValue: '$30,000', dateClosed: '2024-12-05', type: 'renewal' as const },
  ];

  const aiSummaryData = {
    emailsDrafted: isFullUser ? 24 : 8,
    callsScheduled: isFullUser ? 15 : 5,
    proposalsGenerated: isFullUser ? 6 : 2,
    improvementPercentage: isFullUser ? 67 : 23,
  };

  const recommendedActions = [
    {
      id: '1',
      description: 'Call Enterprise Corp about Q1 budget approval',
      suggestedTime: 'Today, 2:30 PM',
      urgency: 'high' as const,
      type: 'call' as const,
      impact: 'high' as const,
    },
    {
      id: '2',
      description: 'Send follow-up email to TechStart Inc with demo recording',
      suggestedTime: 'Today, 11:00 AM',
      urgency: 'medium' as const,
      type: 'email' as const,
      impact: 'medium' as const,
    },
    {
      id: '3',
      description: 'Schedule meeting with Scale Dynamics decision maker',
      suggestedTime: 'Tomorrow, 10:00 AM',
      urgency: 'high' as const,
      type: 'meeting' as const,
      impact: 'high' as const,
    },
  ];

  const handleLeadClick = (leadId: string) => {
    console.log('Lead clicked:', leadId);
    // Navigate to lead details
  };

  const handleActionClick = (actionId: string) => {
    console.log('Action clicked:', actionId);
    toast.success('Action started!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      {/* Main Content */}
      <main className="pt-[60px]">
        <div className="max-w-[1200px] mx-auto p-6 space-y-6">
          {/* AI Daily Summary */}
          <AIDailySummary 
            summary={dailySummary}
            isFullUser={isFullUser}
          />

          {/* Performance Metrics Grid */}
          <PerformanceMetricsGrid 
            userStats={userStats}
            isFullUser={isFullUser}
          />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <PipelinePulse 
                leads={mockLeads}
                onLeadClick={handleLeadClick}
              />
              
              <AIRecommendedActions
                actions={recommendedActions}
                onActionClick={handleActionClick}
                isFullUser={isFullUser}
              />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <AIOptimizedTimeBlocks isFullUser={isFullUser} />
              <VictoryArchive victories={mockVictories} isFullUser={isFullUser} />
            </div>
          </div>

          {/* AI Summary Card */}
          <AISummaryCard 
            data={aiSummaryData}
            isFullUser={isFullUser}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-[40px] bg-background border-t border-border flex items-center justify-between px-6 text-sm text-muted-foreground z-40">
        <span>SalesOS v2.1.0</span>
        <a href="#" className="hover:text-foreground transition-colors">Support</a>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default SalesRepDashboard;
