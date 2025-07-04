
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
  Gift,
  Search,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import TeamRewardsManagement from '@/components/Manager/TeamRewardsManagement';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  avgScore: number;
  demos: number;
  deals: number;
  revenue: number;
  rewardProgress: number;
  conversionRate: number;
  avgDealSize: number;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'time' | 'member' | 'activity'>('all');

  // Mock team data with enhanced features for Team in Review
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      initials: 'SJ',
      role: 'Senior Sales Rep',
      avgScore: 94,
      demos: 23,
      deals: 8,
      revenue: 145000,
      rewardProgress: 80,
      conversionRate: 34.2,
      avgDealSize: 18125,
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
      role: 'Sales Rep',
      avgScore: 71,
      demos: 15,
      deals: 4,
      revenue: 89000,
      rewardProgress: 92,
      conversionRate: 28.1,
      avgDealSize: 22250,
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
      role: 'Sales Rep',
      avgScore: 88,
      demos: 19,
      deals: 6,
      revenue: 112000,
      rewardProgress: 68,
      conversionRate: 31.8,
      avgDealSize: 18667,
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

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-blue-50">
      <ManagerNavigation />
      
      <div className="pt-[60px] px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                <p className="text-gray-600">Enhanced team insights and management tools</p>
              </div>
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="overview">Team Overview</TabsTrigger>
                <TabsTrigger value="rewards">Team Rewards</TabsTrigger>
                <TabsTrigger value="review">Team in Review</TabsTrigger>
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

              {/* AI Manager Insights */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Manager Insights
                    <Badge className="bg-white/20 text-white text-xs ml-auto">
                      Demo Mode
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-800 italic">
                        "James is 80% toward his bonus – push 2 more deals before Friday."
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 italic">
                        "Team reward completion rate down 12% this month. Recommend checking in."
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 italic">
                        "Sarah closed most this week. Marcus's drop detected. Suggest peer pairing."
                      </p>
                    </div>
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

            <TabsContent value="review" className="space-y-6">
              {/* Team in Review Section */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Team in Review
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={generatePDF} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="flex gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setFilterType('time')}>
                      Time Filter
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setFilterType('activity')}>
                      Activity Type
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Table Layout */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-600">Name</th>
                          <th className="text-left p-4 font-medium text-gray-600">Role</th>
                          <th className="text-left p-4 font-medium text-gray-600">Avg Score</th>
                          <th className="text-left p-4 font-medium text-gray-600">Demos</th>
                          <th className="text-left p-4 font-medium text-gray-600">Deals</th>
                          <th className="text-left p-4 font-medium text-gray-600">Revenue</th>
                          <th className="text-left p-4 font-medium text-gray-600">Reward Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map((member) => (
                          <tr key={member.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                                    {member.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <Badge className={`text-xs ${getStatusColor(member.status)}`}>
                                    {member.status}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{member.role}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{member.avgScore}</span>
                                {getTrendIcon(member.kpis.trend)}
                              </div>
                            </td>
                            <td className="p-4 font-medium">{member.demos}</td>
                            <td className="p-4 font-medium">{member.deals}</td>
                            <td className="p-4 font-medium">${member.revenue.toLocaleString()}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-orange-500 h-2 rounded-full"
                                    style={{ width: `${member.rewardProgress}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{member.rewardProgress}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* AI Summary Area */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      AI Summary (Demo Mode)
                    </h4>
                    <p className="text-sm text-gray-700 italic">
                      "Sarah closed most this week. Marcus's drop detected. Suggest peer pairing. Mike's demo ratio dropped 18% this week - suggest peer coaching."
                    </p>
                  </div>
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
