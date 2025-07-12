
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Filter,
  MessageSquare,
  Target,
  Activity,
  Heart,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  revenue: string;
  deals: string;
  conversion: string;
  status: string;
  progress: number;
  trend: 'up' | 'down';
  performance: 'high' | 'medium' | 'low';
  activity: 'high' | 'medium' | 'low';
}

interface TeamNudge {
  id: string;
  type: 'performance' | 'coaching' | 'burnout' | 'activity';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  repName?: string;
}

const EnhancedTeamPerformance: React.FC = () => {
  const navigate = useNavigate();
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [nudgeFilter, setNudgeFilter] = useState('all');

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      initials: 'SJ',
      revenue: '$145,000',
      deals: '198',
      conversion: '34.2%',
      status: 'Exceeding',
      progress: 112,
      trend: 'up',
      performance: 'high',
      activity: 'high'
    },
    {
      id: '2',
      name: 'Michael Chen',
      initials: 'MC',
      revenue: '$89,000',
      deals: '143',
      conversion: '28.1%',
      status: 'Below Target',
      progress: 74,
      trend: 'down',
      performance: 'low',
      activity: 'medium'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      initials: 'ER',
      revenue: '$112,000',
      deals: '167',
      conversion: '31.8%',
      status: 'On Track',
      progress: 92,
      trend: 'up',
      performance: 'medium',
      activity: 'high'
    }
  ];

  const teamNudges: TeamNudge[] = [
    {
      id: '1',
      type: 'performance',
      priority: 'high',
      title: 'Michael needs immediate support',
      description: '25% behind target, struggling with objection handling',
      action: 'Schedule coaching session',
      repName: 'Michael Chen'
    },
    {
      id: '2',
      type: 'burnout',
      priority: 'high',
      title: 'Sarah showing burnout signs',
      description: 'Working 12+ hours daily, performance may decline',
      action: 'Wellness check-in',
      repName: 'Sarah Johnson'
    },
    {
      id: '3',
      type: 'coaching',
      priority: 'medium',
      title: 'Emily needs objection training',
      description: 'Price objections up 40% this month',
      action: 'Assign training module',
      repName: 'Emily Rodriguez'
    },
    {
      id: '4',
      type: 'activity',
      priority: 'medium',
      title: 'Team call volume declining',
      description: 'Overall calls down 15% vs last week',
      action: 'Review activity goals'
    }
  ];

  const getFilteredMembers = () => {
    if (performanceFilter === 'all') return teamMembers;
    return teamMembers.filter(member => member.performance === performanceFilter);
  };

  const getFilteredNudges = () => {
    if (nudgeFilter === 'all') return teamNudges;
    return teamNudges.filter(nudge => nudge.type === nudgeFilter);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Exceeding': return 'text-green-600';
      case 'Below Target': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Users className="h-5 w-5" />
            Team Performance
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            3 Active Members
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="nudges">AI Nudges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter by:</span>
              </div>
              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High Performers</SelectItem>
                  <SelectItem value="medium">Average</SelectItem>
                  <SelectItem value="low">Needs Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getFilteredMembers().map((member) => {
                const TrendIcon = member.trend === 'up' ? TrendingUp : TrendingDown;
                return (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900">{member.name}</h4>
                        <div className="flex items-center gap-2">
                          <TrendIcon className={`h-3 w-3 ${member.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                          <span className={`text-xs font-semibold ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Revenue</p>
                        <p className="text-sm font-bold text-gray-900">{member.revenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Deals</p>
                        <p className="text-sm font-bold text-gray-900">{member.deals}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Conv.</p>
                        <p className="text-sm font-bold text-gray-900">{member.conversion}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{member.progress}%</span>
                      </div>
                      <Progress value={Math.min(member.progress, 100)} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="nudges" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Filter nudges:</span>
              </div>
              <Select value={nudgeFilter} onValueChange={setNudgeFilter}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="coaching">Coaching</SelectItem>
                  <SelectItem value="burnout">Burnout</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              {getFilteredNudges().map((nudge) => (
                <div key={nudge.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {nudge.type === 'performance' && <Target className="h-4 w-4 text-red-600" />}
                      {nudge.type === 'coaching' && <Users className="h-4 w-4 text-blue-600" />}
                      {nudge.type === 'burnout' && <Heart className="h-4 w-4 text-orange-600" />}
                      {nudge.type === 'activity' && <Activity className="h-4 w-4 text-green-600" />}
                      <h4 className="font-semibold text-sm text-gray-900">{nudge.title}</h4>
                    </div>
                    <Badge className={`${getPriorityColor(nudge.priority)} text-xs`}>
                      {nudge.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{nudge.description}</p>
                  {nudge.repName && (
                    <p className="text-xs text-purple-600 font-medium mb-2">Rep: {nudge.repName}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">
                      ⚡ {nudge.action}
                    </span>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1">
                      Take Action
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

export default EnhancedTeamPerformance;
