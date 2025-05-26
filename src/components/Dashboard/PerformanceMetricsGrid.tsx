
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PhoneCall, Trophy, Target, TrendingUp } from 'lucide-react';

interface MetricData {
  title: string;
  value: string;
  trend: number;
  icon: React.ComponentType<any>;
  color: string;
}

interface PerformanceMetricsGridProps {
  userStats: {
    call_count: number;
    win_count: number;
    current_streak: number;
    mood_score: number | null;
  } | null;
  isFullUser: boolean;
}

const PerformanceMetricsGrid: React.FC<PerformanceMetricsGridProps> = ({ userStats, isFullUser }) => {
  const metrics: MetricData[] = [
    {
      title: 'Calls Made',
      value: userStats?.call_count?.toString() || '0',
      trend: 8,
      icon: PhoneCall,
      color: 'text-blue-600'
    },
    {
      title: 'Deals Won',
      value: userStats?.win_count?.toString() || '0',
      trend: 23,
      icon: Trophy,
      color: 'text-green-600'
    },
    {
      title: 'Win Streak',
      value: userStats?.current_streak?.toString() || '0',
      trend: 15,
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className={`h-[150px] ${isFullUser ? 'border-2 border-gradient-to-r from-yellow-400 to-orange-500' : ''}`}>
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                </div>
                <IconComponent className={`h-8 w-8 ${metric.color}`} />
              </div>
              
              {/* Mini trend chart simulation */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-8 bg-muted rounded flex items-end space-x-1 px-2">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 bg-primary rounded-t`}
                      style={{ height: `${Math.random() * 24 + 8}px` }}
                    />
                  ))}
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metric.trend}%
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PerformanceMetricsGrid;
