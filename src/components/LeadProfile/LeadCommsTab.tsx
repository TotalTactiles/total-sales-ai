
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lead } from '@/types/lead';
import { Mail, MessageSquare, Phone } from 'lucide-react';

interface LeadCommsTabProps {
  lead: Lead;
  aiDelegationMode: boolean;
  onUpdate: (field: string, value: any) => void;
}

const LeadCommsTab: React.FC<LeadCommsTabProps> = ({ lead, aiDelegationMode, onUpdate }) => {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Button variant="outline" disabled={aiDelegationMode}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button variant="outline" disabled={aiDelegationMode}>
          <MessageSquare className="h-4 w-4 mr-2" />
          SMS
        </Button>
        <Button variant="outline" disabled={aiDelegationMode}>
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium">Email sent - Initial outreach</p>
              <p className="text-sm text-muted-foreground">2 days ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium">Email received - Interested in demo</p>
              <p className="text-sm text-muted-foreground">1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Message</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Type your message..."
            className="min-h-[100px]"
            disabled={aiDelegationMode}
          />
          <Button className="mt-2" disabled={aiDelegationMode}>
            Send
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadCommsTab;
