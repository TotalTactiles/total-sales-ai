
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bot, Sparkles, Send, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { useIntegrations } from '@/hooks/useIntegrations';

interface LeadCommsTabProps {
  lead: Lead;
  aiDelegationMode: boolean;
  onUpdate: (field: string, value: any) => void;
}

interface ThreadMessage {
  id: string;
  type: 'sent' | 'received';
  content: string;
  timestamp: string;
  subject?: string;
}

interface Thread {
  id: string;
  subject: string;
  preview: string;
  timestamp: string;
  type: 'email' | 'sms';
  messages: ThreadMessage[];
}

const LeadCommsTab: React.FC<LeadCommsTabProps> = ({ lead, aiDelegationMode, onUpdate }) => {
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [smsContent, setSmsContent] = useState('');
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [isGeneratingEmailAI, setIsGeneratingEmailAI] = useState(false);
  const [isGeneratingSmsAI, setIsGeneratingSmsAI] = useState(false);
  
  const { sendEmail, sendSMS, isLoading } = useIntegrations();

  // Mock thread data - replace with real data from your backend
  const mockThreads: Thread[] = [
    {
      id: 'email-1',
      type: 'email',
      subject: 'RE: Software Solution Discussion',
      preview: 'Thanks for the pricing info. Could you also send the ROI calculator...',
      timestamp: '2 hours ago',
      messages: [
        {
          id: 'msg-1',
          type: 'sent',
          content: `Hi ${lead.name.split(' ')[0]},\n\nFollowing up on our call. Attached is the pricing breakdown and implementation timeline.\n\nBest regards`,
          timestamp: '1 day ago',
          subject: 'Software Solution Discussion'
        },
        {
          id: 'msg-2',
          type: 'received',
          content: 'Thanks for the pricing info. Could you also send the ROI calculator you mentioned? We\'re evaluating this for Q1 implementation.',
          timestamp: '2 hours ago'
        }
      ]
    },
    {
      id: 'sms-1',
      type: 'sms',
      subject: 'SMS Thread',
      preview: 'Quick follow-up from our call...',
      timestamp: '10:30 AM',
      messages: [
        {
          id: 'sms-msg-1',
          type: 'sent',
          content: 'Hi! Quick follow-up from our call. I\'ll send that ROI calculator by Friday. Thanks!',
          timestamp: '10:30 AM'
        },
        {
          id: 'sms-msg-2',
          type: 'received',
          content: 'Sounds great! Looking forward to seeing the numbers.',
          timestamp: '11:45 AM'
        }
      ]
    }
  ];

  const toggleThread = (threadId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(threadId)) {
      newExpanded.delete(threadId);
    } else {
      newExpanded.add(threadId);
    }
    setExpandedThreads(newExpanded);
  };

  const handleEmailAIAssist = async () => {
    setIsGeneratingEmailAI(true);
    try {
      // Simulate AI generation - replace with actual AI service call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const aiEmailContent = `Hi ${lead.name.split(' ')[0]},\n\nBased on our recent conversation about ${lead.company}'s needs, I wanted to follow up with the ROI calculator showing potential savings of $45K+ annually.\n\nKey benefits for your team:\n• 18 hours/week time savings\n• 15% reduction in errors\n• 25% faster processing\n\nWould you be available for a 15-minute call this week to walk through the numbers?\n\nBest regards`;
      
      setEmailContent(aiEmailContent);
      setEmailSubject(`ROI Analysis - ${lead.company} Opportunity`);
      toast.success('AI has generated an email based on your lead context');
    } catch (error) {
      toast.error('Failed to generate AI content');
    } finally {
      setIsGeneratingEmailAI(false);
    }
  };

  const handleEmailAIFix = async () => {
    if (!emailContent.trim()) return;
    
    setIsGeneratingEmailAI(true);
    try {
      // Simulate AI improvement - replace with actual AI service call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const improvedContent = emailContent
        .replace(/\n\n/g, '\n\n')
        .replace(/Hi /g, `Hi ${lead.name.split(' ')[0]}, `)
        .concat('\n\nP.S. Happy to jump on a quick call if that\'s easier to discuss.');
      
      setEmailContent(improvedContent);
      toast.success('AI has improved your email content');
    } catch (error) {
      toast.error('Failed to improve content');
    } finally {
      setIsGeneratingEmailAI(false);
    }
  };

  const handleSmsAIAssist = async () => {
    setIsGeneratingSmsAI(true);
    try {
      // Simulate AI generation - replace with actual AI service call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const aiSmsContent = `Hi ${lead.name.split(' ')[0]}! ROI calculator ready showing $45K+ savings for ${lead.company}. 15-min call to review? 📊`;
      
      setSmsContent(aiSmsContent);
      toast.success('AI has generated an SMS based on your lead context');
    } catch (error) {
      toast.error('Failed to generate AI content');
    } finally {
      setIsGeneratingSmsAI(false);
    }
  };

  const handleSmsAIFix = async () => {
    if (!smsContent.trim()) return;
    
    setIsGeneratingSmsAI(true);
    try {
      // Simulate AI improvement - replace with actual AI service call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const improvedContent = smsContent
        .replace(/\s+/g, ' ')
        .trim()
        .concat(' 🚀');
      
      setSmsContent(improvedContent);
      toast.success('AI has improved your SMS content');
    } catch (error) {
      toast.error('Failed to improve content');
    } finally {
      setIsGeneratingSmsAI(false);
    }
  };

  const handleSendEmail = async () => {
    if (emailSubject.trim() && emailContent.trim()) {
      const result = await sendEmail(lead.email, emailSubject, emailContent, lead.id, lead.name);
      
      if (result.success) {
        setEmailSubject('');
        setEmailContent('');
        toast.success(`Email sent to ${lead.name}`);
      }
    }
  };

  const handleSendSMS = async () => {
    if (smsContent.trim()) {
      const result = await sendSMS(lead.phone, smsContent, lead.id, lead.name);
      
      if (result.success) {
        setSmsContent('');
        toast.success(`SMS sent to ${lead.name}`);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Communication History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Communication History</h3>
        
        {mockThreads.map((thread) => (
          <Card key={thread.id} className="overflow-hidden">
            <Collapsible 
              open={expandedThreads.has(thread.id)}
              onOpenChange={() => toggleThread(thread.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-50 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {thread.type === 'email' ? (
                        <Mail className="h-4 w-4 text-blue-600" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      )}
                      <div>
                        <h4 className="font-medium text-sm">{thread.subject}</h4>
                        <p className="text-sm text-slate-600 truncate">{thread.preview}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{thread.timestamp}</span>
                      {expandedThreads.has(thread.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-3 border-t pt-3">
                    {thread.messages.map((message) => (
                      <div key={message.id} className={`p-3 rounded-lg ${
                        message.type === 'sent' 
                          ? 'bg-blue-50 border border-blue-200 ml-8' 
                          : 'bg-gray-50 border border-gray-200 mr-8'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={message.type === 'sent' ? 'default' : 'secondary'}>
                            {message.type === 'sent' ? 'Sent' : 'Received'}
                          </Badge>
                          <span className="text-xs text-slate-500">{message.timestamp}</span>
                        </div>
                        {message.subject && (
                          <h5 className="font-medium text-sm mb-1">{message.subject}</h5>
                        )}
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Email Compose */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Compose Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">To:</label>
            <Input value={lead.email} disabled />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Subject:</label>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Enter email subject..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Message:</label>
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Write your email message..."
              className="min-h-[150px]"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleSendEmail} 
              disabled={!emailSubject.trim() || !emailContent.trim() || isLoading}
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Email'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleEmailAIAssist}
              disabled={isGeneratingEmailAI}
            >
              <Bot className="h-4 w-4 mr-2" />
              {isGeneratingEmailAI ? 'Generating...' : 'AI Assist'}
            </Button>
            
            {emailContent.trim() && (
              <Button 
                variant="outline" 
                onClick={handleEmailAIFix}
                disabled={isGeneratingEmailAI}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGeneratingEmailAI ? 'Improving...' : 'AI Fix'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SMS Compose */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Compose SMS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">To:</label>
            <Input value={lead.phone} disabled />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Message:</label>
            <Textarea
              value={smsContent}
              onChange={(e) => setSmsContent(e.target.value)}
              placeholder="Write your SMS message..."
              className="min-h-[100px]"
              maxLength={160}
            />
            <div className="text-xs text-slate-500 mt-1">
              {smsContent.length}/160 characters
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleSendSMS} 
              disabled={!smsContent.trim() || isLoading}
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send SMS'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSmsAIAssist}
              disabled={isGeneratingSmsAI}
            >
              <Bot className="h-4 w-4 mr-2" />
              {isGeneratingSmsAI ? 'Generating...' : 'AI Assist'}
            </Button>
            
            {smsContent.trim() && (
              <Button 
                variant="outline" 
                onClick={handleSmsAIFix}
                disabled={isGeneratingSmsAI}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGeneratingSmsAI ? 'Improving...' : 'AI Fix'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadCommsTab;
