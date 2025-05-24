
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PhoneCall, Trophy, Zap, Heart } from 'lucide-react';

interface KPICardsProps {
  userStats: {
    call_count: number;
    win_count: number;
    current_streak: number;
    mood_score: number | null;
  } | null;
  isFullUser: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({ userStats, isFullUser }) => {
  const kpis = [
    {
      label: 'Total Calls',
      value: userStats?.call_count?.toString() || '0',
      change: '+8%',
      trend: 'up',
      icon: PhoneCall
    },
    {
      label: 'Wins',
      value: userStats?.win_count?.toString() || '0',
      change: '+23%',
      trend: 'up',
      icon: Trophy
    },
    {
      label: 'Current Streak',
      value: userStats?.current_streak?.toString() || '0',
      change: 'Personal best!',
      trend: 'up',
      icon: Zap
    },
    {
      label: 'Energy Level',
      value: `${userStats?.mood_score || 70}%`,
      change: 'Optimized',
      trend: 'up',
      icon: Heart
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => {
        const IconComponent = kpi.icon;
        return (
          <Card key={index} className={isFullUser ? "border-2 border-gradient-to-r from-yellow-400 to-orange-500" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-500 text-sm">{kpi.label}</div>
                  <div className="text-2xl font-bold mt-1">{kpi.value}</div>
                  <div className={`text-xs mt-1 flex items-center ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </div>
                </div>
                <IconComponent className="h-8 w-8 text-salesBlue" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KPICards;
