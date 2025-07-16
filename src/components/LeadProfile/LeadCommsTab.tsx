
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Paperclip, 
  Bot, 
  Wand2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface LeadCommsTabProps {
  lead: Lead;
  aiDelegationMode: boolean;
  onUpdate: (field: string, value: any) => void;
}

interface EmailThread {
  id: string;
  subject: string;
  from: string;
  to: string;
  timestamp: string;
  preview: string;
  body: string;
  direction: 'sent' | 'received';
  thread: Array<{
    id: string;
    from: string;
    to: string;
    timestamp: string;
    body: string;
    direction: 'sent' | 'received';
  }>;
}

interface SMSMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  direction: 'sent' | 'received';
}

const LeadCommsTab: React.FC<LeadCommsTabProps> = ({ lead, aiDelegationMode, onUpdate }) => {
  const [emailDraft, setEmailDraft] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [smsDraft, setSmsDraft] = useState('');
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Mock email threads
  const mockEmailThreads: EmailThread[] = [
    {
      id: '1',
      subject: 'Re: Pricing Information Request',
      from: lead.email,
      to: 'you@company.com',
      timestamp: '2 hours ago',
      preview: 'Thanks for the detailed pricing breakdown. I have a few follow-up questions...',
      body: 'Thanks for the detailed pricing breakdown. I have a few follow-up questions about the implementation timeline and ongoing support costs.',
      direction: 'received',
      thread: [
        {
          id: '1a',
          from: 'you@company.com',
          to: lead.email,
          timestamp: '1 day ago',
          body: 'Hi John, Thanks for your interest in our solution. Please find attached the detailed pricing breakdown you requested.',
          direction: 'sent'
        },
        {
          id: '1b',
          from: lead.email,
          to: 'you@company.com',
          timestamp: '2 hours ago',
          body: 'Thanks for the detailed pricing breakdown. I have a few follow-up questions about the implementation timeline and ongoing support costs.',
          direction: 'received'
        }
      ]
    },
    {
      id: '2',
      subject: 'Demo Schedule Confirmation',
      from: 'you@company.com',
      to: lead.email,
      timestamp: '1 week ago',
      preview: 'Confirming our demo session for tomorrow at 2 PM EST...',
      body: 'Confirming our demo session for tomorrow at 2 PM EST. Looking forward to showing you our platform.',
      direction: 'sent',
      thread: [
        {
          id: '2a',
          from: 'you@company.com',
          to: lead.email,
          timestamp: '1 week ago',
          body: 'Confirming our demo session for tomorrow at 2 PM EST. Looking forward to showing you our platform.',
          direction: 'sent'
        }
      ]
    }
  ];

  // Mock SMS messages
  const mockSMSMessages: SMSMessage[] = [
    {
      id: '1',
      from: lead.phone,
      to: '+1234567890',
      message: 'Sounds great! Looking forward to seeing the numbers.',
      timestamp: '11:45 AM',
      direction: 'received'
    },
    {
      id: '2',
      from: '+1234567890',
      to: lead.phone,
      message: 'Hi John, just sent over the ROI calculator. Let me know your thoughts!',
      timestamp: 'Yesterday 3:30 PM',
      direction: 'sent'
    }
  ];

  const toggleEmailThread = (emailId: string) => {
    const newExpanded = new Set(expandedEmails);
    if (newExpanded.has(emailId)) {
      newExpanded.delete(emailId);
    } else {
      newExpanded.add(emailId);
    }
    setExpandedEmails(newExpanded);
  };

  const handleAIAssist = async (type: 'email' | 'sms') => {
    setIsGeneratingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (type === 'email') {
        const aiEmailDraft = `Hi ${lead.name},\n\nI hope this email finds you well. Based on our previous conversations about ${lead.company}'s needs, I wanted to follow up on the proposal we discussed.\n\nGiven your interest in automation and efficiency improvements, I believe our solution could deliver significant ROI for your team. Would you be available for a brief call this week to discuss the next steps?\n\nBest regards,\nYour Sales Rep`;
        setEmailDraft(aiEmailDraft);
        setEmailSubject(`Follow-up: ${lead.company} Solution Discussion`);
      } else {
        const aiSMSDraft = `Hi ${lead.name}! Just wanted to follow up on our conversation about ${lead.company}'s automation needs. When would be a good time to discuss next steps?`;
        setSmsDraft(aiSMSDraft);
      }
      
      toast.success(`AI has generated a ${type} draft for you`);
    } catch (error) {
      toast.error(`Failed to generate AI ${type}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAIFix = async (type: 'email' | 'sms') => {
    const currentDraft = type === 'email' ? emailDraft : smsDraft;
    if (!currentDraft.trim()) {
      toast.error('Please write a draft first');
      return;
    }

    setIsGeneratingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (type === 'email') {
        const improvedDraft = currentDraft
          .replace(/\bhope this finds you well\b/gi, 'trust you\'re doing well')
          .replace(/\bwanted to follow up\b/gi, 'following up')
          .replace(/\bwould you be available\b/gi, 'are you free')
          + '\n\nP.S. Happy to share some quick wins we\'ve achieved with similar companies if that would be helpful.';
        setEmailDraft(improvedDraft);
      } else {
        const improvedSMS = currentDraft
          .replace(/\bHi\b/g, 'Hey')
          .replace(/\bwould be\b/gi, 'works')
          .slice(0, 150) + '? 📅';
        setSmsDraft(improvedSMS);
      }
      
      toast.success(`AI has improved your ${type} draft`);
    } catch (error) {
      toast.error(`Failed to improve ${type}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSendEmail = () => {
    if (!emailDraft.trim() || !emailSubject.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }
    toast.success('Email sent successfully');
    setEmailDraft('');
    setEmailSubject('');
  };

  const handleSendSMS = () => {
    if (!smsDraft.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success('SMS sent successfully');
    setSmsDraft('');
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS
          </TabsTrigger>
        </TabsList>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          {/* Email History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockEmailThreads.map((email) => (
                <div key={email.id} className="border border-gray-200 rounded-lg">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleEmailThread(email.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={email.direction === 'sent' ? 'default' : 'secondary'}>
                          {email.direction === 'sent' ? 'Sent' : 'Received'}
                        </Badge>
                        <span className="font-medium">{email.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{email.timestamp}</span>
                        {expandedEmails.has(email.id) ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{email.preview}</p>
                  </div>
                  
                  {expandedEmails.has(email.id) && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-4 space-y-4">
                        <h4 className="font-medium text-gray-900">Full Thread</h4>
                        {email.thread.map((message, index) => (
                          <div key={message.id} className="bg-white rounded-lg p-3 border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={message.direction === 'sent' ? 'default' : 'secondary'} className="text-xs">
                                  {message.direction === 'sent' ? 'Sent' : 'Received'}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {message.direction === 'sent' ? 'You' : lead.name}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700">{message.body}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Email Compose */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compose Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  placeholder="Write your email..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleSendEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                
                <Button variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleAIAssist('email')}
                  disabled={isGeneratingAI}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleAIFix('email')}
                  disabled={isGeneratingAI || !emailDraft.trim()}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Fix
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms" className="space-y-6">
          {/* SMS History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SMS History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockSMSMessages.map((sms) => (
                <div 
                  key={sms.id} 
                  className={`flex ${sms.direction === 'sent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    sms.direction === 'sent' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">{sms.message}</p>
                    <p className={`text-xs mt-1 ${
                      sms.direction === 'sent' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {sms.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SMS Compose */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send SMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea
                  value={smsDraft}
                  onChange={(e) => setSmsDraft(e.target.value)}
                  placeholder="Write your SMS message..."
                  className="min-h-[100px]"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {smsDraft.length}/160 characters
                </p>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleSendSMS}>
                  <Send className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleAIAssist('sms')}
                  disabled={isGeneratingAI}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleAIFix('sms')}
                  disabled={isGeneratingAI || !smsDraft.trim()}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Fix
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadCommsTab;
