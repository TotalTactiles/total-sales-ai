
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Phone, Mail, MessageSquare, Calendar } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadOverviewTabProps {
  lead: Lead;
}

const LeadOverviewTab: React.FC<LeadOverviewTabProps> = ({ lead }) => {
  const mockActivities = [
    {
      id: 1,
      type: 'email',
      title: 'Sent pricing information',
      description: 'Forwarded detailed pricing breakdown and ROI calculator',
      timestamp: '2 hours ago',
      relevance: 'high'
    },
    {
      id: 2,
      type: 'call',
      title: 'Discovery call completed',
      description: 'Discussed budget and timeline. Very interested in Q1 implementation',
      timestamp: '2 days ago',
      relevance: 'high'
    },
    {
      id: 3,
      type: 'email',
      title: 'Downloaded case study',
      description: 'Opened "Manufacturing ROI Case Study" - 3 minutes reading time',
      timestamp: '3 days ago',
      relevance: 'medium'
    },
    {
      id: 4,
      type: 'meeting',
      title: 'Demo scheduled',
      description: 'Set up product demo for next Tuesday at 2 PM EST',
      timestamp: '1 week ago',
      relevance: 'high'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'call': return <Phone className="h-4 w-4 text-green-600" />;
      case 'sms': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'meeting': return <Calendar className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRelevanceBadge = (relevance: string) => {
    switch (relevance) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High Impact</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      default: return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
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
            placeholder="Search across all files, emails, messages, notes, meetings..."
            className="w-full"
          />
          <p className="text-xs text-slate-500 mt-2">
            AI-powered search across all interactions with {lead.name}
          </p>
        </CardContent>
      </Card>

      {/* AI-Sorted Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline (AI Sorted by Relevance)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="border-l-2 border-slate-200 pl-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <div className="flex items-center gap-2">
                        {getRelevanceBadge(activity.relevance)}
                        <span className="text-xs text-slate-500">{activity.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs text-slate-500">Total Interactions</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.2m</div>
              <div className="text-xs text-slate-500">Avg Response Time</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadOverviewTab;
