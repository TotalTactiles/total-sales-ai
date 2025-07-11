
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';

const BusinessOperationsInsights = () => {
  const insights = [
    {
      title: 'Revenue Trends',
      value: '+15.2%',
      subtitle: 'vs last month',
      bgGradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      icon: '📈'
    },
    {
      title: 'Top Objective',
      value: 'Price 34%',
      subtitle: 'Budget concerns',
      bgGradient: 'bg-gradient-to-br from-red-500 to-red-600',
      icon: '🎯'
    },
    {
      title: 'Response Speed',
      value: '2.8 days',
      subtitle: '20% faster than last month',
      bgGradient: 'bg-gradient-to-br from-amber-500 to-amber-600',
      icon: '⚡'
    },
    {
      title: 'Alert Heatmap',
      value: '12 Active',
      subtitle: 'High priority items',
      bgGradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: '🔔'
    },
    {
      title: 'Goal Progress',
      value: '78%',
      subtitle: 'of quarterly target',
      bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: '🏆'
    },
    {
      title: 'Activity Volume',
      value: '247',
      subtitle: 'calls this week',
      bgGradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      icon: '📞'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Lightbulb className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Business Operations Insights</h2>
                <p className="text-indigo-100 mt-1">AI-powered insights aligned with your business goals</p>
              </div>
            </div>
            <Button variant="secondary" size="lg" className="text-indigo-600 font-semibold">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <Card 
            key={index} 
            className={`${insight.bgGradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{insight.icon}</span>
                <TrendingUp className="h-5 w-5 opacity-80" />
              </div>
              <h3 className="font-bold text-lg mb-2">{insight.title}</h3>
              <p className="text-3xl font-bold mb-2 leading-tight">{insight.value}</p>
              <p className="text-sm opacity-90 font-medium">{insight.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessOperationsInsights;
