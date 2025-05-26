
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, PhoneCall, Mail, Calendar, Target } from 'lucide-react';

interface RecommendedAction {
  id: string;
  description: string;
  suggestedTime: string;
  urgency: 'high' | 'medium' | 'low';
  type: 'call' | 'email' | 'meeting' | 'follow-up';
  impact: 'high' | 'medium' | 'low';
}

interface AIRecommendedActionsProps {
  actions: RecommendedAction[];
  onActionClick: (actionId: string) => void;
  isFullUser: boolean;
}

const AIRecommendedActions: React.FC<AIRecommendedActionsProps> = ({ 
  actions, 
  onActionClick, 
  isFullUser 
}) => {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call': return PhoneCall;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'follow-up': return Target;
      default: return Target;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Card className={`w-full ${isFullUser ? 'border-2 border-gradient-to-r from-green-400 to-blue-500' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>{isFullUser ? 'AI-Recommended Actions' : 'Suggested Tasks'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.slice(0, 4).map((action) => {
          const IconComponent = getActionIcon(action.type);
          return (
            <div
              key={action.id}
              className={`p-4 rounded-lg border-l-4 ${getImpactColor(action.impact)} bg-muted/30 hover:bg-muted/50 transition-colors`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{action.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getUrgencyColor(action.urgency)} variant="outline">
                      {action.urgency} priority
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Suggested: {action.suggestedTime}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onActionClick(action.id)}
                  className="ml-3"
                >
                  Start
                </Button>
              </div>
            </div>
          );
        })}
        
        {actions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No recommended actions at the moment.</p>
            <p className="text-sm">
              {isFullUser ? 
                'AI is analyzing your data to provide personalized recommendations.' :
                'Check back later for suggested tasks.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendedActions;
