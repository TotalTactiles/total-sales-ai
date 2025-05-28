
import React, { useState } from 'react';
import { Users, Award, TrendingUp, Calendar, MessageSquare, Target, Clock, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerTeamManagement = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore comprehensive team management and coaching tools.');
  };

  // Mock team management data
  const mockTeamData = {
    teamOverview: {
      totalReps: 8,
      activeReps: 7,
      onLeave: 1,
      avgPerformance: 87.5,
      teamMorale: 82,
      monthlyGoalProgress: 127
    },
    teamMembers: [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Senior Sales Rep',
        avatar: 'SJ',
        performance: 94,
        mood: 88,
        goals: { current: 145, target: 100 },
        lastActive: '2 hours ago',
        strengths: ['Closing', 'Relationship Building'],
        areas: ['Technical Questions'],
        status: 'active',
        meetings: 3,
        calls: 47,
        emails: 23
      },
      {
        id: '2',
        name: 'Michael Chen',
        role: 'Sales Rep',
        avatar: 'MC',
        performance: 76,
        mood: 65,
        goals: { current: 78, target: 100 },
        lastActive: '1 hour ago',
        strengths: ['Product Knowledge'],
        areas: ['Objection Handling', 'Follow-up'],
        status: 'needs-coaching',
        meetings: 2,
        calls: 32,
        emails: 18
      },
      {
        id: '3',
        name: 'Jennifer Park',
        role: 'Sales Rep',
        avatar: 'JP',
        performance: 89,
        mood: 91,
        goals: { current: 112, target: 100 },
        lastActive: '30 minutes ago',
        strengths: ['Prospecting', 'Social Selling'],
        areas: ['Negotiation'],
        status: 'high-performer',
        meetings: 4,
        calls: 52,
        emails: 31
      },
      {
        id: '4',
        name: 'David Rodriguez',
        role: 'Junior Sales Rep',
        avatar: 'DR',
        performance: 58,
        mood: 72,
        goals: { current: 45, target: 80 },
        lastActive: '4 hours ago',
        strengths: ['Enthusiasm'],
        areas: ['All Areas - New Hire'],
        status: 'training',
        meetings: 1,
        calls: 18,
        emails: 12
      }
    ],
    upcomingMeetings: [
      {
        time: '2:00 PM',
        type: '1-on-1',
        participant: 'Michael Chen',
        topic: 'Performance Improvement Plan',
        priority: 'high'
      },
      {
        time: '3:30 PM',
        type: 'Team',
        participant: 'Full Team',
        topic: 'Weekly Sales Review',
        priority: 'medium'
      },
      {
        time: '4:00 PM',
        type: 'Coaching',
        participant: 'David Rodriguez',
        topic: 'Objection Handling Training',
        priority: 'medium'
      }
    ],
    recognitions: [
      {
        recipient: 'Sarah Johnson',
        achievement: 'Exceeded monthly quota by 45%',
        type: 'performance',
        date: '2 days ago'
      },
      {
        recipient: 'Jennifer Park',
        achievement: 'Highest customer satisfaction score',
        type: 'customer-focus',
        date: '1 week ago'
      }
    ],
    trainingPrograms: [
      {
        name: 'Advanced Negotiation Tactics',
        participants: 6,
        completion: 75,
        nextSession: 'Tomorrow 10 AM'
      },
      {
        name: 'AI Tools Mastery',
        participants: 8,
        completion: 45,
        nextSession: 'Friday 2 PM'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high-performer': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'needs-coaching': return 'bg-yellow-500';
      case 'training': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleScheduleMeeting = (repId: string) => {
    toast.success('Meeting scheduled successfully');
  };

  const handleSendMessage = (repId: string) => {
    toast.success('Message sent to team member');
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Team Management & Coaching" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Demo Mode Indicator */}
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Team Management & Performance Coaching System" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management Center</h1>
          <p className="text-muted-foreground mt-2">
            Manage, coach, and optimize your sales team performance
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-3 w-3 mr-1" />
            {mockTeamData.teamOverview.activeReps}/{mockTeamData.teamOverview.totalReps} Active
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            {mockTeamData.teamOverview.monthlyGoalProgress}% Goal Progress
          </Badge>
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeamData.teamOverview.avgPerformance}%</div>
            <p className="text-xs text-muted-foreground">
              Average team score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Morale</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeamData.teamOverview.teamMorale}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockTeamData.teamOverview.monthlyGoalProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Of monthly target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reps</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeamData.teamOverview.activeReps}</div>
            <p className="text-xs text-muted-foreground">
              {mockTeamData.teamOverview.onLeave} on leave
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList>
          <TabsTrigger value="team">Team Overview</TabsTrigger>
          <TabsTrigger value="coaching">Coaching & Development</TabsTrigger>
          <TabsTrigger value="recognition">Recognition & Rewards</TabsTrigger>
          <TabsTrigger value="calendar">Team Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6">
          {/* Team Members Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockTeamData.teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{member.performance}%</div>
                      <div className="text-xs text-muted-foreground">Performance</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{member.mood}%</div>
                      <div className="text-xs text-muted-foreground">Mood</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{member.goals.current}%</div>
                      <div className="text-xs text-muted-foreground">Goal Progress</div>
                    </div>
                  </div>

                  {/* Goal Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Goal</span>
                      <span>{member.goals.current}% of {member.goals.target}%</span>
                    </div>
                    <Progress value={(member.goals.current / member.goals.target) * 100} />
                  </div>

                  {/* Activity Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-semibold">{member.meetings}</div>
                      <div className="text-muted-foreground">Meetings</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <div className="font-semibold">{member.calls}</div>
                      <div className="text-muted-foreground">Calls</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <div className="font-semibold">{member.emails}</div>
                      <div className="text-muted-foreground">Emails</div>
                    </div>
                  </div>

                  {/* Strengths and Areas for Improvement */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-green-700">Strengths: </span>
                      <span className="text-sm">{member.strengths.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-orange-700">Focus Areas: </span>
                      <span className="text-sm">{member.areas.join(', ')}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleScheduleMeeting(member.id)}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Meet
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSendMessage(member.id)}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last active: {member.lastActive}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coaching" className="space-y-6">
          {/* Training Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Active Training Programs</CardTitle>
              <CardDescription>Ongoing development initiatives for the team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeamData.trainingPrograms.map((program, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{program.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {program.participants} participants • Next: {program.nextSession}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{program.completion}%</div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                      <Progress value={program.completion} className="w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Coaching Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Coaching Recommendations
              </CardTitle>
              <CardDescription>Personalized development suggestions based on performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">💡 Skill Development</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Michael would benefit from advanced objection handling training. Consider scheduling Company Brain session.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Schedule Training
                  </Button>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">🌟 Mentorship Opportunity</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Sarah is ready to mentor junior reps. Pair her with David for accelerated development.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Set Up Mentorship
                  </Button>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">⚡ Process Improvement</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Team follow-up consistency could improve by 23% with automated reminder system.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Implement Automation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recognition" className="space-y-6">
          {/* Recent Recognitions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Achievements</CardTitle>
              <CardDescription>Celebrating success and outstanding performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeamData.recognitions.map((recognition, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{recognition.recipient}</h4>
                      <p className="text-sm text-muted-foreground">{recognition.achievement}</p>
                      <Badge variant="outline" className="mt-1">
                        {recognition.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {recognition.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recognition Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Give Recognition</CardTitle>
                <CardDescription>Acknowledge team member achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Send Team Appreciation
                </Button>
                <Button className="w-full" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Nominate for Award
                </Button>
                <Button className="w-full" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Share Success Story
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Leaderboard</CardTitle>
                <CardDescription>Top performers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                      <span className="font-medium">Sarah Johnson</span>
                    </div>
                    <span className="text-sm text-green-600">145% quota</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">2</div>
                      <span className="font-medium">Jennifer Park</span>
                    </div>
                    <span className="text-sm text-green-600">112% quota</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold">3</div>
                      <span className="font-medium">Michael Chen</span>
                    </div>
                    <span className="text-sm text-blue-600">78% quota</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Upcoming meetings and coaching sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTeamData.upcomingMeetings.map((meeting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{meeting.topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          {meeting.type} with {meeting.participant}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{meeting.time}</div>
                      <Badge variant={meeting.priority === 'high' ? 'destructive' : 'outline'}>
                        {meeting.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Calendar Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Schedule 1-on-1
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Team Meeting
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Brain className="h-6 w-6 mb-2" />
              Training Session
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerTeamManagement;
