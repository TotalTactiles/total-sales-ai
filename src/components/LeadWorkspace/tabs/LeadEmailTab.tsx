
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Settings, Link } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import EmailComposer from '../../Communications/EmailComposer';
import { Button } from '@/components/ui/button';

interface LeadEmailTabProps {
  lead: Lead;
}

const LeadEmailTab: React.FC<LeadEmailTabProps> = ({ lead }) => {
  const [emailConnected, setEmailConnected] = useState(true); // Start with connected for demo

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

  const handleSendEmail = async (subject: string, body: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('unified-communication', {
      body: {
        type: 'email',
        leadId: lead.id,
        userId: user.user.id,
        companyId: lead.companyId,
        content: body,
        metadata: {
          subject,
          email: lead.email
        }
      }
    });

    if (error) throw error;
    return data;
  };

  const handleConnectGmail = async () => {
    toast.success('Gmail OAuth window opened. Please authorize the application.');
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
              Connect Gmail via secure OAuth 2.0 to view email threads and send AI-powered responses directly from here.
            </p>
            <div className="space-y-2">
              <Button onClick={handleConnectGmail} className="w-full">
                <Link className="h-4 w-4 mr-2" />
                Connect Gmail (OAuth)
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Mail className="h-4 w-4 mr-2" />
                Connect Outlook (Coming Soon)
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
        <EmailComposer
          lead={lead}
          onSend={handleSendEmail}
        />
      </div>
    </div>
  );
};

export default LeadEmailTab;
