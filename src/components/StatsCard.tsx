
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
}

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon = '📊'
}: StatsCardProps) => {
  const changeColorClass = 
    changeType === 'increase' ? 'text-salesGreen' : 
    changeType === 'decrease' ? 'text-salesRed' : 
    'text-slate-500';
    
  const changeIcon = 
    changeType === 'increase' ? '↑' : 
    changeType === 'decrease' ? '↓' : 
    '→';
    
  return (
    <Card>
      <CardContent className="p-5 flex items-center">
        <div className="mr-4 rounded-full p-3 bg-slate-100 text-lg">
          {icon}
        </div>
        <div>
          <div className="text-slate-500 text-sm font-medium">{title}</div>
          <div className="font-bold text-2xl text-salesBlue">{value}</div>
          {change && (
            <div className={`text-xs font-medium ${changeColorClass}`}>
              {changeIcon} {change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
