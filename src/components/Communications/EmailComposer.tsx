
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Mail, Paperclip, X } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface EmailComposerProps {
  lead: Lead;
  isModal?: boolean;
  onClose?: () => void;
  onSend?: (subject: string, body: string) => Promise<void>;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ 
  lead, 
  isModal = false, 
  onClose, 
  onSend 
}) => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAiAssist = () => {
    setIsAiAssisting(true);
    setTimeout(() => {
      setEmailSubject('Follow-up from our call');
      setEmailBody(`Hi ${lead.name.split(' ')[0]},

Thank you for taking the time to speak with me today. I wanted to follow up on our conversation and provide you with the information we discussed.

Based on our call, I understand that you're looking for solutions to help with [specific pain point discussed]. I believe our platform can provide significant value for ${lead.company}.

Next steps:
- I'll send over the detailed proposal by [date]
- We can schedule a follow-up call to discuss any questions
- I'm happy to arrange a demo for your team

Please let me know if you have any immediate questions or if there's anything else I can help you with.

Best regards,
[Your name]`);
      setIsAiAssisting(false);
      toast.success('AI has generated a personalized follow-up email based on your call');
    }, 2000);
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    
    setIsLoading(true);
    try {
      if (onSend) {
        await onSend(emailSubject, emailBody);
      }
      setEmailSubject('');
      setEmailBody('');
      toast.success(`Email sent to ${lead.name}`);
      if (onClose) onClose();
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <span className="font-semibold">Email to {lead.name}</span>
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
        <label className="text-sm font-medium">To:</label>
        <Input value={lead.email} disabled className="mt-1" />
      </div>
      
      <div>
        <label className="text-sm font-medium">Subject:</label>
        <Input
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          placeholder="Enter email subject..."
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Message:</label>
        <Textarea
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          placeholder="Write your email message..."
          className="mt-1 min-h-[200px]"
        />
      </div>

      {isAiAssisting && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-700">AI is crafting a personalized follow-up email...</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          onClick={handleSendEmail} 
          disabled={!emailSubject.trim() || !emailBody.trim() || isLoading}
        >
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? 'Sending...' : 'Send Email'}
        </Button>
        <Button variant="outline">
          <Paperclip className="h-4 w-4 mr-2" />
          Attach File
        </Button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Compose Email</CardTitle>
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
        <CardTitle>Compose Email</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default EmailComposer;
