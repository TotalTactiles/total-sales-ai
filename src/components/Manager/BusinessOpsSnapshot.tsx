
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
import SnapshotModal from './SnapshotModal';

interface BusinessOpsSnapshotProps {
  className?: string;
}

const BusinessOpsSnapshot: React.FC<BusinessOpsSnapshotProps> = ({ className = '' }) => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);

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
      deepDive: '/manager/reports',
      insights: [
        'Q4 trending 23% above target based on current pipeline velocity',
        'Enterprise deals driving 67% of revenue growth this quarter',
        'SMB conversion rates improving by 12% month-over-month'
      ],
      chartData: [
        { name: 'Jan', value: 45000 },
        { name: 'Feb', value: 52000 },
        { name: 'Mar', value: 48000 },
        { name: 'Apr', value: 61000 },
        { name: 'May', value: 55000 },
        { name: 'Jun', value: 67000 }
      ],
      chartType: 'line' as const
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
      deepDive: '/manager/team',
      insights: [
        'Price objections increased 12% from last quarter',
        'Need enhanced value proposition training for sales team',
        'Competitor pricing pressure in mid-market segment'
      ],
      chartData: [
        { name: 'Price', value: 34 },
        { name: 'Authority', value: 28 },
        { name: 'Need', value: 22 },
        { name: 'Timeline', value: 16 }
      ],
      chartType: 'pie' as const
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
      deepDive: '/manager/analytics',
      insights: [
        'Target goal: Under 24 hours for all lead responses',
        '3 reps consistently showing delayed follow-up patterns',
        'Automated sequences could improve response times by 40%'
      ],
      chartData: [
        { name: 'Same Day', value: 35 },
        { name: '1-2 Days', value: 28 },
        { name: '3-5 Days', value: 22 },
        { name: '5+ Days', value: 15 }
      ],
      chartType: 'bar' as const
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
      deepDive: '/manager/ai',
      insights: [
        'Hot leads showing decreased engagement patterns',
        'Rep burnout indicators detected for 2 team members',
        'Follow-up sequence optimization needed for 15 prospects'
      ],
      chartData: [
        { name: 'High Priority', value: 3 },
        { name: 'Medium Priority', value: 5 },
        { name: 'Low Priority', value: 4 }
      ],
      chartType: 'pie' as const
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
      deepDive: '/manager/goals',
      insights: [
        'On track to exceed Q4 revenue goals by 8%',
        'Team performance consistently above industry benchmarks',
        'Pipeline velocity increased 15% from last quarter'
      ],
      chartData: [
        { name: 'Q1', value: 65 },
        { name: 'Q2', value: 72 },
        { name: 'Q3', value: 85 },
        { name: 'Q4', value: 78 }
      ],
      chartType: 'bar' as const
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
      deepDive: '/manager/activity',
      insights: [
        'Activity volume up 18% compared to last week',
        'Quality metrics maintained despite increased volume',
        'Peak calling hours: 10-11 AM and 2-3 PM show highest connect rates'
      ],
      chartData: [
        { name: 'Mon', value: 142 },
        { name: 'Tue', value: 156 },
        { name: 'Wed', value: 178 },
        { name: 'Thu', value: 193 },
        { name: 'Fri', value: 178 }
      ],
      chartType: 'line' as const
    }
  ];

  const handleMetricClick = (metric: any) => {
    setSelectedSnapshot(metric);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <>
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
                  onClick={() => handleMetricClick(metric)}
                  className={`
                    ${metric.bgColor} ${metric.borderColor} border-2 rounded-xl p-4 
                    cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105
                    group h-48 flex flex-col justify-between
                    hover:bg-gradient-to-br hover:from-white hover:to-gray-50
                  `}
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

      {selectedSnapshot && (
        <SnapshotModal
          isOpen={!!selectedSnapshot}
          onClose={() => setSelectedSnapshot(null)}
          snapshot={selectedSnapshot}
        />
      )}
    </>
  );
};

export default BusinessOpsSnapshot;
