
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  Brain, 
  Upload, 
  User, 
  TrendingUp,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Clock
} from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadTimelineEnhancedProps {
  lead: Lead;
  rationaleMode: boolean;
}

const LeadTimelineEnhanced: React.FC<LeadTimelineEnhancedProps> = ({
  lead,
  rationaleMode
}) => {
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  // Mock timeline data with all activity types
  const timelineData = [
    {
      id: '1',
      type: 'ai_suggestion',
      title: 'AI Recommendation: Follow-up Call',
      description: 'Based on recent engagement patterns, suggest scheduling a discovery call within 24 hours to maintain momentum.',
      timestamp: '2 hours ago',
      icon: Brain,
      color: 'bg-blue-500',
      feedback: null,
      confidence: 87
    },
    {
      id: '2',
      type: 'email',
      title: 'Email Sent: Product Demo Follow-up',
      description: 'Sent follow-up email with demo recording and ROI calculator to Sarah Johnson.',
      timestamp: '4 hours ago',
      icon: Mail,
      color: 'bg-green-500',
      hasReply: true
    },
    {
      id: '3',
      type: 'task',
      title: 'Task Completed: Prepare Custom Proposal',
      description: 'Prepared and reviewed custom proposal for Enterprise package with automation features.',
      timestamp: '1 day ago',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      completedBy: 'John Smith'
    },
    {
      id: '4',
      type: 'call',
      title: 'Discovery Call Completed',
      description: 'Had productive 45-minute discovery call. Discussed budget ($50K-$75K range), timeline (Q1 implementation), and key pain points.',
      timestamp: '2 days ago',
      icon: Phone,
      color: 'bg-purple-500',
      duration: '45 minutes',
      outcome: 'positive'
    },
    {
      id: '5',
      type: 'stage_change',
      title: 'Stage Updated: Qualified → Proposal',
      description: 'Lead moved to Proposal stage after successful discovery call and budget confirmation.',
      timestamp: '2 days ago',
      icon: TrendingUp,
      color: 'bg-orange-500',
      fromStage: 'Qualified',
      toStage: 'Proposal'
    },
    {
      id: '6',
      type: 'sms',
      title: 'SMS Sent: Meeting Confirmation',
      description: 'Confirmed tomorrow\'s meeting at 2 PM EST. Received positive response.',
      timestamp: '3 days ago',
      icon: MessageSquare,
      color: 'bg-blue-400',
      hasReply: true
    },
    {
      id: '7',
      type: 'meeting',
      title: 'Product Demo Scheduled',
      description: 'Scheduled 60-minute product demo for next Tuesday at 2 PM EST.',
      timestamp: '5 days ago',
      icon: Calendar,
      color: 'bg-indigo-500',
      meetingType: 'Product Demo'
    },
    {
      id: '8',
      type: 'upload',
      title: 'Document Uploaded: Case Study',
      description: 'Uploaded industry-specific case study showing 200% ROI increase for similar companies.',
      timestamp: '1 week ago',
      icon: Upload,
      color: 'bg-gray-500',
      fileName: 'SaaS_Automation_Case_Study.pdf'
    }
  ];

  const filteredTimeline = timelineData.filter(item => {
    const typeMatch = filterType === 'all' || item.type === filterType;
    const dateMatch = !filterDate || item.timestamp.includes(filterDate);
    return typeMatch && dateMatch;
  });

  const handleFeedback = (itemId: string, feedback: 'positive' | 'negative') => {
    console.log(`Feedback for ${itemId}: ${feedback}`);
    // This would update the timeline item with feedback and train TSAM
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'meeting': return Calendar;
      case 'task': return CheckCircle;
      case 'ai_suggestion': return Brain;
      case 'upload': return Upload;
      case 'stage_change': return TrendingUp;
      default: return User;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Filter Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Timeline Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Filter by Type:</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-8 text-sm">
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
                  <SelectItem value="upload">Uploads</SelectItem>
                  <SelectItem value="stage_change">Stage Changes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Filter by Date:</label>
              <Input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {filteredTimeline.map((item, index) => {
          const IconComponent = getIcon(item.type);
          
          return (
            <Card key={item.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${item.color} shrink-0`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                    {/* Additional Details */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.hasReply && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          Reply Received
                        </Badge>
                      )}
                      {item.duration && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.duration}
                        </Badge>
                      )}
                      {item.confidence && (
                        <Badge variant="outline" className="text-xs text-blue-600">
                          {item.confidence}% Confidence
                        </Badge>
                      )}
                      {item.outcome && (
                        <Badge variant="outline" className={`text-xs ${
                          item.outcome === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.outcome} outcome
                        </Badge>
                      )}
                    </div>

                    {/* AI Suggestion Feedback */}
                    {item.type === 'ai_suggestion' && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(item.id, 'positive')}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(item.id, 'negative')}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Not Helpful
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline connector */}
                {index < filteredTimeline.length - 1 && (
                  <div className="absolute left-8 top-14 w-0.5 h-8 bg-gray-200"></div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filteredTimeline.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="font-medium mb-2">No timeline entries found</h3>
                <p className="text-sm">
                  {filterType !== 'all' || filterDate 
                    ? 'Try adjusting your filters to see more activities'
                    : 'Timeline entries will appear here as you interact with this lead'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeadTimelineEnhanced;
