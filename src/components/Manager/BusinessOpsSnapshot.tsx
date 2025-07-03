
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
  Mail,
  Calendar
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
        'Enterprise deals driving growth',
        'SMB segment needs attention'
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
        'Price objections up 12% this week',
        'Need better value proposition training',
        'Consider ROI calculator tool'
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
        '3 reps consistently delayed',
        'Automation could help'
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
        'Rep burnout indicators',
        'Pipeline bottlenecks detected'
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
        'Team performance strong',
        'Pipeline healthy'
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
        'Quality metrics maintained',
        'Team hitting targets'
      ]
    }
  ];

  const handleMetricClick = (metricId: string, deepDive: string) => {
    console.log(`Navigate to metric: ${metricId}`);
    toast.success(`Would navigate to: ${deepDive}`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />;
      case 'down': return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg mb-8 ${className}`}>
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
                className={`${metric.bgColor} ${metric.borderColor} border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className={`h-5 w-5 ${metric.textColor}`} />
                  <div className={`flex items-center gap-1 ${metric.textColor}`}>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {metric.title}
                  </h4>
                  <div className={`text-xl font-bold ${metric.textColor}`}>
                    {metric.value}
                  </div>
                  <p className="text-xs text-gray-600">
                    {metric.subtitle}
                  </p>
                </div>

                {/* Hover Insights */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="text-xs text-gray-700 space-y-1">
                    {metric.insights.slice(0, 2).map((insight, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs font-medium text-gray-600">
                      → {metric.deepDive}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Goal Alignment Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-900">Goal Alignment Summary</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Q4 Revenue: <span className="font-medium">78% to target</span> (on track)</p>
              <p>• Team Performance: <span className="font-medium">Above expectations</span></p>
              <p>• Pipeline Health: <span className="font-medium">Strong momentum</span></p>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm font-medium text-blue-900">Next Recommended Action:</p>
              <p className="text-sm text-blue-700">Focus on price objection training for underperforming reps</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessOpsSnapshot;
