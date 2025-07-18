
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { Clock, Mail, Phone, MessageSquare } from 'lucide-react';

interface LeadTimelineTabProps {
  lead: Lead;
}

const LeadTimelineTab: React.FC<LeadTimelineTabProps> = ({ lead }) => {
  const timelineEvents = [
    {
      id: 1,
      type: 'email',
      title: 'Email sent',
      description: 'Initial outreach email sent',
      timestamp: '2024-01-18 10:30 AM',
      icon: Mail
    },
    {
      id: 2,
      type: 'call',
      title: 'Call attempted',
      description: 'Left voicemail',
      timestamp: '2024-01-17 2:15 PM',
      icon: Phone
    },
    {
      id: 3,
      type: 'sms',
      title: 'SMS sent',
      description: 'Follow-up message',
      timestamp: '2024-01-16 9:00 AM',
      icon: MessageSquare
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Timeline</h3>
      
      <div className="space-y-4">
        {timelineEvents.map((event) => {
          const IconComponent = event.icon;
          return (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{event.title}</p>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.timestamp}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LeadTimelineTab;
