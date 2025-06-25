
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Phone, Clock } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  priority: 'high' | 'medium' | 'low';
  lastContact: string;
  reason: string;
}

const TodaysKillList: React.FC = () => {
  const topLeads: Lead[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'TechCorp',
      priority: 'high',
      lastContact: '2 days ago',
      reason: 'Demo scheduled, needs follow-up'
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      company: 'StartupX',
      priority: 'high',
      lastContact: '1 day ago',
      reason: 'Budget approved, ready to close'
    },
    {
      id: '3',
      name: 'Lisa Wang',
      company: 'Enterprise Co',
      priority: 'medium',
      lastContact: '3 days ago',
      reason: 'Objection about implementation'
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
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Today's Kill List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topLeads.map((lead, index) => (
            <div key={lead.id} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white/70">#{index + 1}</span>
                  <div>
                    <h4 className="font-semibold">{lead.name}</h4>
                    <p className="text-white/80 text-sm">{lead.company}</p>
                  </div>
                </div>
                <Badge className={`${getPriorityColor(lead.priority)} text-white border-0`}>
                  {lead.priority}
                </Badge>
              </div>
              <p className="text-white/90 text-sm mb-3">{lead.reason}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock className="h-4 w-4" />
                  {lead.lastContact}
                </div>
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysKillList;
