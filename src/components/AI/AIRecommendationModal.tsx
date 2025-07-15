
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Calendar, Clock, X } from 'lucide-react';

interface AIRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: {
    id: string;
    title: string;
    description: string;
    leadName?: string;
    urgency: 'high' | 'medium' | 'low';
  };
  onAction: (action: 'call' | 'email' | 'schedule' | 'remind' | 'dismiss') => void;
}

const AIRecommendationModal: React.FC<AIRecommendationModalProps> = ({
  isOpen,
  onClose,
  recommendation,
  onAction
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleAction = (action: 'call' | 'email' | 'schedule' | 'remind' | 'dismiss') => {
    onAction(action);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>AI Recommendation</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className={`p-3 rounded-lg ${getUrgencyColor(recommendation.urgency)}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{recommendation.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                {recommendation.urgency} priority
              </span>
            </div>
            <p className="text-sm">{recommendation.description}</p>
            {recommendation.leadName && (
              <p className="text-xs mt-2 opacity-75">Lead: {recommendation.leadName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleAction('call')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </Button>
            
            <Button
              onClick={() => handleAction('email')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
            
            <Button
              onClick={() => handleAction('schedule')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            
            <Button
              onClick={() => handleAction('remind')}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Clock className="h-4 w-4" />
              Remind Later
            </Button>
          </div>

          <div className="flex justify-between pt-4 border-t">
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

export default AIRecommendationModal;
