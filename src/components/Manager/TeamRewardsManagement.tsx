
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift, 
  Plus, 
  Edit3, 
  Trash2, 
  Trophy, 
  Calendar,
  Target,
  TrendingUp,
  Phone,
  DollarSign,
  Table,
  LayoutGrid,
  Users,
  Award
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  goalType: 'calls' | 'revenue' | 'demos' | 'meetings';
  targetValue: number;
  deadline: string;
  participants: Array<{
    id: string;
    name: string;
    initials: string;
    progress: number;
    currentValue: number;
    status: 'on-track' | 'behind' | 'ahead';
  }>;
  status: 'active' | 'completed' | 'expired';
  rewardValue: string;
}

const TeamRewardsManagement: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'week' | 'month' | 'quarter'>('month');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock rewards data
  const rewards: Reward[] = [
    {
      id: '1',
      name: '$1K Revenue Bonus',
      goalType: 'revenue',
      targetValue: 50000,
      deadline: '2024-01-31',
      rewardValue: '$1,000',
      status: 'active',
      participants: [
        { id: '1', name: 'Sarah Johnson', initials: 'SJ', progress: 80, currentValue: 40000, status: 'on-track' },
        { id: '2', name: 'Michael Chen', initials: 'MC', progress: 65, currentValue: 32500, status: 'behind' },
        { id: '3', name: 'Emily Rodriguez', initials: 'ER', progress: 90, currentValue: 45000, status: 'ahead' }
      ]
    },
    {
      id: '2',
      name: 'Call Master Challenge',
      goalType: 'calls',
      targetValue: 100,
      deadline: '2024-01-15',
      rewardValue: 'Day Off',
      status: 'active',
      participants: [
        { id: '2', name: 'Michael Chen', initials: 'MC', progress: 85, currentValue: 85, status: 'on-track' },
        { id: '1', name: 'Sarah Johnson', initials: 'SJ', progress: 75, currentValue: 75, status: 'behind' }
      ]
    },
    {
      id: '3',
      name: 'Demo Booking Sprint',
      goalType: 'demos',
      targetValue: 15,
      deadline: '2024-01-20',
      rewardValue: 'Team Dinner',
      status: 'active',
      participants: [
        { id: '3', name: 'Emily Rodriguez', initials: 'ER', progress: 60, currentValue: 9, status: 'behind' },
        { id: '1', name: 'Sarah Johnson', initials: 'SJ', progress: 80, currentValue: 12, status: 'ahead' }
      ]
    }
  ];

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case 'calls': return Phone;
      case 'revenue': return DollarSign;
      case 'demos': return Target;
      case 'meetings': return Calendar;
      default: return Trophy;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value: number, type: string) => {
    if (type === 'revenue') return `$${value.toLocaleString()}`;
    return value.toString();
  };

  const getProgressBadge = (participants: Reward['participants']) => {
    const progressing = participants.filter(p => p.status === 'ahead' || p.progress >= 80).length;
    const closeToGoal = participants.filter(p => p.progress >= 70 && p.progress < 90).length;
    const behind = participants.filter(p => p.status === 'behind' || p.progress < 50).length;

    if (progressing > 0) return { text: 'Most Progressing', color: 'bg-green-100 text-green-800' };
    if (closeToGoal > 0) return { text: 'Close to Goal', color: 'bg-yellow-100 text-yellow-800' };
    if (behind > 0) return { text: 'Fallen Behind', color: 'bg-red-100 text-red-800' };
    return { text: 'Active', color: 'bg-blue-100 text-blue-800' };
  };

  // Mock statistics for bird's eye view
  const rewardStats = {
    totalRewards: rewards.length,
    teamEnrollment: 85, // percentage
    topPerformer: 'Sarah Johnson',
    avgProgress: 75
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Rewards</h2>
          <p className="text-gray-600">Manage team incentives and track progress</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Reward
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View by:</span>
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedView === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView(period)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Cards
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Table className="h-4 w-4 mr-1" />
            Table
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Rewards</TabsTrigger>
          <TabsTrigger value="overview">Birds-Eye View</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rewards.map((reward) => {
                const IconComponent = getGoalTypeIcon(reward.goalType);
                const badge = getProgressBadge(reward.participants);
                
                return (
                  <Card key={reward.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <IconComponent className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{reward.name}</CardTitle>
                            <p className="text-sm text-gray-600">
                              {reward.goalType} • Target: {formatValue(reward.targetValue, reward.goalType)}
                            </p>
                          </div>
                        </div>
                        <Badge className={badge.color}>
                          {badge.text}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Due: {new Date(reward.deadline).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-orange-600">
                          Reward: {reward.rewardValue}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Progress by Rep</h4>
                        {reward.participants.map((participant) => (
                          <div key={participant.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                    {participant.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{participant.name}</span>
                                <Badge className={`text-xs ${getStatusColor(participant.status)}`}>
                                  {participant.status}
                                </Badge>
                              </div>
                              <span className="text-sm text-gray-600">
                                {participant.progress}%
                              </span>
                            </div>
                            <Progress value={participant.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{formatValue(participant.currentValue, reward.goalType)}</span>
                              <span>{formatValue(reward.targetValue - participant.currentValue, reward.goalType)} to go</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-600">Reward</th>
                        <th className="text-left p-4 font-medium text-gray-600">Type</th>
                        <th className="text-left p-4 font-medium text-gray-600">Participants</th>
                        <th className="text-left p-4 font-medium text-gray-600">Progress</th>
                        <th className="text-left p-4 font-medium text-gray-600">Deadline</th>
                        <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rewards.map((reward) => (
                        <tr key={reward.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                {React.createElement(getGoalTypeIcon(reward.goalType), { 
                                  className: "h-4 w-4 text-orange-600" 
                                })}
                              </div>
                              <div>
                                <div className="font-medium">{reward.name}</div>
                                <div className="text-sm text-gray-600">{reward.rewardValue}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 capitalize">{reward.goalType}</td>
                          <td className="p-4">
                            <div className="flex -space-x-2">
                              {reward.participants.slice(0, 3).map((participant) => (
                                <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                    {participant.initials}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {reward.participants.length > 3 && (
                                <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                  +{reward.participants.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {Math.round(reward.participants.reduce((sum, p) => sum + p.progress, 0) / reward.participants.length)}% avg
                              </div>
                              <Progress 
                                value={reward.participants.reduce((sum, p) => sum + p.progress, 0) / reward.participants.length} 
                                className="h-2 w-20" 
                              />
                            </div>
                          </td>
                          <td className="p-4 text-sm">{new Date(reward.deadline).toLocaleDateString()}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{rewardStats.totalRewards}</div>
                <div className="text-sm text-gray-600">Total Rewards in Play</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{rewardStats.teamEnrollment}%</div>
                <div className="text-sm text-gray-600">Team Actively Enrolled</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">{rewardStats.topPerformer}</div>
                <div className="text-sm text-gray-600">Top Performer</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{rewardStats.avgProgress}%</div>
                <div className="text-sm text-gray-600">Average Progress</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-orange-600" />
                Quick Reward Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200"
                  onClick={() => console.log('Create call target reward')}
                >
                  <Phone className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Call Target</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200"
                  onClick={() => console.log('Create revenue goal reward')}
                >
                  <DollarSign className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Revenue Goal</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200"
                  onClick={() => console.log('Create demo booking reward')}
                >
                  <Target className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Demo Booking</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamRewardsManagement;
