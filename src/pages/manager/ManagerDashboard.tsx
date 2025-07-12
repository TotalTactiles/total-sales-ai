
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Users, Target, Zap } from 'lucide-react';
import MonthlyForecast from '@/components/Manager/MonthlyForecast';
import MarketingOverview from '@/components/Manager/MarketingOverview';
import ManagerPulse from '@/components/Manager/ManagerPulse';
import EnhancedTeamPerformance from '@/components/Manager/EnhancedTeamPerformance';
import TeamRewardsSnapshot from '@/components/Manager/TeamRewardsSnapshot';

const ManagerDashboard: React.FC = () => {
  const keyMetrics = [
    {
      title: 'Monthly Revenue',
      value: '$247K',
      change: '+18% vs last month',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconColor: 'text-green-600'
    },
    {
      title: 'Team Quota',
      value: '87%',
      change: 'On track for 110%',
      changeType: 'positive' as const,
      icon: Target,
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Deals',
      value: '34',
      change: '$127K in pipeline',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconColor: 'text-purple-600'
    },
    {
      title: 'Team Performance',
      value: '92%',
      change: '1 needs support',
      changeType: 'neutral' as const,
      icon: Users,
      iconColor: 'text-orange-600'
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
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
  );
};

export default ManagerDashboard;
