
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';

interface AgentFeedbackButtonProps {
  taskId: string;
  size?: 'sm' | 'default';
}

const AgentFeedbackButton: React.FC<AgentFeedbackButtonProps> = ({ 
  taskId, 
  size = 'sm' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [correction, setCorrection] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const { submitFeedback } = useAgentIntegration();

  const handleFeedback = async (rating: 'positive' | 'negative') => {
    await submitFeedback(taskId, rating, correction || undefined);
    setFeedbackGiven(rating);
    setIsOpen(false);
    setCorrection('');
  };

  if (feedbackGiven) {
    return (
      <Button 
        variant="ghost" 
        size={size}
        className="text-green-600"
        disabled
      >
        {feedbackGiven === 'positive' ? <ThumbsUp className="h-3 w-3" /> : <ThumbsDown className="h-3 w-3" />}
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={size}>
          <MessageSquare className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div className="text-sm font-medium">How was this AI response?</div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback('positive')}
              className="flex-1"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Good
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback('negative')}
              className="flex-1"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Needs Work
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">
              Suggest improvements (optional):
            </label>
            <Textarea
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              placeholder="What would make this response better?"
              className="text-xs"
              rows={3}
            />
          </div>

          <Button
            size="sm"
            onClick={() => handleFeedback('negative')}
            className="w-full"
            disabled={!correction.trim()}
          >
            Submit Feedback
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AgentFeedbackButton;
