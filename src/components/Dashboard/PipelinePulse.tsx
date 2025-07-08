
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, TrendingUp } from 'lucide-react';

interface PipelineLead {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: string;
  lastContacted: number; // days ago
  aiSummary: string;
  priority: 'high' | 'medium' | 'low';
}

const PipelinePulse: React.FC = () => {
  const leads: PipelineLead[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechCorp',
      value: 94760,
      stage: 'Proposal',
      lastContacted: 4,
      aiSummary: 'No reply in 4 days - reschedule now',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      company: 'StartupX',
      value: 78500,
      stage: 'Demo',
      lastContacted: 2,
      aiSummary: 'Opened proposal twice, no reply',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Lisa Wang',
      company: 'Enterprise Co',
      value: 65200,
      stage: 'Discovery',
      lastContracted: 6,
      aiSummary: 'Last call 6 days ago - follow-up recommended',
      priority: 'medium'
    },
    {
      id: '4',
      name: 'David Kim',
      company: 'GlobalSoft',
      value: 52300,
      stage: 'Qualified',
      lastContacted: 1,
      aiSummary: 'Clicked demo link, but didn\'t book',
      priority: 'medium'
    },
    {
      id: '5',
      name: 'Jennifer Lee',
      company: 'CloudFirst',
      value: 41800,
      stage: 'New Lead',
      lastContacted: 0,
      aiSummary: 'New lead, strong initial interest',
      priority: 'high'
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'new lead': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'discovery': return 'bg-yellow-100 text-yellow-800';
      case 'demo': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'negotiation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    return priority === 'high' ? '🔥' : priority === 'medium' ? '⚡' : '📋';
  };

  const formatLastContacted = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Pipeline Pulse
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">AI Prioritized</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
            {/* Lead Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">${lead.value.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">{getPriorityIcon(lead.priority)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{lead.name} • {lead.company}</p>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="mb-3">
              <p className="text-sm text-gray-700 italic">"{lead.aiSummary}"</p>
            </div>

            {/* New Columns: Stage and Last Contacted */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Stage:</span>
                <Badge className={getStageColor(lead.stage)} variant="outline">
                  {lead.stage}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Last Contacted:</span>
                <span className="text-sm text-gray-700 font-medium">
                  {formatLastContacted(lead.lastContacted)}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-8">
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                <Calendar className="h-3 w-3 mr-1" />
                Schedule
              </Button>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            View All Leads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PipelinePulse;
