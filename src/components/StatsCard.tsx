
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  tooltip?: string;
  chartData?: number[];
}

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon = '📊',
  tooltip,
  chartData = []
}: StatsCardProps) => {
  const changeColorClass = 
    changeType === 'increase' ? 'text-salesGreen' : 
    changeType === 'decrease' ? 'text-salesRed' : 
    'text-slate-500';
    
  const changeIcon = 
    changeType === 'increase' ? '↑' : 
    changeType === 'decrease' ? '↓' : 
    '→';
    
  // Calculate the max value for the chart
  const maxValue = Math.max(...chartData);
  
  return (
    <Card className="hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full p-3 bg-slate-100 text-lg">
              {icon}
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                {tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1.5 text-slate-400 hover:text-slate-600">
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="font-bold text-2xl text-salesBlue">{value}</div>
              {change && (
                <div className={`text-xs font-medium ${changeColorClass}`}>
                  {changeIcon} {change}
                </div>
              )}
            </div>
          </div>
          
          {/* Micro Chart */}
          {chartData.length > 0 && (
            <div className="h-16 flex items-end gap-1">
              {chartData.map((data, index) => (
                <div 
                  key={index} 
                  className={`w-1.5 rounded-t ${
                    index === chartData.length - 1 
                      ? 'bg-salesCyan'
                      : 'bg-slate-200'
                  }`}
                  style={{ 
                    height: `${(data / maxValue) * 100}%`,
                    minHeight: '4px'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
