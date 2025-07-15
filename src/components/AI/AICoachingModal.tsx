
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Play, X } from 'lucide-react';

interface AICoachingModalProps {
  isOpen: boolean;
  onClose: () => void;
  coaching: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    daysActive?: number;
  };
  onAction: (action: 'start' | 'schedule' | 'remind' | 'dismiss') => void;
}

const AICoachingModal: React.FC<AICoachingModalProps> = ({
  isOpen,
  onClose,
  coaching,
  onAction
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (action: 'start' | 'schedule' | 'remind' | 'dismiss') => {
    onAction(action);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>AI Sales Coaching</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900">{coaching.title}</h3>
              {coaching.daysActive && (
                <Badge variant="outline" className="text-orange-600">
                  {coaching.daysActive} days active
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-blue-800 mb-3">{coaching.description}</p>
            
            <div className="flex items-center gap-2 text-xs">
              <Badge className={getDifficultyColor(coaching.difficulty)}>
                {coaching.difficulty}
              </Badge>
              <span className="text-gray-600">Category: {coaching.category}</span>
              <span className="text-gray-600">Est. time: {coaching.estimatedTime}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleAction('start')}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Now
            </Button>
            
            <Button
              onClick={() => handleAction('schedule')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Calendar className="h-4 w-4" />
              Add to Calendar
            </Button>
            
            <Button
              onClick={() => handleAction('remind')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Clock className="h-4 w-4" />
              Remind Me Later
            </Button>
            
            <Button
              onClick={() => handleAction('dismiss')}
              variant="ghost"
              size="sm"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AICoachingModal;
