
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, TrendingDown, Target, Bell, MessageSquare, Clock } from 'lucide-react';
import TeamPerformanceFilter from './TeamPerformanceFilter';

const TeamPerformanceSection: React.FC = () => {
  const [filterValue, setFilterValue] = useState('all');

  const teamMembers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      initials: 'SJ',
      calls: 172,
      conversions: 45,
      revenue: '$125,000',
      streak: 5,
      status: 'performing',
      lastActive: '2 min ago'
    },
    {
      id: '2',
      name: 'Michael Chen',
      initials: 'MC',
      calls: 143,
      conversions: 32,
      revenue: '$98,000',
      streak: 0,
      status: 'needs_attention',
      lastActive: '15 min ago'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      initials: 'ER',
      calls: 198,
      conversions: 57,
      revenue: '$156,000',
      streak: 7,
      status: 'top_performer',
      lastActive: '1 min ago'
    }
  ];

  const nudges = [
    {
      id: '1',
      repName: 'Michael Chen',
      initials: 'MC',
      type: 'burnout_risk',
      message: 'Worked 12+ hours overtime this week, mood score dropping',
      action: 'Schedule 1-on-1 check-in',
      priority: 'high',
      timeAgo: '2 hours ago'
    },
    {
      id: '2',
      repName: 'Sarah Johnson',
      initials: 'SJ',
      type: 'lead_redistribution',
      message: 'Has 47 active leads while team average is 25',
      action: 'Redistribute 15 leads',
      priority: 'medium',
      timeAgo: '4 hours ago'
    },
    {
      id: '3',
      repName: 'Emily Rodriguez',
      initials: 'ER',
      type: 'recognition',
      message: 'Exceeded quota by 140% this month',
      action: 'Send public recognition',
      priority: 'low',
      timeAgo: '1 day ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'top_performer': return 'bg-green-100 text-green-800';
      case 'performing': return 'bg-blue-100 text-blue-800';
      case 'needs_attention': return 'bg-red-100 text-red-800';
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-blue-600" />
          Team Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="nudges">AI Nudges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <TeamPerformanceFilter value={filterValue} onChange={setFilterValue} />
            
            <div className="grid gap-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{member.name}</h4>
                        <p className="text-xs text-gray-600">Last active: {member.lastActive}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(member.status)} text-xs`}>
                      {member.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Calls</p>
                      <p className="font-semibold text-sm">{member.calls}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Conversions</p>
                      <p className="font-semibold text-sm">{member.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Revenue</p>
                      <p className="font-semibold text-sm text-green-600">{member.revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Streak</p>
                      <p className="font-semibold text-sm">{member.streak} days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="nudges" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">AI-powered team recommendations</p>
              <Button variant="outline" size="sm">Filter Nudges</Button>
            </div>
            
            <div className="space-y-3">
              {nudges.map((nudge) => (
                <div key={nudge.id} className="p-4 rounded-lg border bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                          {nudge.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{nudge.repName}</h4>
                        <p className="text-xs text-gray-600">{nudge.timeAgo}</p>
                      </div>
                    </div>
                    <Badge className={`${getPriorityColor(nudge.priority)} text-xs`}>
                      {nudge.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-800 mb-3">{nudge.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-700 font-medium">
                      Suggested: {nudge.action}
                    </span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Send Nudge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceSection;
