
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

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Communications</h3>
        {aiDelegationMode && (
          <Badge className="bg-blue-100 text-blue-800">
            <Brain className="h-3 w-3 mr-1" />
            AI Managing
          </Badge>
        )}
      </div>

      <Tabs value={activeCommsType} onValueChange={setActiveCommsType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </TabsTrigger>
        </TabsList>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Compose Email</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAIAssist}
                  disabled={isGeneratingAI}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">To:</label>
                <Input value={`${lead.name} <${lead.email}>`} disabled className="mt-1" />
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
                  placeholder="Compose your email..."
                  className="mt-1 min-h-[200px]"
                />
              </div>

              <div className="flex justify-between">
                <div className="text-xs text-slate-500">
                  Characters: {emailBody.length} | Words: {emailBody.split(' ').length}
                </div>
                <Button onClick={handleSendEmail} disabled={aiDelegationMode}>
                  <Send className="h-4 w-4 mr-1" />
                  {isSensitive ? 'Save Draft' : 'Send Email'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions for Email */}
          {showAIAssist && activeCommsType === 'email' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Lightbulb className="h-5 w-5" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Primary Suggestion */}
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Recommended Draft</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseAISuggestion('primary')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Use This
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Subject:</strong> {aiSuggestions.email.subject}</div>
                    <div><strong>Body:</strong></div>
                    <div className="bg-slate-50 p-2 rounded text-xs whitespace-pre-line">
                      {aiSuggestions.email.body}
                    </div>
                  </div>
                  {rationaleMode && (
                    <div className="mt-3 text-xs text-blue-600 italic">
                      💡 {aiSuggestions.email.reasoning}
                    </div>
                  )}
                </div>

                {/* Alternative Suggestions */}
                <div className="space-y-2">
                  <span className="font-medium text-sm">Alternative Approaches:</span>
                  {aiSuggestions.email.alternatives.map((alt, index) => (
                    <div key={index} className="bg-white border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{alt.tone}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUseAISuggestion('alternative', index)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                      <div className="text-xs text-slate-600">{alt.subject}</div>
                      {rationaleMode && (
                        <div className="mt-1 text-xs text-blue-600 italic">💡 {alt.reasoning}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Send SMS</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAIAssist}
                  disabled={isGeneratingAI}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">To:</label>
                <Input value={`${lead.name} (${lead.phone})`} disabled className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Message:</label>
                <Textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type your SMS message..."
                  className="mt-1"
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

              <Button onClick={handleSendSMS} disabled={aiDelegationMode} className="w-full">
                <Send className="h-4 w-4 mr-1" />
                {isSensitive ? 'Save Draft' : 'Send SMS'}
              </Button>
            </CardContent>
          </Card>

          {/* AI Suggestions for SMS */}
          {showAIAssist && activeCommsType === 'sms' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Lightbulb className="h-5 w-5" />
                  AI SMS Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Recommended Message</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseAISuggestion('primary')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Use This
                    </Button>
                  </div>
                  <div className="text-sm bg-slate-50 p-2 rounded">
                    {aiSuggestions.sms.message}
                  </div>
                  {rationaleMode && (
                    <div className="mt-2 text-xs text-blue-600 italic">
                      💡 {aiSuggestions.sms.reasoning}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Sensitive Mode Notice */}
      {isSensitive && (
        <Card className="border-red-200 bg-red-50 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Sensitive Lead Mode Active</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              All messages will be saved as drafts for your review before sending.
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI Delegation Notice */}
      {aiDelegationMode && (
        <Card className="border-blue-200 bg-blue-50 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Zap className="h-4 w-4" />
              <span className="font-medium">AI is Managing Communications</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              The AI assistant is actively handling outreach for this lead. Manual sending is disabled.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadComms;
