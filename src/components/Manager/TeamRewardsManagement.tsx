
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Trophy, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  Target,
  TrendingUp,
  Phone,
  DollarSign,
  Table,
  LayoutGrid,
  Users,
  Award,
  Download,
  MessageSquare,
  Star,
  Flame,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';

// Enhanced team performance data with new columns
const enhancedTeamData = [
  {
    id: 'sj-001',
    name: 'Sarah Johnson',
    role: 'Senior Sales Rep',
    avatar: 'SJ',
    mood: '😊',
    wins: 8,
    streak: 5,
    improvements: 'Objection handling +24%',
    highlight: 'Closed biggest deal this month',
    burnoutRisk: 'Low',
    lastActivity: '21m ago',
    rewardProgress: 85,
    badges: ['🏆', '🔥', '📞'],
    aiInsights: 'Performs better between 2-4pm',
    expandedData: {
      recentWins: ['$45K Enterprise Deal', '$23K Mid-market'],
      coachingNotes: 'Excellent at discovery calls',
      nextGoals: 'Focus on upselling existing clients'
    }
  },
  {
    id: 'mc-002',
    name: 'Michael Chen',
    role: 'Sales Rep',
    avatar: 'MC',
    mood: '😐',
    wins: 4,
    streak: 0,
    improvements: 'Follow-up timing +18%',
    highlight: 'Best qualification rate this week',
    burnoutRisk: 'Medium',
    lastActivity: '1h ago',
    rewardProgress: 65,
    badges: ['📞', '💪'],
    aiInsights: 'Needs coaching on closing techniques',
    expandedData: {
      recentWins: ['$12K Small business', '$8K Startup'],
      coachingNotes: 'Working on qualification framework',
      nextGoals: 'Improve closing ratio'
    }
  },
  {
    id: 'jl-003',
    name: 'Jasmine Lee',
    role: 'Sales Rep',
    avatar: 'JL',
    mood: '🤔',
    wins: 6,
    streak: 7,
    improvements: 'Demo conversion +31%',
    highlight: 'Longest win streak this quarter',
    burnoutRisk: 'Low',
    lastActivity: '12h ago',
    rewardProgress: 78,
    badges: ['🔥', '🎯', '⭐'],
    aiInsights: 'Strong performer, consider leadership track',
    expandedData: {
      recentWins: ['$34K Enterprise', '$19K Mid-market', '$15K Small biz'],
      coachingNotes: 'Ready for advanced training',
      nextGoals: 'Mentor junior team members'
    }
  }
];

// Sample rewards data
const sampleRewards = [
  {
    id: '1',
    title: '$1K Revenue Bonus',
    type: 'revenue',
    target: 50000,
    deadline: '2025-01-31',
    rewardValue: '$1,000',
    status: 'Most Progressing',
    participants: [
      { name: 'Sarah Johnson', avatar: 'SJ', progress: 85, current: 42500 },
      { name: 'Michael Chen', avatar: 'MC', progress: 65, current: 32500 },
      { name: 'Jasmine Lee', avatar: 'JL', progress: 78, current: 39000 }
    ]
  },
  {
    id: '2',
    title: 'Call Master Challenge',
    type: 'calls',
    target: 100,
    deadline: '2025-01-15',
    rewardValue: 'Day Off',
    status: 'On-track',
    participants: [
      { name: 'Michael Chen', avatar: 'MC', progress: 85, current: 85 },
      { name: 'Sarah Johnson', avatar: 'SJ', progress: 75, current: 75 }
    ]
  }
];

// Sample badges
const availableBadges = [
  { id: 1, name: 'Call King', icon: '📞', tier: 'Gold', reward: '$10 voucher', earned: ['Sarah Johnson', 'Michael Chen'] },
  { id: 2, name: 'Streak Master', icon: '🔥', tier: 'Silver', reward: 'Day Off', earned: ['Jasmine Lee'] },
  { id: 3, name: '1000 Calls Badge', icon: '🏆', tier: 'Platinum', reward: '$50 bonus', earned: ['Sarah Johnson'] }
];

const TeamRewardsManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [showCreateReward, setShowCreateReward] = useState(false);
  const [showCreateBadge, setShowCreateBadge] = useState(false);

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Rewards</h2>
          <p className="text-gray-600">Enhanced team insights and management tools</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download CSV Report
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create New Reward
          </Button>
        </div>
      </div>

      {/* 1. Team Performance Overview */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Team Performance Overview
            </CardTitle>
            <div className="flex items-center gap-2">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option>Week</option>
                <option>Month</option>
                <option>Quarter</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Rep</th>
                  <th className="text-center p-3 font-medium text-gray-600">Mood</th>
                  <th className="text-center p-3 font-medium text-gray-600">Wins</th>
                  <th className="text-center p-3 font-medium text-gray-600">Streak</th>
                  <th className="text-left p-3 font-medium text-gray-600">Improvements</th>
                  <th className="text-left p-3 font-medium text-gray-600">Highlight</th>
                  <th className="text-center p-3 font-medium text-gray-600">Burnout Risk</th>
                  <th className="text-center p-3 font-medium text-gray-600">Last Activity</th>
                  <th className="text-center p-3 font-medium text-gray-600">Reward Progress</th>
                  <th className="text-center p-3 font-medium text-gray-600">Badges</th>
                  <th className="text-center p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enhancedTeamData.map((member) => (
                  <React.Fragment key={member.id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center text-lg">{member.mood}</td>
                      <td className="p-3 text-center font-medium">{member.wins}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-medium">{member.streak}</span>
                          {member.streak > 0 && <Flame className="h-3 w-3 text-orange-500" />}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-green-600">{member.improvements}</td>
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {member.highlight}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className={`text-xs ${getBurnoutRiskColor(member.burnoutRisk)}`}>
                          {member.burnoutRisk}
                        </Badge>
                      </td>
                      <td className="p-3 text-center text-sm text-gray-600">{member.lastActivity}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={member.rewardProgress} className="h-2 flex-1" />
                          <span className="text-xs font-medium">{member.rewardProgress}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1">
                          {member.badges.map((badge, idx) => (
                            <span key={idx} className="text-sm">{badge}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(member.id)}
                        >
                          {expandedRows.has(member.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                    {expandedRows.has(member.id) && (
                      <tr className="bg-blue-50">
                        <td colSpan={11} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Recent Wins</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {member.expandedData.recentWins.map((win, idx) => (
                                  <li key={idx}>• {win}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-2">AI Insights</h4>
                              <p className="text-sm text-gray-600">{member.aiInsights}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Nudge
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Award className="h-3 w-3 mr-1" />
                                  Bonus
                                </Button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 2. Bird's-Eye View Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center p-6">
          <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-600">Total Rewards in Play</div>
        </Card>
        <Card className="text-center p-6">
          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">85%</div>
          <div className="text-sm text-gray-600">Team Actively Enrolled</div>
        </Card>
        <Card className="text-center p-6">
          <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">Sarah Johnson</div>
          <div className="text-sm text-gray-600">Top Performer</div>
        </Card>
        <Card className="text-center p-6">
          <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">76%</div>
          <div className="text-sm text-gray-600">Average Progress</div>
        </Card>
      </div>

      {/* 3. Active Rewards Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-600" />
              Active Rewards
            </CardTitle>
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sampleRewards.map((reward) => (
              <Card key={reward.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        {reward.type === 'revenue' ? (
                          <DollarSign className="h-4 w-4 text-orange-600" />
                        ) : (
                          <Phone className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{reward.title}</h3>
                        <p className="text-sm text-gray-600">Target: {reward.target.toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{reward.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(reward.deadline).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-orange-600">
                      Reward: {reward.rewardValue}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Progress by Rep</h4>
                    {reward.participants.map((participant, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                {participant.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{participant.name}</span>
                          </div>
                          <span className="text-sm font-semibold">{participant.progress}%</span>
                        </div>
                        <Progress value={participant.progress} className="h-2" />
                        <div className="text-xs text-gray-500 text-right">
                          {participant.current.toLocaleString()} / {reward.target.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message Rep
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Badge Board */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Badge Board
            </CardTitle>
            <Button onClick={() => setShowCreateBadge(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Badge
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableBadges.map((badge) => (
              <Card key={badge.id} className="border">
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1">{badge.tier}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 text-center mb-3">
                    Reward: {badge.reward}
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Earned by:</strong>
                    <div className="mt-1">
                      {badge.earned.map((name, idx) => (
                        <span key={idx} className="inline-block bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5. Rewards Lab */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Rewards Lab
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="templates">
            <TabsList className="mb-6">
              <TabsTrigger value="templates">Quick Templates</TabsTrigger>
              <TabsTrigger value="create">Create Custom Reward</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200"
                >
                  <Phone className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Call Target</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200"
                >
                  <DollarSign className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Revenue Goal</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-200"
                >
                  <Target className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Demo Booking</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="create">
              <div className="max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Reward Name</label>
                    <Input placeholder="e.g., Q1 Revenue Challenge" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Type</label>
                    <select className="w-full border rounded px-3 py-2">
                      <option>Calls</option>
                      <option>Revenue</option>
                      <option>Deals</option>
                      <option>Custom Metric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input type="date" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Reward Value</label>
                    <Input placeholder="e.g., $500 bonus, Day off, Gift card" />
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                    Create Reward
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamRewardsManagement;
