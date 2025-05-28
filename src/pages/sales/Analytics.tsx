
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Clock, Users, DollarSign, Phone, Mail } from 'lucide-react';
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

const SalesAnalytics = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore sales analytics with comprehensive mock data.');
  };

  // Mock analytics data
  const mockAnalytics = {
    performance: {
      totalRevenue: 1247500,
      dealsWon: 23,
      conversionRate: 34.5,
      avgDealSize: 54250,
      pipelineValue: 3850000,
      avgSalesCycle: 42
    },
    activity: {
      callsMade: 156,
      emailsSent: 89,
      meetingsScheduled: 12,
      responseRate: 67.8,
      followUpRate: 91.2
    },
    trends: [
      { month: 'Jan', revenue: 98000, deals: 4 },
      { month: 'Feb', revenue: 125000, deals: 6 },
      { month: 'Mar', revenue: 142000, deals: 5 },
      { month: 'Apr', revenue: 189000, deals: 8 },
      { month: 'May', revenue: 234000, deals: 7 },
      { month: 'Jun', revenue: 267000, deals: 9 }
    ],
    topLeads: mockLeads.slice(0, 5),
    sourceBreakdown: [
      { source: 'LinkedIn Outreach', count: 45, percentage: 35 },
      { source: 'Referrals', count: 32, percentage: 25 },
      { source: 'Website Form', count: 28, percentage: 22 },
      { source: 'Trade Shows', count: 15, percentage: 12 },
      { source: 'Cold Email', count: 8, percentage: 6 }
    ]
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Sales Analytics" 
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
        <DemoModeIndicator workspace="Sales Analytics & Performance Insights" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive performance insights and data-driven recommendations
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          +23% vs last month
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="leads">Lead Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockAnalytics.performance.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +23% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.performance.dealsWon}</div>
                <p className="text-xs text-muted-foreground">
                  +4 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAnalytics.performance.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                {mockAnalytics.trends.map((month, index) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="text-xs text-muted-foreground mb-2">
                      ${(month.revenue / 1000).toFixed(0)}k
                    </div>
                    <div 
                      className="w-full bg-blue-500 rounded-t transition-all"
                      style={{ 
                        height: `${(month.revenue / Math.max(...mockAnalytics.trends.map(t => t.revenue))) * 200}px` 
                      }}
                    />
                    <div className="text-xs mt-2 text-center">
                      <div>{month.month}</div>
                      <div className="text-muted-foreground">{month.deals} deals</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Source Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Performance</CardTitle>
              <CardDescription>Where your best leads are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.sourceBreakdown.map((source) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{source.source}</span>
                      <span className="text-muted-foreground">
                        {source.count} leads ({source.percentage}%)
                      </span>
                    </div>
                    <Progress value={source.percentage} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Health</CardTitle>
                <CardDescription>Current pipeline analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Pipeline Value</span>
                  <span className="font-semibold">
                    ${mockAnalytics.performance.pipelineValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Deal Size</span>
                  <span className="font-semibold">
                    ${mockAnalytics.performance.avgDealSize.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Sales Cycle</span>
                  <span className="font-semibold">{mockAnalytics.performance.avgSalesCycle} days</span>
                </div>
                <div className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Conversion Rate Progress</div>
                  <Progress value={mockAnalytics.performance.conversionRate} />
                  <div className="text-xs text-muted-foreground mt-1">
                    {mockAnalytics.performance.conversionRate}% of leads converted
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Metrics</CardTitle>
                <CardDescription>Your engagement statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>Calls Made</span>
                  </div>
                  <span className="font-semibold">{mockAnalytics.activity.callsMade}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-500" />
                    <span>Emails Sent</span>
                  </div>
                  <span className="font-semibold">{mockAnalytics.activity.emailsSent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>Meetings Scheduled</span>
                  </div>
                  <span className="font-semibold">{mockAnalytics.activity.meetingsScheduled}</span>
                </div>
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Rate</span>
                    <span>{mockAnalytics.activity.responseRate}%</span>
                  </div>
                  <Progress value={mockAnalytics.activity.responseRate} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Calls</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Target: 30 calls/day
                </p>
                <Progress value={80} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  Target: 20 emails/day
                </p>
                <Progress value={90} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connect Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  +12% vs last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Follow-up Rate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">91%</div>
                <p className="text-xs text-muted-foreground">
                  Excellent consistency
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Leads</CardTitle>
              <CardDescription>Leads with highest conversion potential</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.topLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{lead.name}</h4>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge 
                          variant={lead.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {lead.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lead.source}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{lead.score}%</div>
                      <div className="text-xs text-muted-foreground">Lead Score</div>
                      <div className="text-xs text-green-600">
                        {lead.conversion_likelihood}% conversion
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

export default SalesAnalytics;
