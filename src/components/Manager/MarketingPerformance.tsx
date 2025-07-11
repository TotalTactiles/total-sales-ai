
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketingPerformance = () => {
  const channels = [
    {
      name: 'Google Ads',
      leads: '157',
      conversion: '34.2%',
      roas: '$43,000',
      cost: '$6,500',
      trend: 'up',
      trendIcon: TrendingUp,
      bgColor: 'bg-green-50'
    },
    {
      name: 'Meta Ads',
      leads: '203',
      conversion: '18.7%',
      roas: '$38,000',
      cost: '$12,000',
      trend: 'down',
      trendIcon: TrendingDown,
      bgColor: 'bg-red-50'
    },
    {
      name: 'LinkedIn',
      leads: '89',
      conversion: '31.5%',
      roas: '$67,000',
      cost: '$15,000',
      trend: 'up',
      trendIcon: TrendingUp,
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Referrals',
      leads: '45',
      conversion: '68.9%',
      roas: '$125,000',
      cost: '$2,500',
      trend: 'up',
      trendIcon: TrendingUp,
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Marketing & Sales Performance</h2>
        <div className="text-sm text-gray-500">All Sources</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {channels.map((channel, index) => {
          const TrendIcon = channel.trendIcon;
          return (
            <Card key={index} className={`${channel.bgColor} border-0`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{channel.name}</h3>
                  <TrendIcon className={`h-4 w-4 ${channel.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Leads</span>
                    <span className="text-sm font-bold">{channel.leads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Conversion</span>
                    <span className="text-sm font-bold">{channel.conversion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">ROAS</span>
                    <span className="text-sm font-bold">{channel.roas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Cost</span>
                    <span className="text-sm">{channel.cost}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default MarketingPerformance;
