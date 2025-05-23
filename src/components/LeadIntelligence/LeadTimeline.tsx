
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Brain,
  User,
  Clock,
  Plus,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import UsageTracker from '@/components/AIBrain/UsageTracker';

interface Lead {
  id: string;
  name: string;
  company: string;
}

interface LeadTimelineProps {
  lead: Lead;
  rationaleMode: boolean;
}

interface TimelineEvent {
  id: string;
  type: 'call' | 'email' | 'sms' | 'meeting' | 'note' | 'ai_suggestion';
  title: string;
  description: string;
  timestamp: string;
  actor: 'user' | 'ai' | 'lead';
  outcome?: 'positive' | 'neutral' | 'negative';
  aiReasoning?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({ lead, rationaleMode }) => {
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  
  const { trackEvent } = useUsageTracking();

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'ai_suggestion',
      title: 'AI Suggestion Implemented',
      description: 'Sent personalized ROI calculator based on company size',
      timestamp: '2 hours ago',
      actor: 'ai',
      outcome: 'positive',
      aiReasoning: 'Similar companies in construction respond well to ROI-focused content'
    },
    {
      id: '2',
      type: 'email',
      title: 'Email Sent: Pricing Follow-up',
      description: 'Shared pricing guide and implementation timeline',
      timestamp: '1 day ago',
      actor: 'user',
      sentiment: 'positive'
    },
    {
      id: '3',
      type: 'call',
      title: 'Discovery Call',
      description: '45min call - discussed pain points, budget confirmed, interested in Q1 implementation',
      timestamp: '3 days ago',
      actor: 'user',
      outcome: 'positive',
      sentiment: 'positive'
    },
    {
      id: '4',
      type: 'email',
      title: 'Initial Outreach Response',
      description: 'Lead responded with interest, requested pricing information',
      timestamp: '1 week ago',
      actor: 'lead',
      sentiment: 'positive'
    },
    {
      id: '5',
      type: 'email',
      title: 'Cold Outreach Sent',
      description: 'Personalized email highlighting industry-specific benefits',
      timestamp: '1 week ago',
      actor: 'user',
      sentiment: 'neutral'
    }
  ];

  const getEventIcon = (type: string, actor: string) => {
    if (actor === 'ai') return Brain;
    
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'meeting': return Calendar;
      case 'note': return User;
      default: return Clock;
    }
  };

  const getEventColor = (type: string, actor: string, outcome?: string) => {
    if (actor === 'ai') return 'bg-blue-100 text-blue-600 border-blue-200';
    if (outcome === 'positive') return 'bg-green-100 text-green-600 border-green-200';
    if (outcome === 'negative') return 'bg-red-100 text-red-600 border-red-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    trackEvent({
      feature: 'manual_note',
      action: 'add',
      context: 'lead_timeline',
      metadata: { leadId: lead.id, noteLength: newNote.length }
    });

    // In a real implementation, this would save to the database
    setNewNote('');
    setShowAddNote(false);
  };

  const handleAIFeedback = (eventId: string, feedback: 'positive' | 'negative') => {
    trackEvent({
      feature: 'ai_suggestion_feedback',
      action: feedback,
      context: 'lead_timeline',
      metadata: { eventId, leadId: lead.id }
    });
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Activity Timeline</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddNote(!showAddNote)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      </div>

      {/* Add Note Section */}
      {showAddNote && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this lead..."
              className="mb-3"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddNote}>
                Save Note
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddNote(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {timelineEvents.map((event, index) => {
          const Icon = getEventIcon(event.type, event.actor);
          const colorClass = getEventColor(event.type, event.actor, event.outcome);
          
          return (
            <UsageTracker
              key={event.id}
              feature="timeline_event"
              context={`${event.type}_${event.actor}`}
            >
              <div className="flex gap-4">
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full border-2 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {index < timelineEvents.length - 1 && (
                    <div className="w-px h-12 bg-slate-200 mt-2"></div>
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pb-8">
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-500">{event.timestamp}</span>
                            {event.actor === 'ai' && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                AI Generated
                              </Badge>
                            )}
                            {event.sentiment && (
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  event.sentiment === 'positive' ? 'bg-green-50 text-green-700' :
                                  event.sentiment === 'negative' ? 'bg-red-50 text-red-700' :
                                  'bg-slate-50 text-slate-700'
                                }`}
                              >
                                {event.sentiment}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* AI Feedback buttons */}
                        {event.actor === 'ai' && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAIFeedback(event.id, 'positive')}
                              className="h-8 w-8 p-0"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAIFeedback(event.id, 'negative')}
                              className="h-8 w-8 p-0"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-slate-700 mb-3">{event.description}</p>
                      
                      {/* AI Reasoning */}
                      {rationaleMode && event.aiReasoning && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-700">AI Reasoning</span>
                          </div>
                          <p className="text-xs text-blue-600">{event.aiReasoning}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </UsageTracker>
          );
        })}
      </div>
    </div>
  );
};

export default LeadTimeline;
