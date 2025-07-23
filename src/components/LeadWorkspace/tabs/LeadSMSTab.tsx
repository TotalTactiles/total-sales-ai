
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import SMSComposer from '../../Communications/SMSComposer';

interface LeadSMSTabProps {
  lead: Lead;
}

const LeadSMSTab: React.FC<LeadSMSTabProps> = ({ lead }) => {
  const [smsConnected, setSmsConnected] = useState(true); // Start with connected for demo

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

  const handleSendSMS = async (message: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('unified-communication', {
      body: {
        type: 'sms',
        leadId: lead.id,
        userId: user.user.id,
        companyId: lead.companyId,
        content: message,
        metadata: {
          phone: lead.phone
        }
      }
    });

    if (error) throw error;
    return data;
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
        <SMSComposer
          lead={lead}
          onSend={handleSendSMS}
        />
      </div>
    </div>
  );
};

export default LeadSMSTab;
