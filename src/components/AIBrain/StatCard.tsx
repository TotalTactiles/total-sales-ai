
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  isLoading: boolean;
  trend?: {
    value: number | string;
    direction?: 'up' | 'down' | 'neutral';
  };
}

const StatCard = ({ title, value, icon, isLoading, trend }: StatCardProps) => {
  const renderTrendIndicator = () => {
    if (!trend) return null;
    
    const trendClass = 
      trend.direction === 'up' ? 'text-dashGreen' : 
      trend.direction === 'down' ? 'text-dashRed' : 
      'text-muted-foreground';
    
    return (
      <div className={`flex items-center text-xs font-medium mt-1 ${trendClass}`}>
        {trend.direction === 'up' && <ArrowUp className="h-3 w-3 mr-1" />}
        {trend.direction === 'down' && <ArrowDown className="h-3 w-3 mr-1" />}
        {trend.value}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="flex items-center p-4">
        {isLoading ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : (
          <div className="mr-2">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className={`font-bold ${typeof value === 'number' ? 'text-2xl' : 'text-lg'}`}>
            {value}
          </p>
          {renderTrendIndicator()}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
