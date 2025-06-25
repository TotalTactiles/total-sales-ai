
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Calendar, TrendingUp, Target } from 'lucide-react';
import { useRepMetrics } from '@/hooks/useRepMetrics';

const RepQuickStats: React.FC = () => {
  const { metrics, loading } = useRepMetrics();

  const stats = [
    {
      icon: Phone,
      label: 'Calls Today',
      value: loading ? '...' : metrics?.calls_made || 0,
      color: 'bg-green-500'
    },
    {
      icon: Calendar,
      label: 'Demos Booked',
      value: loading ? '...' : metrics?.demos_booked || 0,
      color: 'bg-blue-500'
    },
    {
      icon: TrendingUp,
      label: 'Closes',
      value: loading ? '...' : metrics?.closes || 0,
      color: 'bg-purple-500'
    },
    {
      icon: Target,
      label: 'Tone Score',
      value: loading ? '...' : `${Math.round((metrics?.avg_tone_score || 0) * 100)}%`,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RepQuickStats;
