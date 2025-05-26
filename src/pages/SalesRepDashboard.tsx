
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavigation from '@/components/Dashboard/DashboardNavigation';
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

  // Use real leads if available, otherwise use mock data
  const displayLeads = leads && leads.length > 0 ? leads : mockLeads;
  const isFullUser = !!user && !!profile;

  const dailySummary = `Good morning! You have 12 high-priority leads requiring immediate attention. Your conversion rate improved by 23% this week. AI suggests focusing on Enterprise prospects between 2-4 PM for optimal engagement. Your pipeline value increased to $847K with 3 deals expected to close this week.`;

  // Transform leads for PipelinePulse component
  const pipelineLeads = displayLeads.slice(0, 5).map(lead => ({
    id: lead.id,
    name: lead.name,
    status: lead.status as 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed',
    priority: lead.priority as 'high' | 'medium' | 'low',
    lastContact: lead.lastContact || 'Never',
    value: `$${Math.floor(Math.random() * 50000 + 10000).toLocaleString()}`
  }));

  const handleLeadClick = (leadId: string) => {
    // Navigate to the correct lead workspace route
    navigate(`/lead-workspace/${leadId}`);
  };

  const victories = [
    { client: 'TechCorp Inc.', value: '$125,000', date: '2024-01-15' },
    { client: 'Global Solutions', value: '$85,000', date: '2024-01-12' },
    { client: 'StartupXYZ', value: '$45,000', date: '2024-01-08' }
  ];

  const aiActions = {
    emails_drafted: 23,
    calls_scheduled: 12,
    proposals_generated: 5,
    improvement_percentage: 34
  };

  const recommendedActions = [
    {
      id: '1',
      description: 'Call Maria Rodriguez at TechCorp - warm lead ready to close',
      suggestedTime: '2:30 PM',
      urgency: 'high' as const,
      type: 'call' as const
    },
    {
      id: '2',
      description: 'Send follow-up email to Global Solutions with updated proposal',
      suggestedTime: '3:15 PM',
      urgency: 'medium' as const,
      type: 'email' as const
    },
    {
      id: '3',
      description: 'Schedule demo with StartupXYZ for next week',
      suggestedTime: '4:00 PM',
      urgency: 'low' as const,
      type: 'meeting' as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="pt-[60px]">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* AI Daily Summary - Full Width */}
          <section>
            <AIDailySummary summary={dailySummary} isFullUser={isFullUser} />
          </section>

          {/* Performance Metrics - Grid */}
          <section>
            <PerformanceMetricsGrid userStats={userStats} isFullUser={isFullUser} />
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <PipelinePulse leads={pipelineLeads} onLeadClick={handleLeadClick} />
              <AIOptimizedTimeBlocks />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <VictoryArchive victories={victories} />
              <AISummaryCard actions={aiActions} isFullUser={isFullUser} />
            </div>
          </div>

          {/* AI Recommended Actions - Full Width */}
          <section>
            <AIRecommendedActions actions={recommendedActions} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default SalesRepDashboard;
