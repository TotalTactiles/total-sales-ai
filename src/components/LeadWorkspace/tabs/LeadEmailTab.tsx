
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Mail, Paperclip, Settings } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface LeadEmailTabProps {
  lead: Lead;
}

const LeadEmailTab: React.FC<LeadEmailTabProps> = ({ lead }) => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [emailConnected, setEmailConnected] = useState(false);

  const mockEmailThreads = [
    {
      id: 1,
      subject: 'RE: Software Solution Discussion',
      from: lead.email,
      to: 'you@company.com',
      timestamp: '2 hours ago',
      preview: 'Thanks for the pricing info. Could you also send the ROI calculator you mentioned?',
      isRead: true,
      direction: 'received'
    },
    {
      id: 2,
      subject: 'Software Solution Discussion',
      from: 'you@company.com',
      to: lead.email,
      timestamp: '1 day ago',
      preview: 'Hi Michael, following up on our call. Attached is the pricing breakdown...',
      isRead: true,
      direction: 'sent'
    },
    {
      id: 3,
      subject: 'Great to connect!',
      from: lead.email,
      to: 'you@company.com',
      timestamp: '3 days ago',
      preview: 'Thanks for reaching out. I\'d love to learn more about your solution...',
      isRead: true,
      direction: 'received'
    }
  ];

  const handleAiAssist = () => {
    setIsAiAssisting(true);
    setTimeout(() => {
      setEmailSubject('ROI Calculator - Potential $45K+ Annual Savings');
      setEmailBody(`Hi ${lead.name.split(' ')[0]},

Thanks for your interest in the ROI calculator! Based on our conversation about your current manual processes taking 20+ hours per week, I've prepared a customized analysis.

Here are the key potential savings for ${lead.company}:
• Time savings: 18 hours/week = $23,400 annually
• Error reduction: 15% fewer mistakes = $12,600 savings
• Efficiency gains: 25% faster processing = $9,200 value

Total potential ROI: $45,200+ in year one

I'd love to walk you through these numbers personally. Are you available for a 15-minute call this week to discuss how this applies specifically to your operations?

Best regards,
[Your name]

P.S. Similar manufacturing companies typically see ROI within 3-4 months of implementation.`);
      setIsAiAssisting(false);
      toast.success('AI has generated a personalized email based on your conversation history');
    }, 2000);
  };

  const handleSendEmail = () => {
    if (emailSubject.trim() && emailBody.trim()) {
      toast.success(`Email sent to ${lead.name}`);
      setEmailSubject('');
      setEmailBody('');
    }
  };

  const connectEmail = () => {
    toast.success('Email integration setup started');
    setEmailConnected(true);
  };

  if (!emailConnected) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Connect Your Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 text-center">
              Connect Gmail or Outlook to view email threads and send AI-powered responses directly from here.
            </p>
            <div className="space-y-2">
              <Button onClick={connectEmail} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Connect Gmail
              </Button>
              <Button onClick={connectEmail} variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Connect Outlook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Email Threads */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-2">Email Threads</h3>
          <Button variant="outline" size="sm" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Email Settings
          </Button>
        </div>
        
        <div className="space-y-2 p-4">
          {mockEmailThreads.map((email) => (
            <div key={email.id} className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate">{email.subject}</span>
                <Badge variant={email.direction === 'received' ? 'default' : 'secondary'} className="text-xs">
                  {email.direction === 'received' ? '📨' : '📤'}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mb-1">
                {email.direction === 'received' ? 'From' : 'To'}: {email.direction === 'received' ? email.from : email.to}
              </div>
              <p className="text-xs text-slate-600 truncate">{email.preview}</p>
              <span className="text-xs text-slate-400">{email.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compose Email */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Compose Email to {lead.name}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAiAssist}
                disabled={isAiAssisting}
              >
                <Brain className="h-4 w-4 mr-2" />
                {isAiAssisting ? 'AI Thinking...' : 'AI Assist'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                className="mt-1 min-h-[300px]"
              />
            </div>

            {isAiAssisting && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
                  <span className="text-sm text-blue-700">AI is crafting a personalized email based on your conversation history and industry best practices...</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSendEmail} disabled={!emailSubject.trim() || !emailBody.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline">
                <Paperclip className="h-4 w-4 mr-2" />
                Attach File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Email Suggestions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              AI Email Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-slate-600">
                🎯 Response rate increases 34% when mentioning specific ROI numbers
              </p>
              <p className="text-xs text-slate-600">
                📈 Best send time for {lead.company}: Tuesday-Thursday, 10 AM - 2 PM
              </p>
              <p className="text-xs text-slate-600">
                💡 Manufacturing companies respond well to concrete time savings examples
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadEmailTab;
