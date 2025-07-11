
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, AlertTriangle, TrendingUp, Trophy, Calendar } from 'lucide-react';

const ManagerDashboardMetrics = () => {
  const metrics = [
    {
      title: 'Team Revenue',
      value: '$346,249',
      subtitle: '+12% from last month',
      icon: DollarSign,
      bgGradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'AI Risk Alerts',
      value: '2',
      subtitle: 'Requires attention',
      icon: AlertTriangle,
      bgGradient: 'bg-gradient-to-br from-red-50 to-red-100',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      title: 'Pipeline Value',
      value: '$187,500',
      subtitle: 'Expected to close',
      icon: TrendingUp,
      bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Active Rewards',
      value: '3',
      subtitle: 'New incentive running',
      icon: Trophy,
      bgGradient: 'bg-gradient-to-br from-amber-50 to-amber-100',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Month Complete',
      value: '68%',
      subtitle: '3 days remaining',
      icon: Calendar,
      bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card 
            key={index} 
            className={`${metric.bgGradient} ${metric.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <IconComponent className={`h-8 w-8 ${metric.iconColor}`} />
                <div className="w-3 h-3 rounded-full bg-white/50"></div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  {metric.title}
                </p>
                <p className={`text-3xl font-bold ${metric.textColor} leading-tight`}>
                  {metric.value}
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  {metric.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ManagerDashboardMetrics;
