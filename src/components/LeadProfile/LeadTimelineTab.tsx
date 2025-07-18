
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MessageSquare, Calendar, CheckCircle, FileText, Bot, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadTimelineTabProps {
  lead: Lead;
}

interface TimelineEvent {
  id: string;
  type: 'call' | 'email' | 'sms' | 'task' | 'meeting' | 'note' | 'ai_suggestion' | 'stage_change';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

const LeadTimelineTab: React.FC<LeadTimelineTabProps> = ({ lead }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const mockTimelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'ai_suggestion',
      title: 'AI Recommendation',
      description: 'Suggested to send ROI calculator based on lead behavior',
      timestamp: '2 hours ago',
      metadata: { feedback: null }
    },
    {
      id: '2',
      type: 'email',
      title: 'Email Sent',
      description: 'Sent pricing information and implementation timeline',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'call',
      title: 'Discovery Call',
      description: 'Duration: 27 minutes. Discussed budget and timeline.',
      timestamp: '2 days ago'
    },
    {
      id: '4',
      type: 'task',
      title: 'Task Completed',
      description: 'Follow-up call scheduled for next week',
      timestamp: '3 days ago'
    },
    {
      id: '5',
      type: 'stage_change',
      title: 'Stage Updated',
      description: 'Moved from "Qualification" to "Proposal"',
      timestamp: '1 week ago'
    },
    {
      id: '6',
      type: 'meeting',
      title: 'Demo Scheduled',
      description: 'Product demo set for next Tuesday at 2 PM EST',
      timestamp: '1 week ago'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4 text-green-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'task':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'note':
        return <FileText className="h-4 w-4 text-slate-600" />;
      case 'ai_suggestion':
        return <Bot className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'border-l-green-400';
      case 'email':
        return 'border-l-blue-400';
      case 'sms':
        return 'border-l-purple-400';
      case 'meeting':
        return 'border-l-orange-400';
      case 'task':
        return 'border-l-green-400';
      case 'ai_suggestion':
        return 'border-l-purple-400';
      case 'stage_change':
        return 'border-l-amber-400';
      default:
        return 'border-l-slate-400';
    }
  };

  const handleAIFeedback = (eventId: string, feedback: 'positive' | 'negative') => {
    // Handle AI feedback - this would update TSAM training data
    console.log(`AI feedback for event ${eventId}:`, feedback);
  };

  const filteredEvents = filterType === 'all' 
    ? mockTimelineEvents 
    : mockTimelineEvents.filter(event => event.type === filterType);

  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by type:</span>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="call">Calls</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="task">Tasks</SelectItem>
            <SelectItem value="ai_suggestion">AI Suggestions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className={`border-l-4 ${getEventColor(event.type)}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <span className="text-xs text-slate-500">{event.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                  
                  {event.type === 'ai_suggestion' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500">Was this suggestion helpful?</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAIFeedback(event.id, 'positive')}
                        className="h-6 px-2"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAIFeedback(event.id, 'negative')}
                        className="h-6 px-2"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <Badge variant="secondary" className="text-xs mt-1">
                    {event.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">No activities found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadTimelineTab;
