
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Brain, Clock, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadSummaryTabProps {
  lead: Lead;
  aiDelegationMode: boolean;
}

const LeadSummaryTab: React.FC<LeadSummaryTabProps> = ({ lead, aiDelegationMode }) => {
  const mockRecentActivity = [
    {
      id: 1,
      type: 'email',
      title: 'Sent pricing information',
      description: 'Forwarded detailed pricing breakdown',
      timestamp: '2 hours ago',
      icon: <Mail className="h-4 w-4 text-blue-600" />
    },
    {
      id: 2,
      type: 'task',
      title: 'Follow-up call scheduled',
      description: 'Set reminder for tomorrow 2 PM',
      timestamp: '1 day ago',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    }
  ];

  const mockRecentReplies = [
    {
      id: 1,
      type: 'email',
      from: lead.name,
      preview: 'Thanks for the pricing info. Could you also send the ROI calculator...',
      timestamp: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'sms',
      from: lead.name,
      preview: 'Sounds great! Looking forward to seeing the numbers.',
      timestamp: '11:45 AM',
      unread: false
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              🎯 {lead.name} has opened your proposal twice but hasn't responded. High engagement signal.
            </p>
            <p className="text-sm text-slate-600">
              📈 Lead score increased 15% this week based on website activity and email engagement.
            </p>
            <p className="text-sm text-slate-600">
              ⏰ Optimal contact time: Tuesday-Thursday, 10 AM - 2 PM based on previous responses.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Smart Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Smart Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={`Search all content for ${lead.name}...`}
            className="w-full"
          />
          <p className="text-xs text-slate-500 mt-2">
            Search across emails, notes, calls, and documents for this lead
          </p>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity (7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-1">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-sm text-slate-600">{activity.description}</p>
                  <span className="text-xs text-slate-500">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Replies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Replies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRecentReplies.map((reply) => (
              <div key={reply.id} className={`p-3 border rounded-lg cursor-pointer hover:bg-slate-50 ${
                reply.unread ? 'border-blue-200 bg-blue-50' : ''
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {reply.type === 'email' ? (
                      <Mail className="h-4 w-4 text-blue-600" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    )}
                    <span className={`text-sm ${reply.unread ? 'font-semibold' : ''}`}>
                      {reply.from}
                    </span>
                    {reply.unread && (
                      <Badge variant="default" className="text-xs">New</Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{reply.timestamp}</span>
                </div>
                <p className={`text-sm text-slate-600 ${reply.unread ? 'font-medium' : ''}`}>
                  {reply.preview}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadSummaryTab;
