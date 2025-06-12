
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';
import { toast } from 'sonner';

export interface AgentFeedbackButtonProps {
  taskId: string;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const AgentFeedbackButton: React.FC<AgentFeedbackButtonProps> = ({ 
  taskId, 
  variant = 'outline',
  className = ''
}) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const { submitFeedback } = useAgentIntegration();

  const handleFeedback = async (rating: 'positive' | 'negative') => {
    try {
      await submitFeedback(taskId, rating);
      setFeedback(rating);
      toast.success('Feedback submitted successfully');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  if (feedback) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        {feedback === 'positive' ? (
          <>
            <ThumbsUp className="h-4 w-4 text-green-500" />
            <span>Thank you for your feedback!</span>
          </>
        ) : (
          <>
            <ThumbsDown className="h-4 w-4 text-red-500" />
            <span>Feedback received</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={variant}
        size="sm"
        onClick={() => handleFeedback('positive')}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant={variant}
        size="sm"
        onClick={() => handleFeedback('negative')}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AgentFeedbackButton;
