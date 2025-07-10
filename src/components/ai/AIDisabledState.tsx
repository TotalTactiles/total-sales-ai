
// AI Disabled State Component
import React from 'react';
import { Brain, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AIDisabledStateProps {
  feature: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AIDisabledState: React.FC<AIDisabledStateProps> = ({ 
  feature, 
  message = 'AI temporarily paused',
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-4 text-sm',
    lg: 'p-6 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Card className="border-dashed border-gray-300 bg-gray-50">
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Brain className={`${iconSizes[size]} opacity-50`} />
          <Pause className={`${iconSizes[size]} opacity-50`} />
          <span className="font-medium">{message}</span>
        </div>
        <div className="text-xs text-gray-400 text-center mt-1">
          {feature} ready for activation
        </div>
      </CardContent>
    </Card>
  );
};

export default AIDisabledState;
