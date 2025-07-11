
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const MarketingPerformance = () => {
  const channels = [
    {
      name: 'Google Ads',
      leads: '157',
      conversion: '34.2%',
      roas: '$45,000',
      cost: '$8,500',
      trend: 'up',
      trendIcon: TrendingUp,
      progress: 85,
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Meta Ads',
      leads: '203',
      conversion: '18.7%',
      roas: '$38,000',
      cost: '$12,000',
      trend: 'down',
      trendIcon: TrendingDown,
      progress: 65,
      bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
      borderColor: 'border-pink-200'
    },
    {
      name: 'LinkedIn',
      leads: '89',
      conversion: '31.5%',
      roas: '$67,000',
      cost: '$15,000',
      trend: 'up',
      trendIcon: TrendingUp,
      progress: 92,
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200'
    },
    {
      name: 'Referrals',
      leads: '45',
      conversion: '68.9%',
      roas: '$125,000',
      cost: '$2,500',
      trend: 'up',
      trendIcon: TrendingUp,
      progress: 98,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Marketing & Sales Performance</h2>
          <p className="text-slate-600 mt-1">Channel performance and ROI analysis</p>
        </div>
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
          <DollarSign className="h-5 w-5" />
          <span className="font-semibold">All Sources Active</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {channels.map((channel, index) => {
          const TrendIcon = channel.trendIcon;
          return (
            <Card 
              key={index} 
              className={`${channel.bgColor} ${channel.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {channel.name}
                  </CardTitle>
                  <TrendIcon 
                    className={`h-6 w-6 ${
                      channel.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`} 
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Leads</p>
                    <p className="text-2xl font-bold text-slate-900">{channel.leads}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Conv. Rate</p>
                    <p className="text-2xl font-bold text-slate-900">{channel.conversion}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-600">ROAS</span>
                    <span className="font-bold text-slate-900">{channel.roas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-600">Ad Spend</span>
                    <span className="font-semibold text-slate-700">{channel.cost}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-600">Performance</span>
                    <span className="font-bold text-slate-900">{channel.progress}%</span>
                  </div>
                  <Progress value={channel.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MarketingPerformance;
