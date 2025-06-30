import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsCard from '@/components/Dashboard/StatsCard';
import {
  Target,
  Phone,
  TrendingUp,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AIDailySummary } from './AIDailySummary';
import { AIAssistantHub } from './AIAssistantHub';
import { SuggestedSchedule } from './SuggestedSchedule';
import { PriorityTasks } from './PriorityTasks';
import { PipelinePulse } from './PipelinePulse';
import { useDashboardData } from '../../hooks/useDashboardData';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { data: dashboardData } = useDashboardData();

  const mockStats = [
    {
      title: 'Active Leads',
      value: '47',
      change: '+12 this week',
      changeType: 'positive' as const,
      icon: Target,
      iconColor: 'text-blue-600'
    },
    {
      title: 'Calls Today',
      value: '23',
      change: '8 connected',
      changeType: 'positive' as const,
      icon: Phone,
      iconColor: 'text-green-600'
    },
    {
      title: 'Revenue Pipeline',
      value: '$89K',
      change: '+15% this month',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconColor: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: '34%',
      change: '+5% improvement',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      <div className="flex-1 p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {profile?.full_name || 'Sales Rep'}</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            AI Assistant Active
          </Badge>
        </div>

        <AIDailySummary summary={dashboardData.aiSummary} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <SuggestedSchedule schedule={dashboardData.suggestedSchedule} />

        <PriorityTasks tasks={dashboardData.priorityTasks} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="mr-2">🔄</span>Pipeline Pulse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PipelinePulse leads={dashboardData.pipelineData} />
            </CardContent>
          </Card>
          <AIAssistantHub stats={dashboardData.aiAssistant} />
        </div>

        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-blue-600">🎯 Sales Rep OS Active</h2>
          <p className="text-gray-600 mt-2">Your AI-powered sales dashboard is ready to accelerate your performance</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
