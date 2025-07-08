import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Brain,
  Lightbulb,
  Copy,
  RefreshCw,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import UsageTracker from '@/components/AIBrain/UsageTracker';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

interface LeadCommsProps {
  lead: Lead;
  aiDelegationMode: boolean;
  isSensitive: boolean;
  rationaleMode: boolean;
}

const LeadComms: React.FC<LeadCommsProps> = ({
  lead,
  aiDelegationMode,
  isSensitive,
  rationaleMode
}) => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeCommsType, setActiveCommsType] = useState('email');

  const { trackEvent, trackClick } = useUsageTracking();
  const { logGhostIntent } = useAIBrainInsights();

  const aiSuggestions = {
    email: {
      subject: `Quick ROI question for ${lead.company}`,
      body: `Hi ${lead.name.split(' ')[0]},

I noticed you downloaded our pricing guide last week. Based on ${lead.company}'s size and industry, I calculated you could save approximately $45,000 annually with our solution.

I'd love to show you exactly how in a quick 15-minute call this week. Would Thursday at 2 PM work for you?

Best regards,
Sam`,
      reasoning: 'Personal approach with specific ROI figure works well for construction companies',
      alternatives: [
        {
          tone: 'more casual',
          subject: `${lead.name.split(' ')[0]} - thought you'd find this interesting`,
          reasoning: 'Casual tone can break through formal email noise'
        },
        {
          tone: 'urgency-focused',
          subject: `Last chance: Q1 implementation for ${lead.company}`,
          reasoning: 'Creates urgency for Q1 budget considerations'
        }
      ]
    },
    sms: {
      message: `Hi ${lead.name.split(' ')[0]}! Quick follow-up on the pricing info you requested. Mind if I send you a personalized ROI breakdown for ${lead.company}? Takes 2 minutes to review. - Sam`,
      reasoning: 'SMS works well for construction industry - brief and direct',
      alternatives: [
        {
          tone: 'question-based',
          message: `${lead.name.split(' ')[0]}, what's the biggest challenge you're facing with your current setup?`,
          reasoning: 'Questions generate higher response rates'
        }
      ]
    }
  };

  const handleAIAssist = async () => {
    setIsGeneratingAI(true);
    setShowAIAssist(true);
    
    trackClick('ai_assist', `${activeCommsType}_composition`);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGeneratingAI(false);
      
      if (activeCommsType === 'email') {
        setEmailSubject(aiSuggestions.email.subject);
        setEmailBody(aiSuggestions.email.body);
      } else {
        setSmsMessage(aiSuggestions.sms.message);
      }
      
      trackEvent({
        feature: 'ai_assist_generation',
        action: 'complete',
        context: `${activeCommsType}_composition`,
        metadata: { leadId: lead.id, aiGenerated: true }
      });
    }, 2000);
  };

  const handleUseAISuggestion = (type: 'primary' | 'alternative', index?: number) => {
    trackClick('ai_suggestion_use', `${activeCommsType}_${type}`);
    
    if (type === 'primary') {
      if (activeCommsType === 'email') {
        setEmailSubject(aiSuggestions.email.subject);
        setEmailBody(aiSuggestions.email.body);
      } else {
        setSmsMessage(aiSuggestions.sms.message);
      }
    } else if (index !== undefined) {
      const alt = aiSuggestions[activeCommsType as keyof typeof aiSuggestions].alternatives[index];
      if (activeCommsType === 'email' && 'subject' in alt) {
        setEmailSubject(alt.subject);
      } else if (activeCommsType === 'sms' && 'message' in alt) {
        setSmsMessage(alt.message);
      }
    }
    
    toast.success('AI suggestion applied to your message');
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }

    if (isSensitive) {
      toast.info('Email draft saved for your review (Sensitive mode)');
      trackEvent({
        feature: 'email_send',
        action: 'draft_saved',
        context: 'sensitive_lead',
        metadata: { leadId: lead.id, requiresApproval: true }
      });
      return;
    }

    trackEvent({
      feature: 'email_send',
      action: 'sent',
      context: 'lead_comms',
      metadata: { 
        leadId: lead.id, 
        aiAssisted: showAIAssist,
        subjectLength: emailSubject.length,
        bodyLength: emailBody.length
      }
    });

    toast.success(`Email sent to ${lead.name}!`);
    setEmailSubject('');
    setEmailBody('');
  };

  const handleSendSMS = async () => {
    if (!smsMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (isSensitive) {
      toast.info('SMS draft saved for your review (Sensitive mode)');
      trackEvent({
        feature: 'sms_send',
        action: 'draft_saved',
        context: 'sensitive_lead',
        metadata: { leadId: lead.id, requiresApproval: true }
      });
      return;
    }

    trackEvent({
      feature: 'sms_send',
      action: 'sent',
      context: 'lead_comms',
      metadata: { 
        leadId: lead.id, 
        aiAssisted: showAIAssist,
        messageLength: smsMessage.length
      }
    });

    toast.success(`SMS sent to ${lead.name}!`);
    setSmsMessage('');
  };

  // Email/SMS templates
  const templates = {
    email: [
      { name: 'Follow-up ROI', subject: 'ROI Analysis for {company}', body: 'Hi {name}, I calculated potential savings...' },
      { name: 'Demo Request', subject: 'Quick Demo for {company}', body: 'Hi {name}, would you like to see our solution in action?' },
      { name: 'Case Study', subject: 'How {similar_company} Saved 40%', body: 'Hi {name}, thought you\'d find this relevant...' }
    ],
    sms: [
      { name: 'Quick Check-in', message: 'Hi {name}! Quick follow-up on our conversation. Any questions?' },
      { name: 'ROI Offer', message: 'Hi {name}! I have your ROI breakdown ready. 2-min review?' },
      { name: 'Demo Invite', message: 'Hi {name}! Free to chat about your project this week?' }
    ]
  };

  // Mock message history
  const messageHistory = [
    { type: 'email', date: '2024-01-15', sender: 'You', recipient: lead.name, subject: 'Initial Outreach', body: 'Hi James, I wanted to reach out regarding...' },
    { type: 'email', date: '2024-01-14', sender: lead.name, recipient: 'You', subject: 'Re: Initial Outreach', body: 'Thanks for reaching out. I\'d like to learn more...' },
    { type: 'sms', date: '2024-01-13', sender: 'You', recipient: lead.name, body: 'Quick follow-up from our call yesterday.' },
    { type: 'sms', date: '2024-01-13', sender: lead.name, recipient: 'You', body: 'Perfect timing! Let\'s set up that demo.' }
  ];

  const insertTemplate = (template: any) => {
    if (activeCommsType === 'email') {
      setEmailSubject(template.subject.replace('{company}', lead.company).replace('{name}', lead.name.split(' ')[0]));
      setEmailBody(template.body.replace('{company}', lead.company).replace('{name}', lead.name.split(' ')[0]));
    } else {
      setSmsMessage(template.message.replace('{name}', lead.name.split(' ')[0]));
    }
    toast.success('Template inserted and personalized');
  };

  return (
    <div className="p-4 h-full overflow-y-auto text-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Communications</h3>
        {aiDelegationMode && (
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            <Brain className="h-3 w-3 mr-1" />
            AI Managing
          </Badge>
        )}
      </div>

      <Tabs value={activeCommsType} onValueChange={setActiveCommsType} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-8">
          <TabsTrigger value="email" className="text-xs">
            <Mail className="h-3 w-3 mr-1" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            SMS
          </TabsTrigger>
        </TabsList>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-3">
          {/* Quick Templates */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {templates.email.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate(template)}
                    className="text-xs h-7"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>Compose Email</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* handleAIAssist */}}
                  disabled={isGeneratingAI}
                  className="h-7 text-xs"
                >
                  <Brain className="h-3 w-3 mr-1" />
                  {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium">To:</label>
                <Input value={`${lead.name} <${lead.email}>`} disabled className="mt-1 h-8 text-xs" />
              </div>
              
              <div>
                <label className="text-xs font-medium">Subject:</label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="mt-1 h-8 text-xs"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Message:</label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Compose your email..."
                  className="mt-1 min-h-[120px] text-xs"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  Characters: {emailBody.length} | Words: {emailBody.split(' ').length}
                </div>
                <Button onClick={() => {/* handleSendEmail */}} disabled={aiDelegationMode} className="h-8 text-xs">
                  <Send className="h-3 w-3 mr-1" />
                  {isSensitive ? 'Save Draft' : 'Send Email'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms" className="space-y-3">
          {/* Quick SMS Templates */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick SMS Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {templates.sms.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate(template)}
                    className="text-xs h-7"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>Send SMS</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* handleAIAssist */}}
                  disabled={isGeneratingAI}
                  className="h-7 text-xs"
                >
                  <Brain className="h-3 w-3 mr-1" />
                  {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium">To:</label>
                <Input value={`${lead.name} (${lead.phone})`} disabled className="mt-1 h-8 text-xs" />
              </div>
              
              <div>
                <label className="text-xs font-medium">Message:</label>
                <Textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type your SMS message..."
                  className="mt-1 text-xs"
                  maxLength={160}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-slate-500">
                    {smsMessage.length}/160 characters
                  </span>
                  <span className="text-xs text-slate-500">
                    {Math.ceil(smsMessage.length / 160)} SMS{smsMessage.length > 160 ? 's' : ''}
                  </span>
                </div>
              </div>

              <Button onClick={() => {/* handleSendSMS */}} disabled={aiDelegationMode} className="w-full h-8 text-xs">
                <Send className="h-3 w-3 mr-1" />
                {isSensitive ? 'Save Draft' : 'Send SMS'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sensitive Mode Notice */}
      {isSensitive && (
        <Card className="border-red-200 bg-red-50 mt-4">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-red-700">
              <Shield className="h-3 w-3" />
              <span className="font-medium text-xs">Sensitive Lead Mode Active</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              All messages will be saved as drafts for your review before sending.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Message History */}
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {messageHistory.map((msg, index) => (
              <div key={index} className="border rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={msg.type === 'email' ? 'default' : 'secondary'} className="text-xs">
                      {msg.type === 'email' ? <Mail className="h-2 w-2 mr-1" /> : <MessageSquare className="h-2 w-2 mr-1" />}
                      {msg.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-500">{msg.date}</span>
                  </div>
                  <span className="text-xs font-medium">{msg.sender} → {msg.recipient}</span>
                </div>
                {msg.type === 'email' && (
                  <div className="text-xs font-medium mb-1">Subject: {(msg as any).subject}</div>
                )}
                <div className="text-xs text-slate-600">{msg.type === 'email' ? (msg as any).body : msg.body}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Delegation Notice */}
      {aiDelegationMode && (
        <Card className="border-blue-200 bg-blue-50 mt-4">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-blue-700">
              <Zap className="h-3 w-3" />
              <span className="font-medium text-xs">AI is Managing Communications</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              The AI assistant is actively handling outreach for this lead. Manual sending is disabled.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadComms;
