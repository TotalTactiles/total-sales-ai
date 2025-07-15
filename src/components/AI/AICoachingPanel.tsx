
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, Target, MessageSquare, X } from 'lucide-react';

interface AICoachingPanelProps {
  onCoachingClick?: (coaching: any) => void;
}

const AICoachingPanel: React.FC<AICoachingPanelProps> = ({ onCoachingClick }) => {
  const coachingTasks = [
    {
      id: '1',
      title: 'Handling Price Objections',
      description: 'Master the art of turning price concerns into value conversations',
      category: 'objection_handling',
      difficulty: 'intermediate' as const,
      estimatedTime: '15 min',
      daysActive: 2,
      type: 'training'
    },
    {
      id: '2',
      title: 'Discovery Call Framework',
      description: 'Structured approach to uncovering customer pain points',
      category: 'discovery',
      difficulty: 'beginner' as const,
      estimatedTime: '20 min',
      daysActive: 0,
      type: 'framework'
    },
    {
      id: '3',
      title: 'Closing Techniques',
      description: 'Advanced strategies for converting qualified leads',
      category: 'closing',
      difficulty: 'advanced' as const,
      estimatedTime: '25 min',
      daysActive: 5,
      type: 'technique'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training': return BookOpen;
      case 'framework': return Target;
      case 'technique': return MessageSquare;
      default: return Brain;
    }
  };

  const handleCoachingClick = (coaching: any) => {
    if (onCoachingClick) {
      onCoachingClick(coaching);
    }
  };

  const handleDismiss = (e: React.MouseEvent, coachingId: string) => {
    e.stopPropagation();
    console.log('Dismissing coaching:', coachingId);
    // Log dismissal to TSAM
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Sales Coaching
          <Badge variant="secondary" className="ml-auto">
            {coachingTasks.length} tasks
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {coachingTasks.map((coaching) => {
          const IconComponent = getTypeIcon(coaching.type);
          return (
            <div
              key={coaching.id}
              onClick={() => handleCoachingClick(coaching)}
              className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-50/50 hover:bg-purple-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">{coaching.title}</span>
                    {coaching.daysActive > 0 && (
                      <Badge variant="outline" className="text-orange-600 text-xs">
                        {coaching.daysActive} days in coaching
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-purple-800 mb-2">{coaching.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(coaching.difficulty)} variant="outline">
                      {coaching.difficulty}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {coaching.estimatedTime} • {coaching.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Button size="sm" variant="outline">
                    Start
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={(e) => handleDismiss(e, coaching.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        
        {coachingTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No coaching tasks at the moment.</p>
            <p className="text-sm">Great job on completing your training!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICoachingPanel;
