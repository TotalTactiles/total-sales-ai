
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Brain, 
  Sparkles, 
  Bold, 
  Italic, 
  List, 
  Link, 
  Image as ImageIcon,
  Paperclip,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';

interface LeadCommsEnhancedProps {
  lead: Lead;
  aiDelegationMode: boolean;
  isSensitive: boolean;
  rationaleMode: boolean;
}

const LeadCommsEnhanced: React.FC<LeadCommsEnhancedProps> = ({
  lead,
  aiDelegationMode,
  isSensitive,
  rationaleMode
}) => {
  const [activeTab, setActiveTab] = useState('email');
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [ccEmails, setCcEmails] = useState('');
  const [bccEmails, setBccEmails] = useState('');
  const [smsContent, setSmsContent] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Mock email history data
  const emailHistory = [
    {
      id: '1',
      subject: 'Follow-up on Product Demo',
      content: 'Hi Sarah, Thank you for taking the time to review our product demo yesterday. I wanted to follow up and see if you have any questions about the features we discussed...',
      timestamp: '2 days ago',
      type: 'sent',
      hasReply: true
    },
    {
      id: '2',
      subject: 'RE: Follow-up on Product Demo',
      content: 'Hi John, Thanks for following up. The demo was very impressive. We are particularly interested in the automation features you mentioned...',
      timestamp: '1 day ago',
      type: 'received',
      isReply: true
    },
    {
      id: '3',
      subject: 'Pricing Information Request',
      content: 'Hi Sarah, As requested, I\'ve attached our pricing information for the Enterprise package. This includes all the automation features we discussed...',
      timestamp: '3 days ago',
      type: 'sent',
      hasReply: false
    }
  ];

  // Mock SMS history data
  const smsHistory = [
    {
      id: '1',
      content: 'Hi Sarah, just wanted to confirm our meeting tomorrow at 2 PM. Looking forward to discussing your automation needs!',
      timestamp: '1 hour ago',
      type: 'sent'
    },
    {
      id: '2',
      content: 'Yes, confirmed! See you at 2 PM tomorrow. Thanks!',
      timestamp: '45 minutes ago',
      type: 'received'
    },
    {
      id: '3',
      content: 'Quick question - do you have the ROI calculator we discussed? Would be helpful for tomorrow\'s meeting.',
      timestamp: '2 hours ago',
      type: 'sent'
    }
  ];

  const handleAIAssist = async (type: 'email' | 'sms') => {
    setIsGeneratingAI(true);
    
    // Simulate AI generation
    setTimeout(() => {
      if (type === 'email') {
        const aiEmail = `Hi ${lead.name.split(' ')[0]},

I hope this email finds you well. Following up on our recent conversation about ${lead.company}'s automation needs.

Based on your current engagement score of ${lead.score}% and your interest in our enterprise solutions, I believe we can help you achieve significant ROI through our automation platform.

Key benefits for ${lead.company}:
• Reduce manual processes by 70%
• Increase lead conversion by 45%
• Save 15+ hours per week on repetitive tasks

Would you be available for a 20-minute call this week to discuss implementation timelines and next steps?

Best regards,
John Smith
Senior Sales Representative`;
        
        setEmailContent(aiEmail);
        setEmailSubject(`Follow-up: Automation Solutions for ${lead.company}`);
      } else {
        const aiSMS = `Hi ${lead.name.split(' ')[0]}! Hope you're doing well. Quick follow-up on our automation discussion - would you be free for a brief call this week to explore next steps? The ROI potential for ${lead.company} looks very promising! 📈`;
        setSmsContent(aiSMS);
      }
      setIsGeneratingAI(false);
      toast.success(`AI-generated ${type} content is ready!`);
    }, 2000);
  };

  const handleAIFix = async (type: 'email' | 'sms') => {
    const content = type === 'email' ? emailContent : smsContent;
    if (!content.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    setIsGeneratingAI(true);
    
    // Simulate AI improvement
    setTimeout(() => {
      if (type === 'email') {
        const improvedEmail = emailContent
          .replace(/Hi /g, 'Hello ')
          .replace(/Thanks/g, 'Thank you')
          .replace(/Best regards/g, 'Best regards')
          + '\n\nP.S. I\'ve attached our latest case study showing 200% ROI increase for similar companies in your industry.';
        setEmailContent(improvedEmail);
      } else {
        const improvedSMS = smsContent
          .replace(/Hi /g, 'Hello ')
          .replace(/!/g, '! 👋')
          .replace(/\?/g, '? 🤔');
        setSmsContent(improvedSMS);
      }
      setIsGeneratingAI(false);
      toast.success(`Content improved with AI suggestions!`);
    }, 1500);
  };

  const handleSend = (type: 'email' | 'sms') => {
    const content = type === 'email' ? emailContent : smsContent;
    if (!content.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    // Simulate sending
    toast.success(`${type === 'email' ? 'Email' : 'SMS'} sent successfully!`);
    
    if (type === 'email') {
      setEmailContent('');
      setEmailSubject('');
      setCcEmails('');
      setBccEmails('');
    } else {
      setSmsContent('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4 py-2 shrink-0">
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
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="email" className="h-full m-0 p-4 space-y-4">
            {/* Email History */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Email History</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 max-h-60 overflow-y-auto">
                {emailHistory.map((email) => (
                  <div key={email.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={email.type === 'sent' ? 'default' : 'secondary'}>
                          {email.type === 'sent' ? 'Sent' : 'Received'}
                        </Badge>
                        {email.hasReply && (
                          <Badge variant="outline" className="text-green-600">
                            Reply Received
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{email.timestamp}</span>
                    </div>
                    <h4 className="font-medium text-sm">{email.subject}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{email.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Email Compose */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Compose Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* To Field */}
                <div>
                  <label className="text-xs font-medium text-gray-700">To:</label>
                  <Input 
                    value={lead.email || ''} 
                    className="mt-1" 
                    disabled 
                  />
                </div>

                {/* CC/BCC Fields */}
                <div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-xs"
                  >
                    {showCcBcc ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                    CC/BCC
                  </Button>
                  {showCcBcc && (
                    <div className="space-y-2 mt-2">
                      <div>
                        <label className="text-xs font-medium text-gray-700">CC:</label>
                        <Input 
                          value={ccEmails} 
                          onChange={(e) => setCcEmails(e.target.value)}
                          placeholder="cc@example.com"
                          className="mt-1" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700">BCC:</label>
                        <Input 
                          value={bccEmails} 
                          onChange={(e) => setBccEmails(e.target.value)}
                          placeholder="bcc@example.com"
                          className="mt-1" 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-medium text-gray-700">Subject:</label>
                  <Input 
                    value={emailSubject} 
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject..."
                    className="mt-1" 
                  />
                </div>

                {/* Text Toolbar */}
                <div className="flex items-center gap-2 border-b pb-2">
                  <Button variant="ghost" size="sm">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>

                {/* Email Content */}
                <Textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Write your email here..."
                  className="min-h-[200px] resize-none"
                />

                {/* AI Tools */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAssist('email')}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIFix('email')}
                    disabled={isGeneratingAI || !emailContent.trim()}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Fix
                  </Button>
                </div>

                {/* Send Button */}
                <Button 
                  onClick={() => handleSend('email')}
                  className="w-full"
                  disabled={!emailContent.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="h-full m-0 p-4 space-y-4">
            {/* SMS History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">SMS History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {smsHistory.map((sms) => (
                    <div 
                      key={sms.id} 
                      className={`flex ${sms.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        sms.type === 'sent' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{sms.content}</p>
                        <p className={`text-xs mt-1 ${
                          sms.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {sms.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SMS Compose */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Send SMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* To Field */}
                <div>
                  <label className="text-xs font-medium text-gray-700">To:</label>
                  <Input 
                    value={lead.phone || ''} 
                    className="mt-1" 
                    disabled 
                  />
                </div>

                {/* SMS Content */}
                <div>
                  <Textarea
                    value={smsContent}
                    onChange={(e) => setSmsContent(e.target.value)}
                    placeholder="Write your message here..."
                    className="min-h-[120px] resize-none"
                    maxLength={160}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {smsContent.length}/160 characters
                    </span>
                  </div>
                </div>

                {/* AI Tools */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAssist('sms')}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIFix('sms')}
                    disabled={isGeneratingAI || !smsContent.trim()}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Fix
                  </Button>
                </div>

                {/* Send Button */}
                <Button 
                  onClick={() => handleSend('sms')}
                  className="w-full"
                  disabled={!smsContent.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send SMS
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default LeadCommsEnhanced;
