
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Brain, Clock } from 'lucide-react';

interface AIInsightCardProps {
  insight: {
    id: string;
    type: string;
    suggestion_text: string;
    triggered_by: string;
    timestamp: string;
    accepted: boolean | null;
    context: any;
  };
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, onAccept, onDismiss }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature_suggestion': return 'bg-blue-100 text-blue-800';
      case 'nudge': return 'bg-yellow-100 text-yellow-800';
      case 'friction_flag': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium">AI Insight</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getTypeColor(insight.type)}>
              {insight.type.replace('_', ' ')}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTimestamp(insight.timestamp)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-4">
          {insight.suggestion_text}
        </p>
        
        <div className="text-xs text-muted-foreground mb-3">
          Triggered by: <span className="font-medium">{insight.triggered_by}</span>
        </div>
        
        {insight.accepted === null && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onAccept(insight.id)}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDismiss(insight.id)}
              className="flex items-center gap-1"
            >
              <XCircle className="h-3 w-3" />
              Dismiss
            </Button>
          </div>
        )}
        
        {insight.accepted === true && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        )}
        
        {insight.accepted === false && (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            <XCircle className="h-3 w-3 mr-1" />
            Dismissed
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;
