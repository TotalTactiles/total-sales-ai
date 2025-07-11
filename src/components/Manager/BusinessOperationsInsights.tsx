
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

const BusinessOperationsInsights = () => {
  const insights = [
    {
      title: 'Revenue Trends',
      value: '+15.2%',
      subtitle: 'vs last month',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Top Objective',
      value: 'Price 34%',
      subtitle: 'Budget concerns',
      bgColor: 'bg-red-500'
    },
    {
      title: 'Colleague Speed',
      value: '2.8 days',
      subtitle: '20% faster than last time',
      bgColor: 'bg-yellow-500'
    },
    {
      title: 'Alert Heatmap',
      value: '12 Active',
      subtitle: 'High priority',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Goal Progress',
      value: '78%',
      subtitle: 'of target',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Activity Volume',
      value: '$47',
      subtitle: 'calls this week',
      bgColor: 'bg-green-500'
    }
  ];

  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              <span className="text-lg font-semibold">Business Operations Insights</span>
            </div>
            <Button variant="secondary" size="sm" className="text-purple-600">
              Read more
            </Button>
          </div>
          <p className="text-purple-100 mt-2">
            AI-powered insights aligned with your business goals
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {insights.map((insight, index) => (
          <Card key={index} className={`${insight.bgColor} text-white border-0`}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2">{insight.title}</h3>
              <p className="text-2xl font-bold mb-1">{insight.value}</p>
              <p className="text-xs opacity-80">{insight.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default BusinessOperationsInsights;
