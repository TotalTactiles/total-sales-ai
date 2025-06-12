
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';

interface AgentFeedbackButtonProps {
  taskId: string;
  initialResponse?: string;
  onFeedbackSubmitted?: () => void;
}

const AgentFeedbackButton: React.FC<AgentFeedbackButtonProps> = ({
  taskId,
  initialResponse,
  onFeedbackSubmitted
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [correction, setCorrection] = useState('');
  const { submitFeedback } = useAgentIntegration();

  const handleRating = (newRating: 'positive' | 'negative') => {
    setRating(newRating);
    if (newRating === 'positive') {
      // Auto-submit positive feedback
      handleSubmitFeedback(newRating);
    } else {
      setShowFeedback(true);
    }
  };

  const handleSubmitFeedback = async (feedbackRating?: 'positive' | 'negative') => {
    const finalRating = feedbackRating || rating;
    if (!finalRating) return;

    try {
      await submitFeedback(taskId, finalRating, correction.trim() || undefined);
      setShowFeedback(false);
      setRating(null);
      setCorrection('');
      onFeedbackSubmitted?.();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  if (rating === 'positive' && !showFeedback) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <ThumbsUp className="h-4 w-4" />
        <span>Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {!showFeedback ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Was this helpful?</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRating('positive')}
            className="text-green-600 hover:text-green-700"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRating('negative')}
            className="text-red-600 hover:text-red-700"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Card className="mt-2">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-sm font-medium">Help us improve this response:</div>
              <Textarea
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                placeholder="What would be a better response? (optional)"
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSubmitFeedback()}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Feedback
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeedback(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentFeedbackButton;
