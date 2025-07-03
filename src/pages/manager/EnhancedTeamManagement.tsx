
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Award,
  AlertTriangle,
  Calendar,
  Download,
  RefreshCw,
  Trophy,
  Gift
} from 'lucide-react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import TeamRewardsManagement from '@/components/Manager/TeamRewardsManagement';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  status: '🔥Hot Streak' | '🟡Moderate' | '❄️Slowing';
  statusReason: string;
  coachingAlerts: number;
  focusZone: 'hot' | 'moderate' | 'slowing';
  milestones: string[];
  kpis: {
    calls: number;
    demos: number;
    revenue: number;
    trend: 'up' | 'down' | 'stable';
  };
}

const EnhancedTeamManagement: React.FC = () => {
  const [selectedKPI, setSelectedKPI] = useState<'calls' | 'demos' | 'revenue'>('calls');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Mock team data with enhanced features
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      initials: 'SJ',
      status: '🔥Hot Streak',
      statusReason: 'Demo conversion up 35% vs last month',
      coachingAlerts: 0,
      focusZone: 'hot',
      milestones: ['Hit 40 calls/day record', 'Closed 3 enterprise deals this week'],
      kpis: { calls: 198, demos: 57, revenue: 145000, trend: 'up' }
    },
    {
      id: '2',
      name: 'Michael Chen',
      initials: 'MC',
      status: '❄️Slowing',
      statusReason: '25% drop in demo conversion vs last month',
      coachingAlerts: 3,
      focusZone: 'slowing',
      milestones: ['Completed objection handling training'],
      kpis: { calls: 143, demos: 32, revenue: 89000, trend: 'down' }
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      initials: 'ER',
      status: '🟡Moderate',
      statusReason: 'Consistent performance, slight uptick in activity',
      coachingAlerts: 1,
      focusZone: 'moderate',
      milestones: ['Hit 10 demos this week', 'Improved follow-up response time'],
      kpis: { calls: 172, demos: 41, revenue: 112000, trend: 'up' }
    }
  ];

  const getStatusColor = (status: string) => {
    if (status.includes('🔥')) return 'bg-green-100 text-green-800';
    if (status.includes('🟡')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('❄️')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const generatePDF = () => {
    console.log('Generating PDF for manager meetings...');
  };

  const handleRedistribution = () => {
    console.log('Opening lead redistribution modal...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ManagerNavigation />
      
      <div className="pt-[60px] px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                <p className="text-gray-600">Enhanced team insights and coaching tools</p>
              </div>
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="overview">Team Overview</TabsTrigger>
                <TabsTrigger value="rewards">Team Rewards</TabsTrigger>
                <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              {/* Smart Coaching Alerts */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Smart Coaching Alerts
                    <Badge className="bg-white/20 text-white text-xs ml-auto">
                      {teamMembers.reduce((acc, member) => acc + member.coachingAlerts, 0)} Active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {teamMembers.filter(member => member.coachingAlerts > 0).map((member) => (
                      <div key={member.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-red-600 text-white">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-red-900">{member.name}</h4>
                              <p className="text-sm text-red-700">{member.statusReason}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule 1-on-1
                            </Button>
                            <Button size="sm" variant="outline">
                              Team Drill
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Focus Zones */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Team Focus Zones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900">{member.name}</h4>
                            <Badge className={getStatusColor(member.status)}>
                              {member.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                          {member.statusReason}
                        </div>

                        {/* KPI Summary */}
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-semibold">{member.kpis.calls}</span>
                              {getTrendIcon(member.kpis.trend)}
                            </div>
                            <span className="text-gray-600">Calls</span>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-semibold">{member.kpis.demos}</span>
                              {getTrendIcon(member.kpis.trend)}
                            </div>
                            <span className="text-gray-600">Demos</span>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-semibold">${(member.kpis.revenue / 1000).toFixed(0)}K</span>
                              {getTrendIcon(member.kpis.trend)}
                            </div>
                            <span className="text-gray-600">Revenue</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rep Milestones Feed */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Rep Milestones Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamMembers.flatMap(member => 
                      member.milestones.map((milestone, index) => (
                        <div key={`${member.id}-${index}`} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <Award className="h-5 w-5 text-yellow-600" />
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{member.name}</span>
                            <span className="text-gray-600"> {milestone}</span>
                          </div>
                          <span className="text-xs text-gray-500">Today</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Lead Redistribution */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-indigo-600" />
                    Suggested Lead Redistribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-indigo-900">Workload Imbalance Detected</h4>
                        <p className="text-sm text-indigo-700">
                          Sarah has 47 active leads while Michael has 23. Consider redistributing 8-12 leads for optimal performance.
                        </p>
                      </div>
                      <Button 
                        onClick={handleRedistribution}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Approve Redistribution
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards">
              <TeamRewardsManagement />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Growth History Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">KPI:</span>
                    {(['calls', 'demos', 'revenue'] as const).map((kpi) => (
                      <Button
                        key={kpi}
                        variant={selectedKPI === kpi ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedKPI(kpi)}
                        className="capitalize"
                      >
                        {kpi}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">Period:</span>
                    {(['week', 'month', 'quarter'] as const).map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                        className="capitalize"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={generatePDF} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* Analytics Placeholder */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth History Analytics</h3>
                  <p className="text-gray-600 mb-4">
                    Interactive charts showing {selectedKPI} performance trends over the past {selectedPeriod}
                  </p>
                  <p className="text-sm text-gray-500">
                    Charts and detailed analytics will be implemented here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTeamManagement;
