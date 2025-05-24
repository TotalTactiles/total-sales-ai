
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb, BookOpen, Target, TrendingUp } from 'lucide-react';
import { AISuggestion } from '../hooks/useAISuggestions';

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onAction: (suggestion: AISuggestion) => void;
  onDismiss: (suggestionId: string) => void;
}

const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
  suggestion,
  onAction,
  onDismiss
}) => {
  const getSuggestionColor = (type: string, priority: string) => {
    if (priority === 'critical') return 'border-red-500 bg-red-50';
    if (priority === 'high') return 'border-orange-500 bg-orange-50';
    if (type === 'opportunity') return 'border-green-500 bg-green-50';
    if (type === 'learning') return 'border-purple-500 bg-purple-50';
    if (type === 'coaching') return 'border-blue-500 bg-blue-50';
    if (type === 'tip') return 'border-cyan-500 bg-cyan-50';
    return 'border-slate-300 bg-slate-50';
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'learning': return <BookOpen className="h-4 w-4 text-purple-600" />;
      case 'coaching': return <Target className="h-4 w-4 text-blue-600" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'tip': return <Lightbulb className="h-4 w-4 text-orange-600" />;
      default: return <Lightbulb className="h-4 w-4 text-orange-600" />;
    }
  };

  return (
    <Card className={`${getSuggestionColor(suggestion.type, suggestion.priority)} border-l-4 shadow-lg`}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getSuggestionIcon(suggestion.type)}
            <span className="text-sm font-medium">{suggestion.title}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDismiss(suggestion.id)}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-sm text-gray-700 mb-2">{suggestion.message}</p>
        {suggestion.action && (
          <Button 
            size="sm" 
            onClick={() => onAction(suggestion)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Accept
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AISuggestionCard;
