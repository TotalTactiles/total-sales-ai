
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, TrendingUp, AlertTriangle, ExternalLink, Filter, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnhancedTeamPerformance: React.FC = () => {
  const [filterBy, setFilterBy] = useState('all');
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      performance: 145,
      status: 'excellent',
      calls: 45,
      wins: 12,
      revenue: '$25K'
    },
    {
      name: 'Michael Chen',
      performance: 75,
      status: 'needs-support',
      calls: 32,
      wins: 6,
      revenue: '$18K'
    },
    {
      name: 'Jasmine Rodriguez',
      performance: 120,
      status: 'good',
      calls: 41,
      wins: 10,
      revenue: '$22K'
    },
    {
      name: 'Alex Thompson',
      performance: 65,
      status: 'needs-support',
      calls: 28,
      wins: 4,
      revenue: '$12K'
    }
  ];

  const aiNudges = [
    {
      type: 'coaching',
      priority: 'high',
      title: 'Schedule 1:1 with Michael Chen',
      description: 'Performance dropped 15% this week. Recommend coaching session on objection handling.',
      action: 'Schedule Meeting'
    },
    {
      type: 'recognition',
      priority: 'medium',
      title: 'Celebrate Sarah\'s Achievement',
      description: 'Sarah hit 145% of quota. Public recognition could boost team morale.',
      action: 'Send Recognition'
    },
    {
      type: 'training',
      priority: 'medium',
      title: 'Team Training Opportunity',
      description: 'Conversion rates could improve with advanced closing techniques training.',
      action: 'Schedule Training'
    },
    {
      type: 'motivation',
      priority: 'low',
      title: 'Team Building Activity',
      description: 'Team stress indicators suggest a team building activity would be beneficial.',
      action: 'Plan Activity'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs-support': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMembers = filterBy === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.status === filterBy);

  const handleSeeMore = () => {
    navigate('/manager/team');
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Performance
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              AI-Enhanced
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSeeMore}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              See More
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="nudges">AI Nudges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-600">Filter by:</span>
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by performance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  <SelectItem value="excellent">Excellent Performers</SelectItem>
                  <SelectItem value="good">Good Performers</SelectItem>
                  <SelectItem value="needs-support">Needs Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.performance}% of quota</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{member.revenue}</p>
                      <p className="text-xs text-slate-600">{member.calls} calls, {member.wins} wins</p>
                    </div>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nudges" className="space-y-4">
            <div className="space-y-3">
              {aiNudges.map((nudge, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-900">{nudge.title}</p>
                        <Badge className={getPriorityColor(nudge.priority)}>
                          {nudge.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{nudge.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {nudge.action}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedTeamPerformance;
