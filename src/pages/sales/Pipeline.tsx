
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, Star } from 'lucide-react';

const Pipeline: React.FC = () => {
  const leads = [
    {
      id: 1,
      name: 'Sarah Chen',
      company: 'TechCorp',
      score: 92,
      priority: 'high',
      nextAction: 'Follow-up call',
      dueDate: 'Today',
      aiSuggestion: 'Mention ROI calculator - 67% success rate with CFOs'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      company: 'StartupX',
      score: 78,
      priority: 'high',
      nextAction: 'Send proposal',
      dueDate: 'Tomorrow',
      aiSuggestion: 'Use enterprise case study - similar company size'
    },
    {
      id: 3,
      name: 'Lisa Wang',
      company: 'Enterprise Co',
      score: 65,
      priority: 'medium',
      nextAction: 'Demo scheduled',
      dueDate: 'Friday',
      aiSuggestion: 'Focus on security features - mentioned in last call'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pl-72">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Smart Pipeline</h1>
          <p className="text-gray-600">AI-ranked leads with live coaching prompts</p>
        </div>

        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-lg">{lead.score}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lead.name}</CardTitle>
                      <p className="text-gray-600">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(lead.priority)} text-white border-0`}>
                      {lead.priority}
                    </Badge>
                    <Badge variant="outline">{lead.dueDate}</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-blue-800 mb-1">AI Coaching Prompt:</p>
                  <p className="text-sm text-blue-700">{lead.aiSuggestion}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{lead.nextAction}</p>
                    <p className="text-sm text-gray-600">Next action due: {lead.dueDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
