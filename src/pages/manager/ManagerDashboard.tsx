
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Users, Target, Zap } from 'lucide-react';
import MonthlyForecast from '@/components/Manager/MonthlyForecast';
import MarketingOverview from '@/components/Manager/MarketingOverview';
import ManagerPulse from '@/components/Manager/ManagerPulse';
import EnhancedTeamPerformance from '@/components/Manager/EnhancedTeamPerformance';
import TeamRewardsSnapshot from '@/components/Manager/TeamRewardsSnapshot';
import AIGreeting from '@/components/AI/AIGreeting';
import { AIInsightsModal } from '@/components/Manager/AIInsightsModal';

const ManagerDashboard: React.FC = () => {
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const keyMetrics = [
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: '$247K',
      change: '+18% vs last month',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconColor: 'text-green-600',
      insights: [
        'Revenue growth accelerated by 23% in the last two weeks',
        'Enterprise deals contributing 65% of monthly revenue',
        'Q4 projections show potential for $320K if current trend continues'
      ],
      recommendations: [
        'Focus on closing 3 pending enterprise deals worth $45K total',
        'Increase outreach to mid-market segment showing 40% higher conversion',
        'Schedule quarterly business review with top 5 clients'
      ],
      chartData: [
        { name: 'Jan', value: 185000 },
        { name: 'Feb', value: 195000 },
        { name: 'Mar', value: 220000 },
        { name: 'Apr', value: 247000 }
      ],
      chartType: 'line' as const,
      trend: 'up' as const
    },
    {
      id: 'quota',
      title: 'Team Quota',
      value: '87%',
      change: 'On track for 110%',
      changeType: 'positive' as const,
      icon: Target,
      iconColor: 'text-blue-600',
      insights: [
        'Team is 13% ahead of typical monthly pace',
        'Sarah Johnson leading with 145% quota achievement',
        'Two team members need coaching to hit 100%'
      ],
      recommendations: [
        'Schedule 1:1 coaching sessions with underperforming reps',
        'Share Sarah\'s closing techniques with the team',
        'Implement peer mentoring program'
      ],
      chartData: [
        { name: 'Sarah', value: 145 },
        { name: 'Michael', value: 75 },
        { name: 'Jasmine', value: 120 },
        { name: 'Alex', value: 65 }
      ],
      chartType: 'bar' as const,
      trend: 'up' as const
    },
    {
      id: 'deals',
      title: 'Active Deals',
      value: '34',
      change: '$127K in pipeline',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      insights: [
        'Average deal size increased by 28% this quarter',
        '12 deals in final negotiation stage',
        'Win rate improved to 34% from 28%'
      ],
      recommendations: [
        'Prioritize the 12 deals in final negotiation',
        'Follow up on 8 stalled deals from last month',
        'Increase proposal quality with better ROI calculations'
      ],
      chartData: [
        { name: 'Prospecting', value: 8 },
        { name: 'Qualified', value: 14 },
        { name: 'Negotiation', value: 12 }
      ],
      chartType: 'pie' as const,
      trend: 'up' as const
    },
    {
      id: 'performance',
      title: 'Team Performance',
      value: '92%',
      change: '1 needs support',
      changeType: 'neutral' as const,
      icon: Users,
      iconColor: 'text-orange-600',
      insights: [
        'Overall team performance excellent at 92%',
        'Michael Chen showing signs of burnout (working 12+ hours)',
        'Team morale high with 4.2/5 satisfaction score'
      ],
      recommendations: [
        'Schedule wellness check with Michael Chen',
        'Redistribute some of Michael\'s high-pressure deals',
        'Implement team recognition program for sustained performance'
      ],
      chartData: [
        { name: 'Excellent', value: 2 },
        { name: 'Good', value: 1 },
        { name: 'Needs Support', value: 1 }
      ],
      chartType: 'pie' as const,
      trend: 'neutral' as const
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleCardClick = (metric: any) => {
    setSelectedInsight({
      id: metric.id,
      title: metric.title,
      value: metric.value,
      subtitle: metric.change,
      insights: metric.insights,
      recommendations: metric.recommendations,
      chartData: metric.chartData,
      chartType: metric.chartType,
      trend: metric.trend
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Manager Dashboard</h1>
              <p className="text-slate-600 mt-1">Executive overview and team insights</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Insights
            </Badge>
          </div>

          {/* Key Metrics Grid - Now Clickable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card 
                  key={index} 
                  className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => handleCardClick(metric)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 mb-1">{metric.title}</p>
                        <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
                        <p className={`text-sm ${getChangeColor(metric.changeType)}`}>
                          {metric.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-slate-100 ${metric.iconColor}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Monthly Forecast */}
          <MonthlyForecast />

          {/* Manager Pulse - New Component */}
          <ManagerPulse />

          {/* Marketing Overview */}
          <MarketingOverview />

          {/* Enhanced Team Performance - Replaces original */}
          <EnhancedTeamPerformance />

          {/* Team Rewards Overview - New Component */}
          <TeamRewardsSnapshot />
        </div>
      </div>

      {/* AI Daily Summary Sidebar */}
      <div className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto flex-shrink-0">
        <AIGreeting userName="Manager" className="mb-6" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Today's Priority Actions</h3>
          
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-800">High Priority</span>
              </div>
              <p className="text-xs text-red-700">Michael Chen needs immediate coaching - 25% behind target</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-800">Medium Priority</span>
              </div>
              <p className="text-xs text-yellow-700">3 enterprise deals need final push - potential $45K</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">Opportunity</span>
              </div>
              <p className="text-xs text-blue-700">Sarah's techniques could boost team performance by 15%</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Modal */}
      {selectedInsight && (
        <AIInsightsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedInsight}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
