
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Target, Award, Calendar, Phone, DollarSign, Users } from 'lucide-react';

const Performance: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('this-week');

  const weeklyStats = [
    { label: 'Calls Made', value: 47, target: 50, change: '+12%' },
    { label: 'Demos Booked', value: 8, target: 10, change: '+25%' },
    { label: 'Closes', value: 3, target: 5, change: '-20%' },
    { label: 'Revenue', value: '$15,000', target: '$20,000', change: '+8%' }
  ];

  const challenges = [
    {
      id: 1,
      title: 'Call Champion',
      description: 'Make 50 calls this week',
      progress: 94,
      reward: '100 XP + Badge',
      timeLeft: '2 days',
      status: 'active'
    },
    {
      id: 2,
      title: 'Demo Master',
      description: 'Book 10 demos this month',
      progress: 80,
      reward: '250 XP + Title',
      timeLeft: '1 week',
      status: 'active'
    },
    {
      id: 3,
      title: 'Perfect Week',
      description: 'Hit all targets for 1 week',
      progress: 60,
      reward: '500 XP + Bonus',
      timeLeft: '3 days',
      status: 'at-risk'
    }
  ];

  const insights = [
    {
      id: 1,
      title: 'Peak Performance Time',
      message: 'You close 40% more deals when calling between 2-4 PM',
      type: 'tip',
      action: 'Schedule more calls in this window'
    },
    {
      id: 2,
      title: 'Objection Pattern',
      message: 'Price objections increased 15% this week',
      type: 'warning',
      action: 'Review pricing objection training'
    },
    {
      id: 3,
      title: 'Winning Streak',
      message: 'Your follow-up game is strong - 85% response rate',
      type: 'success',
      action: 'Keep using your current follow-up strategy'
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'tip': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pl-72">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance</h1>
            <p className="text-gray-600">Track your progress and unlock achievements</p>
          </div>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Weekly Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {weeklyStats.map((stat, index) => {
                const icons = [Phone, Calendar, Target, DollarSign];
                const Icon = icons[index];
                return (
                  <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="h-8 w-8 text-blue-600" />
                        <Badge variant={stat.change.startsWith('+') ? 'default' : 'destructive'}>
                          {stat.change}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-gray-600 text-sm">Target: {stat.target}</p>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Performance Chart Placeholder */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Performance chart will be displayed here</p>
                    <p className="text-sm">Integration with analytics coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges">
            <div className="space-y-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <p className="text-gray-600">{challenge.description}</p>
                      </div>
                      <Badge className={challenge.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {challenge.status}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">{challenge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(challenge.progress)}`}
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>🏆 {challenge.reward}</span>
                        <span>⏰ {challenge.timeLeft} left</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className={`border ${getInsightColor(insight.type)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold mb-2">{insight.title}</h3>
                        <p className="mb-3">{insight.message}</p>
                        <p className="text-sm font-medium">Recommended Action: {insight.action}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Take Action
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Team Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Team Competition</h3>
                  <p className="text-gray-600 mb-6">See how you rank against your teammates</p>
                  <Button>
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Performance;
