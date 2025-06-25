
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, TrendingUp, Brain, ChevronUp, ChevronDown } from 'lucide-react';

const AICoachDock: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      icon: Mic,
      label: 'Review Last Call',
      action: () => console.log('Review call'),
      color: 'bg-green-500'
    },
    {
      icon: TrendingUp,
      label: 'Show My Patterns',
      action: () => console.log('Show patterns'),
      color: 'bg-blue-500'
    },
    {
      icon: Brain,
      label: 'Ask Strategy',
      action: () => console.log('Ask strategy'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-3">
          {isExpanded && (
            <div className="mb-3 space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={action.action}
                >
                  <div className={`p-1 rounded ${action.color}`}>
                    <action.icon className="h-3 w-3 text-white" />
                  </div>
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          
          <Button
            variant="default"
            size="sm"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Brain className="h-4 w-4 mr-2" />
            AI Coach
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 ml-2" />
            ) : (
              <ChevronUp className="h-4 w-4 ml-2" />
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICoachDock;
