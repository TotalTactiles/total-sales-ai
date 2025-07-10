import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, AlertTriangle, Trophy, Brain, BarChart3, Clock, Phone, Activity, Download, Filter, Calendar, Award, Star, Gift } from 'lucide-react';
import { BusinessSnapshotModal } from './BusinessSnapshotModal';
import { MetricCardModal } from './MetricCardModal';
import TeamNudgesCard from './TeamNudgesCard';
interface TeamMember {
  id: string;
  name: string;
  initials: string;
  revenue: number;
  target: number;
  conversion: number;
  calls: number;
  emails: number;
  meetings: number;
  trend: 'up' | 'down' | 'stable';
  status: 'on-track' | 'behind' | 'ahead';
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high';
  isOnline: boolean;
  role?: string;
}
interface MarketingMetric {
  id: string;
  source: string;
  leads: number;
  conversion: number;
  revenue: number;
  cost: number;
  roas: number;
  trend: 'up' | 'down' | 'stable';
}
interface TeamReward {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  participants: string[];
  endDate: string;
  reward: string;
  type: 'individual' | 'team';
}
const RestoredManagerDashboard: React.FC = () => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [teamFilterType, setTeamFilterType] = useState<string>('all');
  const [marketingFilter, setMarketingFilter] = useState<string>('all');
  const [salesFilter, setSalesFilter] = useState<string>('all');
  const teamMembers: TeamMember[] = [{
    id: '1',
    name: 'Sarah Johnson',
    initials: 'SJ',
    revenue: 145000,
    target: 150000,
    conversion: 34.2,
    calls: 198,
    emails: 147,
    meetings: 23,
    trend: 'up',
    status: 'on-track',
    lastActivity: '2 hours ago',
    riskLevel: 'low',
    isOnline: true,
    role: 'Senior Rep'
  }, {
    id: '2',
    name: 'Michael Chen',
    initials: 'MC',
    revenue: 89000,
    target: 120000,
    conversion: 28.1,
    calls: 143,
    emails: 98,
    meetings: 15,
    trend: 'down',
    status: 'behind',
    lastActivity: '1 day ago',
    riskLevel: 'high',
    isOnline: false,
    role: 'Sales Rep'
  }, {
    id: '3',
    name: 'Emily Rodriguez',
    initials: 'ER',
    revenue: 112000,
    target: 110000,
    conversion: 31.8,
    calls: 167,
    emails: 124,
    meetings: 19,
    trend: 'up',
    status: 'ahead',
    lastActivity: '30 minutes ago',
    riskLevel: 'low',
    isOnline: true,
    role: 'Sales Rep'
  }];
  const businessMetrics = [{
    id: 'team_revenue',
    title: 'Team Revenue',
    value: '$340,320',
    change: '+12% from last month',
    icon: DollarSign,
    color: 'green',
    insights: ['Strong performance across all team members', 'Sarah leading with $145K revenue', 'Enterprise deals driving growth'],
    recommendations: ['Focus on supporting underperforming reps', 'Leverage top performer strategies team-wide', 'Schedule team performance review'],
    deepDiveLink: '/manager/reports',
    chartData: [{
      name: 'Jan',
      value: 280000
    }, {
      name: 'Feb',
      value: 295000
    }, {
      name: 'Mar',
      value: 340320
    }]
  }, {
    id: 'at_risk',
    title: 'At Risk',
    value: '1',
    change: 'Rep needs attention',
    icon: AlertTriangle,
    color: 'red',
    insights: ['Michael Chen showing performance decline', '25% below target with high risk level', 'Recent activity drop detected'],
    recommendations: ['Schedule 1-on-1 with Michael immediately', 'Review workload and provide support', 'Consider temporary assistance'],
    deepDiveLink: '/manager/team'
  }, {
    id: 'pipeline_delta',
    title: 'Pipeline Delta',
    value: '+$137,700',
    change: 'Expected this quarter',
    icon: Target,
    color: 'blue',
    insights: ['Strong pipeline growth across team', 'Multiple high-value deals in progress', 'Conversion rates improving'],
    recommendations: ['Focus on deal acceleration', 'Review pricing strategies', 'Prepare for quota achievement'],
    deepDiveLink: '/manager/business-ops'
  }, {
    id: 'active_rewards',
    title: 'Active Rewards',
    value: '3',
    change: 'Team incentives running',
    icon: Trophy,
    color: 'yellow',
    insights: ['Multiple team members engaged in rewards', 'High participation across all programs', 'Strong motivation indicators'],
    recommendations: ['Monitor reward progress closely', 'Consider additional incentives', 'Celebrate upcoming achievements'],
    deepDiveLink: '/manager/team'
  }, {
    id: 'month_complete',
    title: 'Month Complete',
    value: '68%',
    change: '21 days remaining',
    icon: Calendar,
    color: 'purple',
    insights: ['On track to meet monthly targets', 'Strong momentum in final weeks', 'Team engagement high'],
    recommendations: ['Maintain current pace', 'Focus on pipeline closure', 'Prepare for month-end push'],
    deepDiveLink: '/manager/business-ops'
  }];
  const marketingMetrics: MarketingMetric[] = [{
    id: '1',
    source: 'Google Ads',
    leads: 157,
    conversion: 24.2,
    revenue: 45000,
    cost: 8500,
    roas: 5.3,
    trend: 'up'
  }, {
    id: '2',
    source: 'Meta Ads',
    leads: 203,
    conversion: 18.7,
    revenue: 38000,
    cost: 12000,
    roas: 3.2,
    trend: 'down'
  }, {
    id: '3',
    source: 'LinkedIn',
    leads: 89,
    conversion: 31.5,
    revenue: 67000,
    cost: 15000,
    roas: 4.5,
    trend: 'up'
  }, {
    id: '4',
    source: 'Referrals',
    leads: 45,
    conversion: 48.9,
    revenue: 125000,
    cost: 2500,
    roas: 50.0,
    trend: 'up'
  }];
  const teamRewards: TeamReward[] = [{
    id: '1',
    title: 'Q4 Revenue Champion',
    description: 'First to reach $150K in quarterly revenue',
    progress: 340320,
    target: 600000,
    participants: ['Sarah Johnson', 'Emily Rodriguez', 'Michael Chen'],
    endDate: '2024-12-31',
    reward: '$2,500 Bonus + Trophy',
    type: 'individual'
  }, {
    id: '2',
    title: 'Team Collaboration Sprint',
    description: 'Complete 50 team referrals this month',
    progress: 32,
    target: 50,
    participants: ['All Team Members'],
    endDate: '2024-03-31',
    reward: 'Team Dinner + Half Day Off',
    type: 'team'
  }, {
    id: '3',
    title: 'Client Satisfaction Hero',
    description: 'Maintain 90%+ satisfaction score',
    progress: 94,
    target: 90,
    participants: ['Sarah Johnson', 'Emily Rodriguez'],
    endDate: '2024-04-15',
    reward: 'Recognition + $500 Gift Card',
    type: 'individual'
  }];
  const businessSnapshots = [{
    id: 'revenue-trend',
    title: 'Revenue Trends',
    value: '+15.2%',
    subtitle: 'vs last month',
    icon: DollarSign,
    color: 'green',
    insights: ['Q4 trending 23% above target', 'Enterprise deals driving growth', 'Consistent month-over-month improvement'],
    deepDive: 'Reports > Revenue Analytics',
    trend: 'up' as const,
    chartData: [{
      name: 'Oct',
      value: 289000
    }, {
      name: 'Nov',
      value: 312000
    }, {
      name: 'Dec',
      value: 340320
    }],
    chartType: 'line' as const
  }, {
    id: 'objection-types',
    title: 'Top Objections',
    value: 'Price (34%)',
    subtitle: 'Budget concerns',
    icon: AlertTriangle,
    color: 'red',
    insights: ['Price objections up 12%', 'Need value prop training', 'Budget season impact visible'],
    deepDive: 'Team > Coaching Logs',
    trend: 'down' as const,
    chartData: [{
      name: 'Price',
      value: 34
    }, {
      name: 'Timing',
      value: 28
    }, {
      name: 'Authority',
      value: 21
    }, {
      name: 'Need',
      value: 17
    }],
    chartType: 'pie' as const
  }, {
    id: 'follow-up-delays',
    title: 'Follow-up Speed',
    value: '2.8 days',
    subtitle: 'avg response time',
    icon: Clock,
    color: 'yellow',
    insights: ['Goal: Under 24 hours', '3 reps consistently delayed', 'Impact on conversion rates'],
    deepDive: 'Team Analytics > Response Times',
    trend: 'neutral' as const
  }, {
    id: 'ai-alerts',
    title: 'AI Alert Heatmap',
    value: '12 Active',
    subtitle: '3 high priority',
    icon: Brain,
    color: 'purple',
    insights: ['Hot leads going cold', 'Rep burnout indicators', 'Automated follow-up opportunities'],
    deepDive: 'AI Assistant > Alert Center',
    trend: 'up' as const
  }, {
    id: 'goal-progress',
    title: 'Goal Progress',
    value: '78%',
    subtitle: 'Q4 target',
    icon: Target,
    color: 'blue',
    insights: ['On track for Q4 goals', 'Team performance strong', 'Accelerating toward target'],
    deepDive: 'Business Ops > Goal Tracking',
    trend: 'up' as const
  }, {
    id: 'activity-volume',
    title: 'Activity Volume',
    value: '847',
    subtitle: 'calls this week',
    icon: Phone,
    color: 'green',
    insights: ['Activity up 18% vs last week', 'Quality metrics maintained', 'High engagement across team'],
    deepDive: 'Team > Activity Reports',
    trend: 'up' as const
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead':
        return 'bg-green-100 text-green-800';
      case 'on-track':
        return 'bg-blue-100 text-blue-800';
      case 'behind':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getMetricCardColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
      case 'red':
        return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200';
      case 'blue':
        return 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200';
      case 'yellow':
        return 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200';
      case 'purple':
        return 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200';
      default:
        return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200';
    }
  };
  const getSnapshotCardColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-gradient-to-br from-green-400 to-green-500';
      case 'red':
        return 'bg-gradient-to-br from-red-400 to-red-500';
      case 'blue':
        return 'bg-gradient-to-br from-blue-400 to-blue-500';
      case 'yellow':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-500';
      case 'purple':
        return 'bg-gradient-to-br from-purple-400 to-purple-500';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
    }
  };
  const filteredTeamMembers = teamMembers.filter(member => {
    if (teamFilterType === 'all') return true;
    if (teamFilterType === 'performance' && member.status === 'behind') return true;
    if (teamFilterType === 'coaching' && member.conversion < 30) return true;
    if (teamFilterType === 'burnout' && member.riskLevel === 'high') return true;
    if (teamFilterType === 'goals' && member.revenue < member.target) return true;
    if (teamFilterType === 'activity' && member.calls < 150) return true;
    return false;
  });
  const filteredMarketingMetrics = marketingMetrics.filter(metric => {
    if (marketingFilter === 'all') return true;
    if (marketingFilter === 'high-roas' && metric.roas > 4) return true;
    if (marketingFilter === 'low-conversion' && metric.conversion < 25) return true;
    if (marketingFilter === 'trending-up' && metric.trend === 'up') return true;
    return false;
  });
  return <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-sm text-gray-600">AI-enhanced team intelligence and control center</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Weekly Digest
          </Button>
          
        </div>
      </div>

      {/* Top Business Metrics - 5 Cards in Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {businessMetrics.map(metric => {
        const IconComponent = metric.icon;
        return <Card key={metric.id} className={`${getMetricCardColor(metric.color)} border hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-105`} onClick={() => setSelectedMetric(metric)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={`h-5 w-5 text-${metric.color}-600`} />
                </div>
                <div className="space-y-1">
                  <p className={`text-sm font-medium text-${metric.color}-800`}>{metric.title}</p>
                  <p className={`text-xl font-bold text-${metric.color}-900`}>{metric.value}</p>
                  <p className={`text-xs text-${metric.color}-700`}>{metric.change}</p>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Monthly Forecast - Redesigned */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Forecast</h3>
              <p className="text-sm text-gray-600">Progress to Goal</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">+12%</div>
              <div className="text-sm text-gray-500">above pace</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-600">$0</span>
              <span className="text-purple-600">$425,000 Achieved</span>
              <span className="text-gray-600">$400,000 Target</span>
            </div>
            <Progress value={106} className="h-4" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>68% Month Complete</span>
              <span>106% Goal Progress</span>
              <span>Above pace by $25,000</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Operations Snapshot */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Business Operations Snapshot
            <Badge className="bg-white/20 text-white text-xs ml-auto">Real-time</Badge>
          </CardTitle>
          <p className="text-purple-100 text-sm">AI-powered insights aligned with your business goals</p>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {businessSnapshots.map(snapshot => {
            const IconComponent = snapshot.icon;
            return <div key={snapshot.id} onClick={() => setSelectedSnapshot(snapshot)} className={`${getSnapshotCardColor(snapshot.color)} text-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 h-28 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                    {snapshot.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                    {snapshot.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm leading-tight">{snapshot.title}</h4>
                    <div className="text-lg font-bold leading-tight">{snapshot.value}</div>
                    <p className="text-xs opacity-90 leading-tight">{snapshot.subtitle}</p>
                  </div>
                </div>;
          })}
          </div>
        </CardContent>
      </Card>

      {/* Marketing & Sales Performance */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Marketing & Sales Performance
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={marketingFilter} onValueChange={setMarketingFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="high-roas">High ROAS</SelectItem>
                  <SelectItem value="low-conversion">Low Conversion</SelectItem>
                  <SelectItem value="trending-up">Trending Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMarketingMetrics.map(metric => <div key={metric.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{metric.source}</h4>
                  {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <div className="text-gray-600 text-xs">Leads</div>
                    <div className="font-semibold">{metric.leads}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Conversion</div>
                    <div className="font-semibold text-blue-600">{metric.conversion}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Revenue</div>
                    <div className="font-semibold text-green-600">${metric.revenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">ROAS</div>
                    <div className="font-semibold text-purple-600">{metric.roas}x</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Cost: ${metric.cost.toLocaleString()}
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Section with Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Team Performance
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={teamFilterType} onValueChange={setTeamFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Team</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="coaching">Coaching</SelectItem>
                      <SelectItem value="burnout">Burnout</SelectItem>
                      <SelectItem value="goals">Goals</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeamMembers.map(member => <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      {member.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {member.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <div className="text-gray-600 text-xs">Revenue</div>
                        <div className="font-semibold text-green-600">${member.revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Calls</div>
                        <div className="font-semibold">{member.calls}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Conversion</div>
                        <div className="font-semibold text-blue-600">{member.conversion}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Status</div>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Target Progress</span>
                        <span className="font-medium">{Math.round(member.revenue / member.target * 100)}%</span>
                      </div>
                      <Progress value={member.revenue / member.target * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getRiskColor(member.riskLevel)}`} />
                        <span className="text-xs text-gray-500">{member.riskLevel} risk</span>
                      </div>
                      <span className="text-xs text-gray-500">{member.lastActivity}</span>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Nudges Card */}
        <div className="lg:col-span-1">
          <TeamNudgesCard />
        </div>
      </div>

      {/* Team Rewards Progress */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Team Rewards Progress
          </CardTitle>
          <p className="text-sm text-gray-600">Active incentives and achievements</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamRewards.map(reward => <div key={reward.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {reward.type === 'team' ? <Users className="h-4 w-4 text-yellow-600" /> : <Award className="h-4 w-4 text-yellow-600" />}
                    <Badge className={reward.type === 'team' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                      {reward.type}
                    </Badge>
                  </div>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{reward.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {reward.id === '1' ? `$${reward.progress.toLocaleString()}` : reward.progress}
                      {' / '}
                      {reward.id === '1' ? `$${reward.target.toLocaleString()}` : reward.target}
                    </span>
                  </div>
                  <Progress value={reward.id === '1' ? reward.progress / reward.target * 100 : reward.progress / reward.target * 100} className="h-2" />
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    <span>{reward.reward}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Ends: {reward.endDate}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">{reward.participants.length}</span> participant{reward.participants.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedSnapshot && <BusinessSnapshotModal isOpen={!!selectedSnapshot} onClose={() => setSelectedSnapshot(null)} snapshot={selectedSnapshot} />}

      {selectedMetric && <MetricCardModal isOpen={!!selectedMetric} onClose={() => setSelectedMetric(null)} metric={selectedMetric} />}
    </div>;
};
export default RestoredManagerDashboard;