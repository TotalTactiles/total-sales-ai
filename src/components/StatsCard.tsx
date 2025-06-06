
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";

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
  tooltip,
  chartData = [],
  color = 'default'
}: StatsCardProps) => {
  const changeColorClass = 
    changeType === 'increase' ? 'text-emerald-600' : 
    changeType === 'decrease' ? 'text-red-600' : 
    'text-slate-500';
    
  const ChangeIcon = 
    changeType === 'increase' ? TrendingUp : 
    changeType === 'decrease' ? TrendingDown : 
    Minus;
    
  // Calculate the max value for the chart with safeguard against empty arrays
  const maxValue = chartData && chartData.length > 0 ? Math.max(...chartData, 1) : 1;
  
  return (
    <Card className="p-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</span>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Info className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="text-xl font-semibold text-slate-900 leading-none mt-1">{value}</div>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${changeColorClass}`}>
              <ChangeIcon className="h-3 w-3" />
              {change}
            </div>
          )}
        </div>
      </div>
      
      {/* Micro Chart */}
      {chartData && chartData.length > 0 && (
        <div className="h-8 flex items-end gap-0.5 mt-3">
          {chartData.map((data, index) => (
            <div 
              key={index} 
              className={`w-full rounded-sm ${
                index === chartData.length - 1 
                  ? color === 'blue' ? 'bg-blue-500' :
                    color === 'green' ? 'bg-emerald-500' :
                    color === 'yellow' ? 'bg-amber-500' :
                    color === 'purple' ? 'bg-purple-500' :
                    color === 'red' ? 'bg-red-500' : 'bg-slate-900'
                  : 'bg-slate-200'
              }`}
              style={{ 
                height: `${(data / maxValue) * 100}%`,
                minHeight: '2px'
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
