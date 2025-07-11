
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, AlertTriangle, TrendingUp, Trophy, Calendar } from 'lucide-react';

const ManagerDashboardMetrics = () => {
  const metrics = [
    {
      title: 'Team Revenue',
      value: '$340,320',
      subtitle: '+12% from last month',
      icon: DollarSign,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    {
      title: 'AI Risk',
      value: '2',
      subtitle: 'Rep needs attention',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      iconColor: 'text-red-600'
    },
    {
      title: 'Pipeline Data',
      value: '+$137,700',
      subtitle: 'Expected this quarter',
      icon: TrendingUp,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Rewards',
      value: '3',
      subtitle: 'Team incentives running',
      icon: Trophy,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Month Complete',
      value: '68%',
      subtitle: '21 days remaining',
      icon: Calendar,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className={`${metric.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ManagerDashboardMetrics;
