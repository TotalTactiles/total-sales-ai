import { logger } from '@/utils/logger';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMockData } from '@/hooks/useMockData';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import KPICards from '@/components/Dashboard/KPICards';
import PipelinePulse from '@/components/Dashboard/PipelinePulse';
import AISummaryBanner from '@/components/Dashboard/AISummaryBanner';
import AIRecommendedActions from '@/components/Dashboard/AIRecommendedActions';
import SalesRepAIAssistant from '@/components/SalesAI/SalesRepAIAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Target, 
  Award,
  Clock,
  MessageSquare,
  Zap,
  Brain
} from 'lucide-react';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { leads, getLeadMetrics, getHighPriorityLeads, getRecentActivities } = useMockData();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(true);

  const metrics = getLeadMetrics();
  const highPriorityLeads = getHighPriorityLeads();
  const recentActivities = getRecentActivities();

  const todayStats = {
    callsMade: 12,
    emailsSent: 8,
    meetingsBooked: 3,
    dealsProgressed: 2
  };

  const weeklyGoals = {
    calls: { current: 47, target: 60 },
    emails: { current: 32, target: 45 },
    meetings: { current: 8, target: 12 },
    deals: { current: 3, target: 5 }
  };

  const mockUserStats = {
    call_count: 156,
    win_count: 23,
    current_streak: 5,
    mood_score: 85
  };

  const pipelineLeads = leads.slice(0, 5).map(lead => ({
    id: lead.id,
    name: lead.name,
    status: lead.status as 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed',
    priority: lead.priority as 'high' | 'medium' | 'low',
    lastContact: lead.lastContact || 'Never',
    value: `$${Math.floor(Math.random() * 50000 + 10000).toLocaleString()}`
  }));

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
    }
  ];

  const handleLeadClick = (leadId: string) => {
    logger.info('Lead clicked:', leadId);
  };

  const handleActionClick = (actionId: string) => {
    logger.info('Action clicked:', actionId);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <DashboardHeader 
        aiSummaryEnabled={aiSummaryEnabled}
        setAiSummaryEnabled={setAiSummaryEnabled}
        isFullUser={true}
      />

      {/* AI Summary Banner */}
      <AISummaryBanner userStats={mockUserStats} enabled={aiSummaryEnabled} />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calls Today</p>
                <p className="text-3xl font-bold text-gray-900">{todayStats.callsMade}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                <p className="text-3xl font-bold text-gray-900">{todayStats.emailsSent}</p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meetings Booked</p>
                <p className="text-3xl font-bold text-gray-900">{todayStats.meetingsBooked}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Deals Progressed</p>
                <p className="text-3xl font-bold text-gray-900">{todayStats.dealsProgressed}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <KPICards userStats={mockUserStats} isFullUser={true} />

      {/* Weekly Goals */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(weeklyGoals).map(([key, goal]) => {
              const percentage = getProgressPercentage(goal.current, goal.target);
              return (
                <div key={key} className="text-center">
                  <div className="mb-2">
                    <span className="text-2xl font-bold">{goal.current}</span>
                    <span className="text-gray-500">/{goal.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        percentage >= 80 ? 'bg-green-500' : 
                        percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className={`text-sm font-medium ${getProgressColor(percentage)}`}>
                    {percentage}% Complete
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{key}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Pulse */}
      <PipelinePulse leads={pipelineLeads} onLeadClick={handleLeadClick} />

      {/* AI Recommended Actions */}
      <AIRecommendedActions 
        actions={recommendedActions} 
        onActionClick={handleActionClick} 
        isFullUser={true} 
      />

      {/* AI Assistant Button */}
      <Button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
      >
        <Brain className="h-6 w-6" />
      </Button>

      {/* AI Assistant Modal */}
      <SalesRepAIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};

export default SalesRepDashboard;
