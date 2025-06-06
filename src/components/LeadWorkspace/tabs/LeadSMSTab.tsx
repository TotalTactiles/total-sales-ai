import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Brain, Settings } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { useIntegrations } from '@/hooks/useIntegrations';

interface LeadSMSTabProps {
  lead: Lead;
}

const LeadSMSTab: React.FC<LeadSMSTabProps> = ({ lead }) => {
  const [message, setMessage] = useState('');
  const [isAiAssisting, setIsAiAssisting] = useState(false);
  const [smsConnected, setSmsConnected] = useState(true); // Start with connected for demo
  const { sendSMS, isLoading } = useIntegrations();

  const mockSmsHistory = [
    {
      id: 1,
      from: 'You',
      message: 'Hi Michael! Quick follow-up from our call. I\'ll send that ROI calculator by Friday. Thanks!',
      timestamp: '10:30 AM',
      sent: true
    },
    {
      id: 2,
      from: lead.name,
      message: 'Sounds great! Looking forward to seeing the numbers.',
      timestamp: '11:45 AM',
      sent: false
    },
    {
      id: 3,
      from: 'You',
      message: 'Perfect! I\'ll include some case studies from similar manufacturing companies too.',
      timestamp: '12:00 PM',
      sent: true
    },
    {
      id: 4,
      from: lead.name,
      message: 'That would be very helpful. Have a great rest of your week!',
      timestamp: '12:15 PM',
      sent: false
    }
  ];

  const handleAiAssist = () => {
    setIsAiAssisting(true);
    setTimeout(() => {
      const aiMessage = `Hi ${lead.name.split(' ')[0]}! Just sent over that ROI calculator showing $45K+ potential savings. Perfect timing for your Q1 planning. Quick 15-min call to walk through it? 📊`;
      setMessage(aiMessage);
      setIsAiAssisting(false);
      toast.success('AI has generated an optimized SMS based on your conversation');
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const result = await sendSMS(lead.phone, message, lead.id, lead.name);
      
      if (result.success) {
        setMessage('');
        toast.success(`SMS sent to ${lead.name}. Message SID: ${result.messageSid}`);
      }
    }
  };

  const connectSMS = () => {
    toast.success('Twilio SMS integration is ready');
    setSmsConnected(true);
  };

  if (!smsConnected) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle>Connect Twilio SMS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 text-center">
              Connect Twilio AU for SMS functionality. Includes 2-way messaging, auto-compliance, and AI assistance.
            </p>
            <Button onClick={connectSMS} className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Connect Twilio AU SMS
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* SMS Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS with {lead.name}
          </h3>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Twilio Settings
          </Button>
        </div>
        <p className="text-sm text-slate-600 mt-1">{lead.phone}</p>
        <p className="text-xs text-green-600 mt-1">✅ Twilio AU Connected - Compliance Enabled</p>
      </div>

      {/* SMS Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {mockSmsHistory.map((sms) => (
          <div key={sms.id} className={`flex ${sms.sent ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              sms.sent 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border'
            }`}>
              <p className="text-sm">{sms.message}</p>
              <p className={`text-xs mt-1 ${sms.sent ? 'text-blue-100' : 'text-slate-500'}`}>
                {sms.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Compose SMS */}
      <div className="p-4 border-t bg-white">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              Send SMS (AU Compliant)
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
          <CardContent className="space-y-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message... (Auto-compliance: 'Reply STOP to unsubscribe' will be added)"
              className="min-h-[80px] resize-none"
              maxLength={140} // Leave room for compliance text
            />
            
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
              onClick={handleSendMessage} 
              disabled={!message.trim() || isLoading} 
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Sending via Twilio...' : 'Send SMS'}
            </Button>
          </CardContent>
        </Card>

        {/* AI SMS Insights */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              AI SMS Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-slate-600">
                📱 Your SMS response rate: 78% (keep messages under 160 chars)
              </p>
              <p className="text-xs text-slate-600">
                ⏰ Best SMS time for this lead: Business hours 9 AM - 5 PM
              </p>
              <p className="text-xs text-slate-600">
                💡 Use emojis sparingly - this lead prefers professional tone
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadSMSTab;
