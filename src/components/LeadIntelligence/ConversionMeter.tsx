
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ConversionMeterProps {
  likelihood: number;
  reasoning: string;
}

const ConversionMeter: React.FC<ConversionMeterProps> = ({ likelihood, reasoning }) => {
  const getColorClass = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (value: number) => {
    if (value >= 70) return TrendingUp;
    if (value >= 40) return Minus;
    return TrendingDown;
  };

  const TrendIcon = getTrendIcon(likelihood);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendIcon className={`h-4 w-4 ${getColorClass(likelihood)}`} />
            <span className="text-sm font-medium text-slate-700">Conversion Likelihood</span>
          </div>
          <div className={`text-2xl font-bold ${getColorClass(likelihood)}`}>
            {likelihood}%
          </div>
        </div>
        
        <Progress 
          value={likelihood} 
          className="mb-3"
        />
        
        <div className="text-center">
          <Badge 
            variant="outline" 
            className={`text-xs ${
              likelihood >= 70 ? 'bg-green-50 text-green-700 border-green-200' :
              likelihood >= 40 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {likelihood >= 70 ? 'High' : likelihood >= 40 ? 'Medium' : 'Low'} Confidence
          </Badge>
        </div>
        
        <p className="text-xs text-slate-600 mt-3 text-center">
          {reasoning}
        </p>
      </CardContent>
    </Card>
  );
};

export default ConversionMeter;
