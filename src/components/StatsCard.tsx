
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type ColorVariant = 'yellow' | 'green' | 'blue' | 'purple' | 'red' | 'default';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  tooltip?: string;
  chartData?: number[];
  color?: ColorVariant;
}

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon = '📊',
  tooltip,
  chartData = [],
  color = 'default'
}: StatsCardProps) => {
  const changeColorClass = 
    changeType === 'increase' ? 'text-dashGreen' : 
    changeType === 'decrease' ? 'text-dashRed' : 
    'text-muted-foreground';
    
  const changeIcon = 
    changeType === 'increase' ? '↑' : 
    changeType === 'decrease' ? '↓' : 
    '→';
    
  // Calculate the max value for the chart with safeguard against empty arrays
  const maxValue = chartData && chartData.length > 0 ? Math.max(...chartData, 1) : 1;
  
  return (
    <Card className={`stat-card ${color}`}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="dashboard-card-title">{title}</span>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1 text-muted-foreground hover:text-foreground">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="dashboard-card-value">{value}</div>
          {change && (
            <div className={`text-xs font-medium mt-1 ${changeColorClass}`}>
              {changeIcon} {change}
            </div>
          )}
        </div>
        
        {/* Icon */}
        <div className="text-2xl flex-shrink-0">
          {icon}
        </div>
      </div>
      
      {/* Micro Chart */}
      {chartData && chartData.length > 0 && (
        <div className="h-12 flex items-end gap-1 mt-3">
          {chartData.map((data, index) => (
            <div 
              key={index} 
              className={`w-full rounded-t ${
                index === chartData.length - 1 
                  ? color === 'blue' ? 'bg-dashBlue' :
                    color === 'green' ? 'bg-dashGreen' :
                    color === 'yellow' ? 'bg-dashYellow' :
                    color === 'purple' ? 'bg-dashPurple' :
                    color === 'red' ? 'bg-dashRed' : 'bg-primary'
                  : 'bg-muted/60'
              }`}
              style={{ 
                height: `${(data / maxValue) * 100}%`,
                minHeight: '4px'
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
