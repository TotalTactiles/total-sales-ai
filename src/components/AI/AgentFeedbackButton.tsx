
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { agentOrchestrator } from '@/services/agents/AgentOrchestrator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AgentFeedbackButtonProps {
  taskId: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const AgentFeedbackButton: React.FC<AgentFeedbackButtonProps> = ({
  taskId,
  size = 'sm',
  className
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);

  const handleSubmitFeedback = async () => {
    if (!user?.id || !rating) return;

    try {
      await agentOrchestrator.submitFeedback(
        user.id,
        taskId,
        rating,
        feedback || undefined
      );

      toast.success('Feedback submitted - AI will learn from this');
      setIsOpen(false);
      setFeedback('');
      setRating(null);
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  const handleQuickFeedback = async (quickRating: 'positive' | 'negative') => {
    if (!user?.id) return;

    try {
      await agentOrchestrator.submitFeedback(user.id, taskId, quickRating);
      toast.success(`${quickRating === 'positive' ? 'Positive' : 'Negative'} feedback recorded`);
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size={size}
        onClick={() => handleQuickFeedback('positive')}
        className="text-green-600 hover:text-green-700"
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size={size}
        onClick={() => handleQuickFeedback('negative')}
        className="text-red-600 hover:text-red-700"
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size={size} className="text-blue-600 hover:text-blue-700">
            <MessageSquare className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <div className="text-sm font-medium">Provide detailed feedback</div>
            
            <div className="flex gap-2">
              <Button
                variant={rating === 'positive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRating('positive')}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                Good
              </Button>
              <Button
                variant={rating === 'negative' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRating('negative')}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                Needs work
              </Button>
            </div>

            <Textarea
              placeholder="What should the AI do differently next time?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-20"
            />

            <Button
              onClick={handleSubmitFeedback}
              disabled={!rating}
              size="sm"
              className="w-full"
            >
              Submit Feedback
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AgentFeedbackButton;
