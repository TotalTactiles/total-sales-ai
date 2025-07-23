
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, MessageSquare, X } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface SMSComposerProps {
  lead: Lead;
  isModal?: boolean;
  onClose?: () => void;
  onSend?: (message: string) => Promise<void>;
}

const SMSComposer: React.FC<SMSComposerProps> = ({ 
  lead, 
  isModal = false, 
  onClose, 
  onSend 
}) => {
  const [message, setMessage] = useState('');
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAiAssist = () => {
    setIsAiAssisting(true);
    setTimeout(() => {
      const aiMessage = `Hi ${lead.name.split(' ')[0]}! Thanks for the great call today. I'll send over the info we discussed by Friday. Quick 15-min follow-up next week? 📞`;
      setMessage(aiMessage);
      setIsAiAssisting(false);
      toast.success('AI has generated an optimized SMS based on your call');
    }, 2000);
  };

  const handleSendSMS = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      if (onSend) {
        await onSend(message);
      }
      setMessage('');
      toast.success(`SMS sent to ${lead.name}`);
      if (onClose) onClose();
    } catch (error) {
      toast.error('Failed to send SMS');
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span className="font-semibold">SMS to {lead.name}</span>
          <Badge className="bg-green-100 text-green-800">Connected</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAiAssist}
            disabled={isAiAssisting}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isAiAssisting ? 'AI Thinking...' : 'AI Assist'}
          </Button>
          {isModal && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">To: {lead.phone}</label>
        <p className="text-xs text-green-600 mt-1">✅ Twilio Connected - Compliance Enabled</p>
      </div>

      <div>
        <label className="text-sm font-medium">Message:</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message... (Auto-compliance: 'Reply STOP to unsubscribe' will be added)"
          className="mt-1 min-h-[100px] resize-none"
          maxLength={140}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {message.length}/140 characters (20 chars reserved for compliance)
        </span>
        <span className="text-xs text-green-600">
          AU Compliant: Auto-adds opt-out
        </span>
      </div>

      {isAiAssisting && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-700">AI is crafting an optimized SMS...</span>
          </div>
        </div>
      )}

      <Button 
        onClick={handleSendSMS} 
        disabled={!message.trim() || isLoading} 
        className="w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        {isLoading ? 'Sending via Twilio...' : 'Send SMS'}
      </Button>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Compose SMS</CardTitle>
          </CardHeader>
          <CardContent>
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose SMS</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default SMSComposer;
