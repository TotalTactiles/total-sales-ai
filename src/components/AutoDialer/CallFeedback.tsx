
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Send } from 'lucide-react';

interface CallFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  callOutcome: string;
  leadName: string;
  onFeedbackSubmit: (feedback: CallFeedbackData) => void;
}

interface CallFeedbackData {
  outcome: string;
  aiRating: number;
  aiHelpfulness: string;
  feedback: string;
  nextSteps: string;
}

const CallFeedback: React.FC<CallFeedbackProps> = ({
  isOpen,
  onClose,
  callOutcome,
  leadName,
  onFeedbackSubmit
}) => {
  const [aiRating, setAiRating] = useState(0);
  const [aiHelpfulness, setAiHelpfulness] = useState('');
  const [feedback, setFeedback] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  const handleSubmit = () => {
    const feedbackData: CallFeedbackData = {
      outcome: callOutcome,
      aiRating,
      aiHelpfulness,
      feedback,
      nextSteps
    };
    
    onFeedbackSubmit(feedbackData);
    onClose();
    
    // Reset form
    setAiRating(0);
    setAiHelpfulness('');
    setFeedback('');
    setNextSteps('');
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'voicemail': return 'bg-yellow-100 text-yellow-800';
      case 'no_answer': return 'bg-red-100 text-red-800';
      case 'busy': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Call Feedback - {leadName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Call Outcome
            </label>
            <Badge className={getOutcomeColor(callOutcome)}>
              {callOutcome.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Rate AI Assistance (1-5 stars)
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setAiRating(star)}
                  className={`p-1 ${star <= aiRating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              AI Helpfulness (optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={aiHelpfulness === 'very_helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAiHelpfulness('very_helpful')}
              >
                Very Helpful
              </Button>
              <Button
                variant={aiHelpfulness === 'somewhat_helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAiHelpfulness('somewhat_helpful')}
              >
                Somewhat Helpful
              </Button>
              <Button
                variant={aiHelpfulness === 'not_helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAiHelpfulness('not_helpful')}
              >
                Not Helpful
              </Button>
              <Button
                variant={aiHelpfulness === 'distracting' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAiHelpfulness('distracting')}
              >
                Distracting
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Additional Feedback
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How can we improve the AI assistance?"
              className="min-h-[80px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Next Steps
            </label>
            <Textarea
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              placeholder="What are the next steps for this lead?"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Skip
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallFeedback;
