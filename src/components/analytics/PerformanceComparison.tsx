
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import { TooltipInfo } from '@/components/ui/tooltip-info';

interface PerformanceMetric {
  title: string;
  userValue: string;
  teamAverage: string;
  userProgress: number;
  teamProgress: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  tooltip: string;
}

export const PerformanceComparison: React.FC = () => {
  const metrics: PerformanceMetric[] = [
    {
      title: 'Calls Made',
      userValue: '196',
      teamAverage: '142',
      userProgress: 98,
      teamProgress: 71,
      trend: 'up',
      icon: Phone,
      color: 'text-blue-600',
      tooltip: 'Number of outbound calls made this month. More calls typically lead to more opportunities and higher revenue.'
    },
    {
      title: 'Revenue Generated',
      userValue: '$63.5K',
      teamAverage: '$48.2K',
      userProgress: 79,
      teamProgress: 60,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      tooltip: 'Total revenue closed this month. This directly impacts your commission and team targets.'
    },
    {
      title: 'Meetings Booked',
      userValue: '41',
      teamAverage: '32',
      userProgress: 82,
      teamProgress: 64,
      trend: 'up',
      icon: Calendar,
      color: 'text-purple-600',
      tooltip: 'Qualified meetings scheduled with prospects. Higher meeting rates indicate better lead qualification and follow-up.'
    },
    {
      title: 'Email Responses',
      userValue: '89',
      teamAverage: '76',
      userProgress: 74,
      teamProgress: 63,
      trend: 'up',
      icon: Mail,
      color: 'text-orange-600',
      tooltip: 'Email response rate from prospects. Good responses indicate effective messaging and timing.'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            My Performance vs Team Average
            <TooltipInfo content="Compare your performance against team averages to identify strengths and areas for improvement. Consistent outperformance often leads to promotions and bonuses." />
          </CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Above Average
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const isAboveAverage = metric.userProgress > metric.teamProgress;
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-5 w-5 ${metric.color}`} />
                  <span className="font-medium">{metric.title}</span>
                  <TooltipInfo content={metric.tooltip} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-lg">{metric.userValue}</div>
                    <div className="text-xs text-gray-500">You</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-600">{metric.teamAverage}</div>
                    <div className="text-xs text-gray-500">Team Avg</div>
                  </div>
                  {isAboveAverage ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Your Progress</span>
                  <span className="text-sm text-gray-600">{metric.userProgress}%</span>
                </div>
                <Progress value={metric.userProgress} className="h-3" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Team Average</span>
                  <span className="text-sm text-gray-500">{metric.teamProgress}%</span>
                </div>
                <Progress value={metric.teamProgress} className="h-2 opacity-60" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
