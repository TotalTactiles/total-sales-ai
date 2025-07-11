
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const MonthlyForecast = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Monthly Forecast</CardTitle>
        <p className="text-sm text-gray-600">Progress to Goal</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">$0</span>
            <div className="text-right">
              <div className="text-sm text-green-600 font-medium">+12%</div>
              <div className="text-xs text-gray-500">above pace</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>68% Month Complete</span>
              <span>100% Goal Progress</span>
            </div>
            <Progress value={68} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$425,000 Achieved</span>
              <span>$600,000 Target</span>
            </div>
          </div>
          
          <div className="text-right text-xs text-gray-400">
            Allows pace for $25,000
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyForecast;
