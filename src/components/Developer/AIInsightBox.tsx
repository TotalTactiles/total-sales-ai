
import React from 'react';
import { Brain, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  action?: {
    label: string;
    handler: () => void;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface AIInsightBoxProps {
  insight: AIInsight;
  onDismiss?: (id: string) => void;
  onApply?: (id: string) => void;
}

const AIInsightBox: React.FC<AIInsightBoxProps> = ({ insight, onDismiss, onApply }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'error':
        return <X className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'suggestion':
        return <Brain className="h-5 w-5 text-blue-400" />;
      default:
        return <Check className="h-5 w-5 text-green-400" />;
    }
  };

  const getPriorityColor = () => {
    switch (insight.priority) {
      case 'critical':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-blue-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm border-l-4 ${getPriorityColor()} p-4 rounded-r-lg`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
          <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
          
          <div className="flex gap-2">
            {insight.action && (
              <Button
                size="sm"
                onClick={() => onApply?.(insight.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {insight.action.label}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDismiss?.(insight.id)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightBox;
