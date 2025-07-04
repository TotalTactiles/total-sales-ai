
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Brain,
  Target,
  DollarSign,
  Phone,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface BusinessOpsSnapshotProps {
  className?: string;
}

const BusinessOpsSnapshot: React.FC<BusinessOpsSnapshotProps> = ({ className = '' }) => {
  const opsMetrics = [
    {
      id: 'revenue-trend',
      title: 'Revenue Trends',
      value: '+15.2%',
      subtitle: 'vs last month',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      trend: 'up',
      deepDive: 'Reports > Revenue Analytics',
      insights: [
        'Q4 trending 23% above target',
        'Enterprise deals driving growth'
      ]
    },
    {
      id: 'objection-types',
      title: 'Top Objections',
      value: 'Price (34%)',
      subtitle: 'Budget concerns',
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      trend: 'down',
      deepDive: 'Team > Coaching Logs',
      insights: [
        'Price objections up 12%',
        'Need value prop training'
      ]
    },
    {
      id: 'follow-up-delays',
      title: 'Follow-up Speed',
      value: '2.8 days',
      subtitle: 'avg response time',
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      trend: 'neutral',
      deepDive: 'Team Analytics > Response Times',
      insights: [
        'Goal: Under 24 hours',
        '3 reps consistently delayed'
      ]
    },
    {
      id: 'ai-alerts',
      title: 'AI Alert Heatmap',
      value: '12 Active',
      subtitle: '3 high priority',
      icon: Brain,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      trend: 'up',
      deepDive: 'AI Assistant > Alert Center',
      insights: [
        'Hot leads going cold',
        'Rep burnout indicators'
      ]
    },
    {
      id: 'goal-progress',
      title: 'Goal Progress',
      value: '78%',
      subtitle: 'Q4 target',
      icon: Target,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      trend: 'up',
      deepDive: 'Business Ops > Goal Tracking',
      insights: [
        'On track for Q4 goals',
        'Team performance strong'
      ]
    },
    {
      id: 'activity-volume',
      title: 'Activity Volume',
      value: '847',
      subtitle: 'calls this week',
      icon: Phone,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      trend: 'up',
      deepDive: 'Team > Activity Reports',
      insights: [
        'Activity up 18% vs last week',
        'Quality metrics maintained'
      ]
    }
  ];

  const handleMetricClick = (metricId: string, deepDive: string) => {
    console.log(`Navigate to metric: ${metricId}`);
    toast.success(`Would navigate to: ${deepDive}`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Business Operations Snapshot
          <Badge className="bg-white/20 text-white text-xs ml-auto">
            Real-time
          </Badge>
        </CardTitle>
        <p className="text-indigo-100 text-sm">
          AI-powered insights aligned with your business goals
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opsMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={metric.id}
                onClick={() => handleMetricClick(metric.id, metric.deepDive)}
                className={`${metric.bgColor} ${metric.borderColor} border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 group h-48 flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className={`h-5 w-5 ${metric.textColor} flex-shrink-0`} />
                  <div className={`flex items-center gap-1 ${metric.textColor}`}>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
                
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  <h4 className="font-semibold text-gray-900 text-sm leading-tight text-center">
                    {metric.title}
                  </h4>
                  <div className={`text-xl font-bold ${metric.textColor} leading-tight text-center`}>
                    {metric.value}
                  </div>
                  <p className="text-xs text-gray-600 leading-tight text-center">
                    {metric.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-700 text-center">
                    <div className="space-y-1">
                      <div className="truncate">{metric.insights[0]}</div>
                      <div className="truncate opacity-75">{metric.insights[1]}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessOpsSnapshot;
