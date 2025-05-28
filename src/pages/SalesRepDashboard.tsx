import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AIDailySummary from '@/components/Dashboard/AIDailySummary';
import PerformanceMetricsGrid from '@/components/Dashboard/PerformanceMetricsGrid';
import PipelinePulse from '@/components/Dashboard/PipelinePulse';
import AIOptimizedTimeBlocks from '@/components/Dashboard/AIOptimizedTimeBlocks';
import VictoryArchive from '@/components/Dashboard/VictoryArchive';
import AISummaryCard from '@/components/Dashboard/AISummaryCard';
import AIRecommendedActions from '@/components/Dashboard/AIRecommendedActions';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import { supabase } from '@/integrations/supabase/client';

const SalesRepDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;
      
      try {
        const { data } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setUserStats(data);
      } catch (error) {
        console.log('No user stats found, using defaults');
      }
    };

    fetchUserStats();
  }, [user?.id]);

  const displayLeads = leads && leads.length > 0 ? leads : mockLeads;
  const isFullUser = !!user && !!profile;

  const dailySummary = `Good morning! You have 12 high-priority leads requiring immediate attention. Your conversion rate improved by 23% this week. AI suggests focusing on Enterprise prospects between 2-4 PM for optimal engagement. Your pipeline value increased to $847K with 3 deals expected to close this week.`;

  const pipelineLeads = displayLeads.slice(0, 5).map(lead => ({
    id: lead.id,
    name: lead.name,
    status: lead.status as 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed',
    priority: lead.priority as 'high' | 'medium' | 'low',
    lastContact: lead.lastContact || 'Never',
    value: `$${Math.floor(Math.random() * 50000 + 10000).toLocaleString()}`
  }));

  const handleLeadClick = (leadId: string) => {
    navigate(`/workspace/${leadId}`);
  };

  const victories = [
    { 
      id: '1',
      clientName: 'TechCorp Inc.',
      dealValue: '$125,000',
      dateClosed: '2024-01-15',
      type: 'new' as const
    },
    { 
      id: '2',
      clientName: 'Global Solutions',
      dealValue: '$85,000',
      dateClosed: '2024-01-12',
      type: 'upsell' as const
    },
    { 
      id: '3',
      clientName: 'StartupXYZ',
      dealValue: '$45,000',
      dateClosed: '2024-01-08',
      type: 'renewal' as const
    }
  ];

  const aiSummaryData = {
    emailsDrafted: 23,
    callsScheduled: 12,
    proposalsGenerated: 5,
    improvementPercentage: 34
  };

  const recommendedActions = [
    {
      id: '1',
      description: 'Call Maria Rodriguez at TechCorp - warm lead ready to close',
      suggestedTime: '2:30 PM',
      urgency: 'high' as const,
      type: 'call' as const,
      impact: 'high' as const
    },
    {
      id: '2',
      description: 'Send follow-up email to Global Solutions with updated proposal',
      suggestedTime: '3:15 PM',
      urgency: 'medium' as const,
      type: 'email' as const,
      impact: 'medium' as const
    },
    {
      id: '3',
      description: 'Schedule demo with StartupXYZ for next week',
      suggestedTime: '4:00 PM',
      urgency: 'low' as const,
      type: 'meeting' as const,
      impact: 'low' as const
    }
  ];

  const handleActionClick = (actionId: string) => {
    console.log('Action clicked:', actionId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <section>
        <AIDailySummary summary={dailySummary} isFullUser={isFullUser} />
      </section>

      <section>
        <PerformanceMetricsGrid userStats={userStats} isFullUser={isFullUser} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PipelinePulse leads={pipelineLeads} onLeadClick={handleLeadClick} />
          <AIOptimizedTimeBlocks isFullUser={isFullUser} />
        </div>

        <div className="space-y-6">
          <VictoryArchive victories={victories} isFullUser={isFullUser} />
          <AISummaryCard data={aiSummaryData} isFullUser={isFullUser} />
        </div>
      </div>

      <section>
        <AIRecommendedActions 
          actions={recommendedActions} 
          onActionClick={handleActionClick}
          isFullUser={isFullUser}
        />
      </section>
    </div>
  );
};

export default SalesRepDashboard;
