
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Brain, Clock, Mail, MessageSquare, CheckCircle, X } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadSummaryTabProps {
  lead: Lead;
  aiDelegationMode: boolean;
}

interface SearchResult {
  id: string;
  type: 'email' | 'note' | 'call' | 'document';
  title: string;
  content: string;
  timestamp: string;
}

interface RecentReply {
  id: string;
  type: 'email' | 'sms';
  from: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  fullContent: string;
  subject?: string;
  thread: Array<{
    id: string;
    type: 'sent' | 'received';
    content: string;
    timestamp: string;
    subject?: string;
  }>;
}

const LeadSummaryTab: React.FC<LeadSummaryTabProps> = ({ lead, aiDelegationMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedReply, setSelectedReply] = useState<RecentReply | null>(null);
  const [showThread, setShowThread] = useState(false);

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

  const mockRecentReplies: RecentReply[] = [
    {
      id: '1',
      type: 'email',
      from: lead.name,
      preview: 'Thanks for the pricing info. Could you also send the ROI calculator...',
      timestamp: '2 hours ago',
      unread: true,
      fullContent: 'Thanks for the pricing info. Could you also send the ROI calculator you mentioned? We\'re evaluating this for Q1 implementation.',
      subject: 'RE: Software Solution Discussion',
      thread: [
        {
          id: 'msg-1',
          type: 'sent',
          content: `Hi ${lead.name.split(' ')[0]},\n\nFollowing up on our call. Attached is the pricing breakdown and implementation timeline.\n\nBest regards`,
          timestamp: '1 day ago',
          subject: 'Software Solution Discussion'
        },
        {
          id: 'msg-2',
          type: 'received',
          content: 'Thanks for the pricing info. Could you also send the ROI calculator you mentioned? We\'re evaluating this for Q1 implementation.',
          timestamp: '2 hours ago'
        }
      ]
    },
    {
      id: '2',
      type: 'sms',
      from: lead.name,
      preview: 'Sounds great! Looking forward to seeing the numbers.',
      timestamp: '11:45 AM',
      unread: false,
      fullContent: 'Sounds great! Looking forward to seeing the numbers.',
      thread: [
        {
          id: 'sms-msg-1',
          type: 'sent',
          content: 'Hi! Quick follow-up from our call. I\'ll send that ROI calculator by Friday. Thanks!',
          timestamp: '10:30 AM'
        },
        {
          id: 'sms-msg-2',
          type: 'received',
          content: 'Sounds great! Looking forward to seeing the numbers.',
          timestamp: '11:45 AM'
        }
      ]
    }
  ];

  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      type: 'email',
      title: 'Pricing Discussion',
      content: 'Detailed pricing breakdown and ROI analysis for enterprise solution',
      timestamp: '2 days ago'
    },
    {
      id: '2',
      type: 'note',
      title: 'Discovery Call Notes',
      content: 'Budget: $50K-100K, Timeline: Q1 implementation, Key stakeholders identified',
      timestamp: '1 week ago'
    },
    {
      id: '3',
      type: 'call',
      title: 'Demo Follow-up',
      content: 'Positive feedback on dashboard features, concerns about integration complexity',
      timestamp: '3 days ago'
    }
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 2) {
      // Filter mock results based on search term
      const filtered = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(term.toLowerCase()) ||
        result.content.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleReplyClick = (reply: RecentReply) => {
    setSelectedReply(reply);
    setShowThread(true);
  };

  const handleReplyToThread = () => {
    // Close thread modal and route to comms tab with pre-filled data
    setShowThread(false);
    // This would trigger a tab change to comms with pre-filled reply data
    // For now, we'll just show a toast
    console.log('Routing to comms tab with reply data:', selectedReply);
  };

  return (
    <div className="p-6 space-y-6">
      {/* AI Lead Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Lead Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="font-medium text-slate-800">
              🎯 High-value enterprise prospect with strong engagement signals
            </p>
            <p className="text-slate-700">
              • Current stage: Evaluation phase (Q1 implementation target)
            </p>
            <p className="text-slate-700">
              • Budget range: $50K-$100K confirmed in discovery call
            </p>
            <p className="text-slate-700">
              • Last interaction: Requested ROI calculator (high buying intent)
            </p>
            <p className="text-slate-700">
              • Recommended next action: Send ROI calculator and schedule implementation planning call
            </p>
          </div>
        </CardContent>
      </Card>

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
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-slate-500 mt-2">
            Search across emails, notes, calls, and documents for this lead
          </p>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Search Results</h4>
              {searchResults.map((result) => (
                <div key={result.id} className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{result.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {result.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{result.content}</p>
                  <span className="text-xs text-slate-500">{result.timestamp}</span>
                </div>
              ))}
            </div>
          )}
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
              <div 
                key={reply.id} 
                className={`p-3 border rounded-lg cursor-pointer hover:bg-slate-50 ${
                  reply.unread ? 'border-blue-200 bg-blue-50' : ''
                }`}
                onClick={() => handleReplyClick(reply)}
              >
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

      {/* Thread Modal */}
      <Dialog open={showThread} onOpenChange={setShowThread}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {selectedReply?.type === 'email' ? (
                  <Mail className="h-5 w-5 text-blue-600" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-green-600" />
                )}
                {selectedReply?.subject || 'SMS Thread'}
              </DialogTitle>
              <button
                onClick={() => setShowThread(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto space-y-4">
            {selectedReply?.thread.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 rounded-lg ${
                  message.type === 'sent' 
                    ? 'bg-blue-50 border border-blue-200 ml-8' 
                    : 'bg-gray-50 border border-gray-200 mr-8'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={message.type === 'sent' ? 'default' : 'secondary'}>
                    {message.type === 'sent' ? 'Sent' : 'Received'}
                  </Badge>
                  <span className="text-xs text-slate-500">{message.timestamp}</span>
                </div>
                {message.subject && (
                  <h5 className="font-medium text-sm mb-2">{message.subject}</h5>
                )}
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleReplyToThread}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reply
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadSummaryTab;
