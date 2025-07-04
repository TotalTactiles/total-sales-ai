
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Target,
  Calendar,
  Phone,
  Mail,
  AlertTriangle,
  Trophy,
  Gift,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import BusinessOpsSnapshot from './BusinessOpsSnapshot';
import MetricModal from './MetricModal';
import TeamMemberModal from './TeamMemberModal';
import TeamPerformanceFilter from './TeamPerformanceFilter';

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
}

interface TeamReward {
  id: string;
  title: string;
  type: 'bonus' | 'time-off' | 'recognition';
  targetType: 'revenue' | 'calls' | 'demos';
  participants: Array<{
    id: string;
    name: string;
    initials: string;
    progress: number;
    currentValue: number;
    targetValue: number;
  }>;
  deadline: string;
  status: 'active' | 'completed' | 'expired';
}

const AIManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [teamFilterType, setTeamFilterType] = useState<string>('all');
  const [rewardFilter, setRewardFilter] = useState<string>('all');

  // Mock team data
  const teamMembers: TeamMember[] = [
    {
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
      riskLevel: 'low'
    },
    {
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
      riskLevel: 'high'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      initials: 'ER',
      revenue: 112000,
      target: 130000,
      conversion: 31.8,
      calls: 172,
      emails: 124,
      meetings: 19,
      trend: 'up',
      status: 'on-track',
      lastActivity: '4 hours ago',
      riskLevel: 'low'
    }
  ];

  const teamRewards: TeamReward[] = [
    {
      id: '1',
      title: 'Gold Bonus - $1K',
      type: 'bonus',
      targetType: 'revenue',
      participants: [
        { id: '1', name: 'Sarah Johnson', initials: 'SJ', progress: 80, currentValue: 40000, targetValue: 50000 },
        { id: '3', name: 'Emily Rodriguez', initials: 'ER', progress: 60, currentValue: 30000, targetValue: 50000 }
      ],
      deadline: '2024-02-29',
      status: 'active'
    },
    {
      id: '2',
      title: 'Friday Off Reward',
      type: 'time-off',
      targetType: 'calls',
      participants: [
        { id: '2', name: 'Michael Chen', initials: 'MC', progress: 92, currentValue: 92, targetValue: 100 }
      ],
      deadline: '2024-02-15',
      status: 'active'
    },
    {
      id: '3',
      title: 'Team Recognition Award',
      type: 'recognition',
      targetType: 'demos',
      participants: [
        { id: '1', name: 'Sarah Johnson', initials: 'SJ', progress: 75, currentValue: 12, targetValue: 16 },
        { id: '3', name: 'Emily Rodriguez', initials: 'ER', progress: 68, currentValue: 11, targetValue: 16 }
      ],
      deadline: '2024-02-20',
      status: 'active'
    }
  ];

  const handleTeamRewardsClick = () => {
    navigate('/manager/team');
  };

  const getFilteredTeamMembers = () => {
    switch (teamFilterType) {
      case 'top-converters':
        return [...teamMembers].sort((a, b) => b.conversion - a.conversion).slice(0, 3);
      case 'top-output':
        return [...teamMembers].sort((a, b) => (b.calls + b.emails) - (a.calls + a.emails)).slice(0, 3);
      case 'lowest-performers':
        return [...teamMembers].sort((a, b) => a.conversion - b.conversion).slice(0, 3);
      case 'flagged-reps':
        return teamMembers.filter(member => member.riskLevel === 'high').slice(0, 3);
      default:
        return teamMembers.slice(0, 3);
    }
  };

  const getFilteredRewards = () => {
    switch (rewardFilter) {
      case 'by-reward':
        return teamRewards;
      case 'top-3-progress':
        return teamRewards.map(reward => ({
          ...reward,
          participants: reward.participants.sort((a, b) => b.progress - a.progress).slice(0, 3)
        }));
      default:
        return teamRewards;
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-600" /> : 
           trend === 'down' ? <TrendingDown className="h-4 w-4 text-red-600" /> : 
           <div className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Metric modal configurations
  const getMetricModalConfig = (metricType: string) => {
    switch (metricType) {
      case 'team_revenue':
        return {
          title: 'Team Revenue',
          metric: '$340,320',
          change: '+12% from last month',
          insights: [
            'Strong performance across all team members',
            'Sarah leading with $145K revenue',
            'Michael needs support to reach target'
          ],
          recommendations: [
            'Focus on supporting Michael with deal closures',
            'Leverage Sarah\'s success strategies team-wide',
            'Schedule team performance review'
          ],
          deepDiveLink: '/manager/reports',
          deepDiveLinkText: 'View Revenue Analytics'
        };
      case 'at_risk':
        return {
          title: 'At Risk Reps',
          metric: '1 Rep',
          change: 'Needs immediate attention',
          insights: [
            'Michael Chen showing performance decline',
            '25% below target with high risk level',
            'Recent activity drop detected'
          ],
          recommendations: [
            'Schedule 1-on-1 with Michael immediately',
            'Review workload and provide support',
            'Consider temporary assistance'
          ],
          deepDiveLink: '/manager/team',
          deepDiveLinkText: 'View Team Details'
        };
      case 'pipeline':
        return {
          title: 'Pipeline Value',
          metric: '+$137,700',
          change: 'Expected this quarter',
          insights: [
            'Strong pipeline growth across team',
            'Multiple high-value deals in progress',
            'Conversion rates improving'
          ],
          recommendations: [
            'Focus on deal acceleration',
            'Review pricing strategies',
            'Prepare for quota achievement'
          ],
          deepDiveLink: '/manager/pipeline',
          deepDiveLinkText: 'View Pipeline Details'
        };
      case 'active_rewards':
        return {
          title: 'Active Rewards',
          metric: '3 Rewards',
          change: 'Team incentives running',
          insights: [
            'Multiple team members engaged in rewards',
            'High participation across all programs',
            'Strong motivation indicators'
          ],
          recommendations: [
            'Monitor reward progress closely',
            'Consider additional incentives',
            'Celebrate upcoming achievements'
          ],
          deepDiveLink: '/manager/team',
          deepDiveLinkText: 'View Team Rewards'
        };
      default:
        return null;
    }
  };

  const displayedMembers = getFilteredTeamMembers();
  const displayedRewards = getFilteredRewards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ManagerNavigation />
      
      <div className="pt-[60px] px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600">Overview and team management</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Manager View
            </Badge>
          </div>

          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedMetric('team_revenue')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Team Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">$340,320</div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card 
              className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedMetric('at_risk')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">At Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">1</div>
                <p className="text-xs text-red-600">Rep needs attention</p>
              </CardContent>
            </Card>

            <Card 
              className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedMetric('pipeline')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pipeline</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">+$137,700</div>
                <p className="text-xs text-blue-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Expected this quarter
                </p>
              </CardContent>
            </Card>

            <Card 
              className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedMetric('active_rewards')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Rewards</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <p className="text-xs text-purple-600">Team incentives running</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Business Operations */}
            <div className="lg:col-span-2">
              <BusinessOpsSnapshot />
            </div>

            {/* Right Column - Team Performance */}
            <div className="space-y-6">
              {/* Team Performance Grid - Moved up per requirements */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Team Performance
                    </CardTitle>
                  </div>
                  <TeamPerformanceFilter 
                    value={teamFilterType}
                    onChange={setTeamFilterType}
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
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
                        {getTrendIcon(member.trend)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Revenue</div>
                          <div className="font-semibold">${member.revenue.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Conversion</div>
                          <div className="font-semibold">{member.conversion}%</div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={(member.revenue / member.target) * 100} 
                        className="mt-2" 
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Team Rewards Snapshot - Fixed logic per requirements */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-orange-600" />
                      Rewards Snapshot
                    </CardTitle>
                    <Select value={rewardFilter} onValueChange={setRewardFilter}>
                      <SelectTrigger className="w-40 h-8">
                        <Filter className="h-3 w-3 mr-1" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rewards</SelectItem>
                        <SelectItem value="by-reward">By Reward</SelectItem>
                        <SelectItem value="top-3-progress">Top 3 Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayedRewards.map((reward) => (
                    <div key={reward.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{reward.title}</h4>
                        <Badge className="text-xs bg-orange-100 text-orange-800">
                          {reward.participants.length} reps
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {reward.participants.map((participant) => (
                          <div key={participant.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs">
                                    {participant.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-700">{participant.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-orange-600">
                                {participant.progress}%
                              </span>
                            </div>
                            <Progress value={participant.progress} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={handleTeamRewardsClick}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  >
                    View All Team Rewards
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedMetric && (
        <MetricModal
          isOpen={!!selectedMetric}
          onClose={() => setSelectedMetric(null)}
          type={selectedMetric as any}
          {...getMetricModalConfig(selectedMetric)!}
        />
      )}

      {selectedMember && (
        <TeamMemberModal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          member={selectedMember as any}
        />
      )}
    </div>
  );
};

export default AIManagerDashboard;
