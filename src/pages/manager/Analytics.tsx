
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Clock, Users, DollarSign, Phone, Mail, Brain, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerAnalytics = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore comprehensive manager analytics with team performance insights.');
  };

  // Mock manager analytics data
  const mockManagerData = {
    teamPerformance: {
      totalRevenue: 2847500,
      teamSize: 8,
      avgConversionRate: 28.5,
      topPerformer: 'Sarah Johnson',
      monthlyGrowth: 23.4,
      pipelineHealth: 89
    },
    teamMembers: [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Senior Sales Rep',
        revenue: 645000,
        deals: 23,
        conversionRate: 34.2,
        activity: 'High',
        mood: 85,
        trend: 'up'
      },
      {
        id: '2',
        name: 'Michael Chen',
        role: 'Sales Rep',
        revenue: 523000,
        deals: 19,
        conversionRate: 28.1,
        activity: 'Medium',
        mood: 72,
        trend: 'stable'
      },
      {
        id: '3',
        name: 'Jennifer Park',
        role: 'Sales Rep',
        revenue: 487000,
        deals: 17,
        conversionRate: 25.8,
        activity: 'High',
        mood: 78,
        trend: 'up'
      },
      {
        id: '4',
        name: 'David Rodriguez',
        role: 'Junior Sales Rep',
        revenue: 298000,
        deals: 12,
        conversionRate: 22.3,
        activity: 'Low',
        mood: 65,
        trend: 'down'
      }
    ],
    aiInsights: [
      {
        type: 'alert',
        title: 'David needs coaching',
        message: 'Conversion rate dropped 15% this week. Recommend 1-on-1 session.',
        urgency: 'high'
      },
      {
        type: 'opportunity',
        title: 'Sarah trending strong',
        message: 'On track for 150% quota. Consider lead reallocation to help team.',
        urgency: 'medium'
      },
      {
        type: 'insight',
        title: 'Team velocity increasing',
        message: 'Average deal cycle reduced by 18% this month.',
        urgency: 'low'
      }
    ],
    channelPerformance: [
      { channel: 'LinkedIn', leads: 342, conversion: 31, roi: 285 },
      { channel: 'Email Campaigns', leads: 267, conversion: 24, roi: 220 },
      { channel: 'Referrals', leads: 189, conversion: 45, roi: 380 },
      { channel: 'Cold Calls', leads: 156, conversion: 18, roi: 145 }
    ],
    marketingROI: {
      totalSpend: 45000,
      leadsGenerated: 954,
      costPerLead: 47.17,
      revenue: 2847500,
      roi: 533
    }
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Manager Analytics Dashboard" 
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
        <DemoModeIndicator workspace="Manager Analytics & Team Performance Dashboard" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive team performance insights and strategic analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{mockManagerData.teamPerformance.monthlyGrowth}% growth
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Brain className="h-3 w-3 mr-1" />
            AI Monitoring
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="coaching">AI Coaching Insights</TabsTrigger>
          <TabsTrigger value="marketing">Marketing ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockManagerData.teamPerformance.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{mockManagerData.teamPerformance.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockManagerData.teamPerformance.teamSize}</div>
                <p className="text-xs text-muted-foreground">
                  Active sales representatives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockManagerData.teamPerformance.avgConversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Team average performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pipeline Health</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockManagerData.teamPerformance.pipelineHealth}%</div>
                <p className="text-xs text-muted-foreground">
                  Overall pipeline quality
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
              <CardDescription>Individual rep performance and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockManagerData.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-lg font-bold">${member.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{member.deals}</div>
                        <div className="text-xs text-muted-foreground">Deals</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{member.conversionRate}%</div>
                        <div className="text-xs text-muted-foreground">Conversion</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={member.activity === 'High' ? 'default' : 
                                   member.activity === 'Medium' ? 'secondary' : 'outline'}
                        >
                          {member.activity}
                        </Badge>
                        <div className="text-sm">
                          Mood: {member.mood}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance Analysis</CardTitle>
              <CardDescription>Lead generation and conversion by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockManagerData.channelPerformance.map((channel, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{channel.channel}</h4>
                      <p className="text-sm text-muted-foreground">Marketing Channel</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{channel.leads}</div>
                      <div className="text-xs text-muted-foreground">Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{channel.conversion}%</div>
                      <div className="text-xs text-muted-foreground">Conversion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{channel.roi}%</div>
                      <div className="text-xs text-muted-foreground">ROI</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Activity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Calls Made</span>
                    <span className="font-bold">247</span>
                  </div>
                  <Progress value={82} />
                  
                  <div className="flex justify-between items-center">
                    <span>Emails Sent</span>
                    <span className="font-bold">156</span>
                  </div>
                  <Progress value={67} />
                  
                  <div className="flex justify-between items-center">
                    <span>Meetings Booked</span>
                    <span className="font-bold">34</span>
                  </div>
                  <Progress value={94} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Goals Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Monthly Revenue Goal</span>
                      <span>127% complete</span>
                    </div>
                    <Progress value={127} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Lead Generation Goal</span>
                      <span>89% complete</span>
                    </div>
                    <Progress value={89} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Team Training Hours</span>
                      <span>156% complete</span>
                    </div>
                    <Progress value={156} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coaching" className="space-y-6">
          {/* AI Coaching Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockManagerData.aiInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      insight.urgency === 'high' ? 'bg-red-500' :
                      insight.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge variant={insight.urgency === 'high' ? 'destructive' : 'outline'}>
                      {insight.urgency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{insight.message}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Suggestion
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coaching Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Coaching Recommendations</CardTitle>
              <CardDescription>Personalized development suggestions for team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">📚 Training Opportunity</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    David would benefit from objection handling training. His close rate could improve by 15-20%.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">🎯 Leadership Opportunity</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Sarah is ready for mentoring responsibilities. Consider pairing her with junior reps.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">⚡ Process Improvement</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Team follow-up response time can be improved by 23% with automated reminders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          {/* Marketing ROI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Marketing Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockManagerData.marketingROI.totalSpend.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockManagerData.marketingROI.leadsGenerated}</div>
                <p className="text-xs text-muted-foreground">Total leads</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Per Lead</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockManagerData.marketingROI.costPerLead}</div>
                <p className="text-xs text-muted-foreground">Average cost</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{mockManagerData.marketingROI.roi}%</div>
                <p className="text-xs text-muted-foreground">Return on investment</p>
              </CardContent>
            </Card>
          </div>

          {/* Marketing Channel Deep Dive */}
          <Card>
            <CardHeader>
              <CardTitle>Marketing Attribution Analysis</CardTitle>
              <CardDescription>Detailed breakdown of marketing channel performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockManagerData.channelPerformance.map((channel, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{channel.channel}</h4>
                      <Badge variant="outline">{channel.roi}% ROI</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Leads:</span>
                        <span className="font-semibold ml-2">{channel.leads}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conversion:</span>
                        <span className="font-semibold ml-2">{channel.conversion}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue Impact:</span>
                        <span className="font-semibold ml-2 text-green-600">
                          ${((channel.leads * channel.conversion / 100) * 54250).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerAnalytics;
