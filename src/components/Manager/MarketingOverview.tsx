
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, MousePointer, DollarSign } from 'lucide-react';

const MarketingOverview: React.FC = () => {
  const marketingData = [
    {
      title: 'Social Media',
      value: '2.4K',
      change: '+12% this week',
      changeType: 'positive' as const,
      icon: Users,
      iconColor: 'text-blue-600'
    },
    {
      title: 'PPC Campaigns',
      value: '$1,247',
      change: 'ROAS: 3.2x',
      changeType: 'positive' as const,
      icon: MousePointer,
      iconColor: 'text-green-600'
    },
    {
      title: 'Email Marketing',
      value: '847',
      change: '28% open rate',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconColor: 'text-purple-600'
    },
    {
      title: 'Ad Spend',
      value: '$3,420',
      change: 'Under budget',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconColor: 'text-orange-600'
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Marketing Overview</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active Campaigns
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketingData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">{item.title}</p>
                  <p className="text-xl font-bold text-slate-900 mb-1">{item.value}</p>
                  <p className={`text-xs ${getChangeColor(item.changeType)}`}>
                    {item.change}
                  </p>
                </div>
                <div className={`p-2 rounded-full bg-white ${item.iconColor}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingOverview;
