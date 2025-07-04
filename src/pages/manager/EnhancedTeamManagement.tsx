
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Award, 
  Settings, 
  Search, 
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Target,
  Brain,
  UserCheck
} from 'lucide-react';
import { demoTeamMembers, demoManagerRecommendations } from '@/data/demoData';
import ManagerTeamTable from '@/components/Manager/ManagerTeamTable';
import DetailedTeamTable from '@/components/Manager/DetailedTeamTable';
import TeamRewardsManagement from '@/components/Manager/TeamRewardsManagement';

const EnhancedTeamManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('This Week');
  const [activityType, setActivityType] = useState('All Activities');

  // Mock sales reps data
  const salesRepsData = [
    { name: 'Sarah Chen', deals: 12, value: '$145K', conversion: '28%', status: 'exceeding', calls: 89, training: 92, emoji: '🔥' },
    { name: 'Mike Johnson', deals: 8, value: '$98K', conversion: '22%', status: 'on-track', calls: 67, training: 78, emoji: '📈' },
    { name: 'Emma Davis', deals: 6, value: '$67K', conversion: '18%', status: 'needs-support', calls: 45, training: 56, emoji: '⚠️' },
    { name: 'James Wilson', deals: 10, value: '$123K', conversion: '25%', status: 'on-track', calls: 78, training: 84, emoji: '📊' }
  ];

  const teamInReviewData = [
    {
      id: 'sj-001',
      name: 'Sarah Johnson',
      role: 'Senior Sales Rep',
      avatar: 'SJ',
      avgScore: 94,
      trend: 'up',
      streakStatus: 'Hot Streak',
      demos: 23,
      deals: 8,
      revenue: 145000,
      rewardProgress: 80
    },
    {
      id: 'mc-002', 
      name: 'Michael Chen',
      role: 'Sales Rep',
      avatar: 'MC',
      avgScore: 71,
      trend: 'down',
      streakStatus: 'Slowing',
      demos: 15,
      deals: 4,
      revenue: 89000,
      rewardProgress: 92
    },
    {
      id: 'er-003',
      name: 'Emily Rodriguez', 
      role: 'Sales Rep',
      avatar: 'ER',
      avgScore: 88,
      trend: 'up',
      streakStatus: 'Moderate',
      demos: 19,
      deals: 6,
      revenue: 112000,
      rewardProgress: 68
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStreakColor = (status: string) => {
    switch (status) {
      case 'Hot Streak': return 'bg-green-100 text-green-800';
      case 'Slowing': return 'bg-red-100 text-red-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Team Management</h1>
          <p className="text-slate-600">Enhanced team insights and management tools</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Overview
            </TabsTrigger>
            <TabsTrigger value="sales-reps" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Sales Reps
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Team Rewards
            </TabsTrigger>
          </TabsList>

          {/* Team Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {/* Team in Review Section (Merged from previous subtab) */}
              <Card className="rounded-lg shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <CardTitle>Team in Review</CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <select 
                          value={timeFilter} 
                          onChange={(e) => setTimeFilter(e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option>This Week</option>
                          <option>This Month</option>
                          <option>Last Quarter</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <select 
                          value={activityType} 
                          onChange={(e) => setActivityType(e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option>All Activities</option>
                          <option>Calls</option>
                          <option>Demos</option>
                          <option>Deals</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search team members..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamInReviewData.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.role}</p>
                            <Badge className={getStreakColor(member.streakStatus)}>
                              {member.streakStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="flex items-center gap-1">
                              <span className="text-xl font-bold">{member.avgScore}</span>
                              {getTrendIcon(member.trend)}
                            </div>
                            <p className="text-xs text-gray-500">Avg Score</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{member.demos}</p>
                            <p className="text-xs text-gray-500">Demos</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{member.deals}</p>
                            <p className="text-xs text-gray-500">Deals</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">${member.revenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Revenue</p>
                          </div>
                          <div className="text-center min-w-[100px]">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                              <div 
                                className="bg-orange-500 h-2 rounded-full" 
                                style={{ width: `${member.rewardProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">{member.rewardProgress}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* AI Summary */}
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-900">AI Summary (Demo Mode)</h4>
                      </div>
                      <p className="text-purple-800 text-sm italic">
                        "Sarah closed most this week. Marcus's drop detected. Suggest peer pairing. Mike's demo ratio dropped 18% this week - suggest peer coaching."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Smart Coaching Alerts */}
              <Card className="rounded-lg shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Smart Coaching Alerts
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        4 Active
                      </Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoManagerRecommendations.map((rec) => (
                      <div key={rec.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {rec.rep_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-900">{rec.rep_name}</h4>
                            <p className="text-sm text-red-700">{rec.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                            Schedule 1-on-1
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            {rec.action}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Team Performance Table */}
              <DetailedTeamTable />

              {/* AI Manager Insights */}
              <Card className="rounded-lg shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Manager Insights
                    <Badge variant="outline" className="bg-gray-100 text-gray-600">
                      Demo Mode
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Bonus Alert</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        "James is 80% toward his bonus — push 2 more deals before Friday."
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Performance</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        "Team reward completion rate down 12% this month. Recommend checking in."
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Success</span>
                      </div>
                      <p className="text-sm text-green-800">
                        "Sarah closed most this week. Marcus's drop detected. Suggest peer pairing."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Reps Tab */}
          <TabsContent value="sales-reps" className="mt-6">
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Individual Rep Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesRepsData.map((rep, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{rep.emoji}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{rep.name}</h4>
                          <p className="text-sm text-muted-foreground">{rep.deals} deals • {rep.value} pipeline • {rep.calls} calls</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{rep.conversion} conversion</span>
                        <span className="text-sm text-muted-foreground">{rep.training}% training</span>
                        <Badge variant={
                          rep.status === 'exceeding' ? 'default' :
                          rep.status === 'on-track' ? 'secondary' :
                          'destructive'
                        }>
                          {rep.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Rewards Tab */}
          <TabsContent value="rewards" className="mt-6">
            <TeamRewardsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedTeamManagement;
