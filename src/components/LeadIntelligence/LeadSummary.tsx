
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search,
  Lightbulb,
  Clock,
  Mail,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadSummaryProps {
  lead: Lead;
  rationaleMode: boolean;
  aiDelegationMode: boolean;
  isSensitive: boolean;
}

interface RecentReply {
  id: string;
  type: 'email' | 'sms';
  sender: string;
  subject?: string;
  preview: string;
  timestamp: string;
  isUnread: boolean;
}

interface ActivityItem {
  id: string;
  type: 'call' | 'email' | 'sms' | 'task' | 'meeting';
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'missed';
}

const LeadSummary: React.FC<LeadSummaryProps> = ({ 
  lead, 
  rationaleMode, 
  aiDelegationMode, 
  isSensitive 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showReplyModal, setShowReplyModal] = useState<string | null>(null);

  // Mock data for recent replies
  const recentReplies: RecentReply[] = [
    {
      id: '1',
      type: 'email',
      sender: lead.name,
      subject: 'Re: Pricing Information',
      preview: 'Thanks for the detailed pricing breakdown. I have a few follow-up questions about the implementation timeline...',
      timestamp: '2 hours ago',
      isUnread: true
    },
    {
      id: '2',
      type: 'sms',
      sender: lead.name,
      preview: 'Can we reschedule our meeting for next week? Something urgent came up.',
      timestamp: '1 day ago',
      isUnread: false
    }
  ];

  // Mock data for recent activity
  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'email',
      description: 'Sent pricing proposal and implementation timeline',
      timestamp: '3 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'call',
      description: 'Discovery call - discussed pain points and budget',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'task',
      description: 'Follow up on demo feedback',
      timestamp: '2 days ago',
      status: 'pending'
    },
    {
      id: '4',
      type: 'meeting',
      description: 'Product demo scheduled',
      timestamp: '3 days ago',
      status: 'completed'
    }
  ];

  const handleReplyClick = (replyId: string) => {
    const reply = recentReplies.find(r => r.id === replyId);
    if (reply) {
      setShowReplyModal(replyId);
      // This would open the reply modal and then redirect to Comms Compose
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'task': return '✅';
      case 'meeting': return '🗓️';
      default: return '📝';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'missed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Filter activity based on search term
  const filteredActivity = recentActivity.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const aiTasks = [
    {
      id: '1',
      title: 'Follow-up email ready for review',
      description: 'AI has drafted a follow-up email based on last conversation'
    }
  ];

  return (
    <div className="space-y-6 p-6 h-full overflow-y-auto">
      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">High Engagement Score</p>
                <p className="text-xs text-blue-600">
                  {lead.name} has opened 5 emails in the last week and visited your pricing page 3 times. 
                  Strong buying signals detected.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Optimal Contact Time</p>
                <p className="text-xs text-green-600">
                  Best response rates: Tuesday-Thursday, 10 AM - 2 PM EST based on historical data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Smart Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search all communication & content for this lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Task Summary */}
      {aiTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-purple-500" />
              AI Task Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-gray-600">{task.description}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Task
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Replies Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Replies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentReplies.length === 0 ? (
            <p className="text-sm text-gray-500">No recent replies</p>
          ) : (
            recentReplies.map((reply) => (
              <div
                key={reply.id}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  reply.isUnread ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleReplyClick(reply.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    {reply.type === 'email' ? (
                      <Mail className="h-4 w-4 text-blue-600" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    )}
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {reply.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${reply.isUnread ? 'font-bold' : ''}`}>
                        {reply.sender}
                      </span>
                      <span className="text-xs text-gray-500">{reply.timestamp}</span>
                      {reply.isUnread && (
                        <Badge variant="secondary" className="text-xs">Unread</Badge>
                      )}
                    </div>
                    
                    {reply.subject && (
                      <p className={`text-sm mb-1 ${reply.isUnread ? 'font-semibold' : 'font-medium'}`}>
                        {reply.subject}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-600 truncate">
                      {reply.preview}
                    </p>
                  </div>
                  
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-gray-500" />
            Recent Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredActivity.length === 0 ? (
            <p className="text-sm text-gray-500">
              {searchTerm ? 'No activity matches your search' : 'No recent activity'}
            </p>
          ) : (
            filteredActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className={`text-sm ${getStatusColor(activity.status)}`}>
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
                {activity.status && (
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {activity.status}
                  </Badge>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Reply Modal would be implemented here */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reply Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowReplyModal(null)}>
                ×
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This would show the full thread and redirect to Comms Compose
            </p>
            <Button 
              onClick={() => {
                setShowReplyModal(null);
                // Redirect to Comms > Email tab with compose prefilled
              }}
              className="w-full"
            >
              Open in Comms
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadSummary;
