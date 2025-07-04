
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SmartForecastBar: React.FC = () => {
  const forecastData = {
    projectedRevenue: 425000,
    monthlyGoal: 400000,
    currentProgress: 68,
    trend: 'up',
    trendPercentage: 12
  };

  const progressPercentage = (forecastData.projectedRevenue / forecastData.monthlyGoal) * 100;
  const isAbovePace = forecastData.projectedRevenue > forecastData.monthlyGoal;

  return (
    <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Forecast</h3>
              <div className="flex items-center gap-1">
                {forecastData.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${forecastData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {forecastData.trendPercentage}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress to Goal</span>
                <span className="font-medium">${forecastData.projectedRevenue.toLocaleString()} / ${forecastData.monthlyGoal.toLocaleString()}</span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-3" />
              <div className="text-xs text-gray-600">
                {isAbovePace ? 'Above' : 'Below'} pace by ${Math.abs(forecastData.projectedRevenue - forecastData.monthlyGoal).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-gray-600">Goal Progress</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{forecastData.currentProgress}%</div>
            <div className="text-sm text-gray-600">Month Complete</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartForecastBar;
