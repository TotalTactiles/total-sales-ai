
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target } from 'lucide-react';

interface MonthlyForecastProps {
  onCardClick?: (data: any) => void;
}

const MonthlyForecast: React.FC<MonthlyForecastProps> = ({ onCardClick }) => {
  const handleClick = () => {
    if (onCardClick) {
      const forecastData = {
        id: 'monthly_forecast',
        title: 'Monthly Forecast Analysis',
        value: '$425,000',
        subtitle: '106% of monthly target achieved',
        trend: 'up' as const,
        insights: [
          'Team exceeded monthly target by 6% with 3 days remaining',
          'Revenue acceleration driven by enterprise deal closures',
          'Q4 forecast trending 12% above annual projections',
          'Pipeline velocity increased 18% compared to last quarter',
          'Top 3 reps contributing 65% of overperformance'
        ],
        recommendations: [
          'Maintain current momentum through end of quarter',
          'Document winning strategies for knowledge sharing',
          'Increase Q1 targets based on current performance trends',
          'Invest in additional enterprise sales resources',
          'Implement performance bonus structure for sustained growth'
        ],
        chartData: [
          { name: 'Week 1', target: 100000, actual: 110000 },
          { name: 'Week 2', target: 200000, actual: 225000 },
          { name: 'Week 3', target: 300000, actual: 335000 },
          { name: 'Week 4', target: 400000, actual: 425000 }
        ],
        chartType: 'line' as const
      };
      onCardClick(forecastData);
    }
  };

  return (
    <Card 
      className={`bg-gradient-to-r from-white to-slate-50 border-2 border-slate-200 shadow-lg ${onCardClick ? 'cursor-pointer hover:shadow-xl transition-all duration-200' : ''}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Monthly Forecast</CardTitle>
              <p className="text-slate-600 text-sm">Progress toward monthly goals</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">+12% above pace</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-4xl font-bold text-slate-900">$425,000</span>
            <p className="text-slate-600 text-sm">Current Achievement</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">106%</div>
            <div className="text-sm text-slate-500">Goal Completion</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-700">68% Month Complete</span>
            <span className="text-slate-700">Target: $400,000</span>
          </div>
          <Progress value={106} className="h-3 bg-slate-200" />
          <div className="flex justify-between text-sm text-slate-500">
            <span>Achieved: $425,000</span>
            <span>Remaining: 3 days</span>
          </div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800 font-medium">
            🎯 Excellent progress! Team is $25,000 ahead of target with strong momentum.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyForecast;
