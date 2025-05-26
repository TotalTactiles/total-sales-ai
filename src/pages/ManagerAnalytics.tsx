
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  Calendar,
  MessageSquare,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';
import ManagerAIAssistant from '@/components/ManagerAI/ManagerAIAssistant';

const ManagerAnalytics = () => {
  const [activeAlert, setActiveAlert] = useState('critical');

  // Mock data for AI-driven insights
  const aiAlerts = [
    {
      type: 'critical',
      title: 'Rep Performance Drop',
      message: 'John Smith\'s conversion rate dropped 23% this week',
      action: 'Schedule 1-on-1',
      color: 'bg-red-500'
    },
    {
      type: 'opportunity',
      title: 'Instagram Surge',
      message: '47% lead increase via Instagram - consider budget reallocation',
      action: 'Review Campaign',
      color: 'bg-green-500'
    },
    {
      type: 'insight',
      title: 'Pipeline Velocity',
      message: 'Average deal cycle reduced by 18% this month',
      action: 'Analyze Factors',
      color: 'bg-blue-500'
    }
  ];

  const repInsights = [
    {
      name: 'Sarah Johnson',
      conversionRate: 34,
      trend: 'up',
      change: '+12%',
      topChannel: 'LinkedIn',
      badge: 'top-performer'
    },
    {
      name: 'Mike Chen',
      conversionRate: 28,
      trend: 'up',
      change: '+8%',
      topChannel: 'Email',
      badge: 'consistent'
    },
    {
      name: 'John Smith',
      conversionRate: 19,
      trend: 'down',
      change: '-23%',
      topChannel: 'Cold Call',
      badge: 'needs-coaching'
    }
  ];

  const businessMetrics = [
    { label: 'Monthly Recurring Revenue', value: '$127K', change: '+18%', trend: 'up' },
    { label: 'Customer Acquisition Cost', value: '$340', change: '-12%', trend: 'up' },
    { label: 'Lifetime Value', value: '$4.2K', change: '+24%', trend: 'up' },
    { label: 'Churn Rate', value: '2.3%', change: '-5%', trend: 'up' },
    { label: 'Pipeline Velocity', value: '23 days', change: '-18%', trend: 'up' },
    { label: 'Lead Quality Score', value: '87/100', change: '+9%', trend: 'up' }
  ];

  const marketingInsights = [
    { channel: 'Instagram', leads: 347, conversion: '31%', roi: '340%', trend: 'up' },
    { channel: 'LinkedIn', leads: 289, conversion: '28%', roi: '285%', trend: 'up' },
    { channel: 'Email', leads: 156, conversion: '24%', roi: '220%', trend: 'stable' },
    { channel: 'Cold Outreach', leads: 98, conversion: '15%', roi: '145%', trend: 'down' }
  ];

  const aiActivities = [
    { task: 'Lead Scoring Update', impact: 'High', completed: '2 hours ago' },
    { task: 'Rep Performance Analysis', impact: 'Medium', completed: '4 hours ago' },
    { task: 'Pipeline Health Check', impact: 'High', completed: '6 hours ago' },
    { task: 'Social Media Audit', impact: 'Medium', completed: '8 hours ago' }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'top-performer': return 'bg-gold-500 text-white';
      case 'consistent': return 'bg-blue-500 text-white';
      case 'needs-coaching': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* AI Alert Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">AI Insight:</span>
            <span className="text-sm">Pipeline health is strong - 127% of monthly target achieved</span>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            View Details
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Manager Analytics Command Center</h1>
            <p className="text-muted-foreground">AI-powered strategic insights and team performance metrics</p>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="rep-insights" className="mb-6">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="rep-insights" className="rounded-lg">Sales Rep Insights</TabsTrigger>
              <TabsTrigger value="marketing" className="rounded-lg">Social/Marketing Impact</TabsTrigger>
              <TabsTrigger value="business" className="rounded-lg">Business Metrics</TabsTrigger>
              <TabsTrigger value="ai-activity" className="rounded-lg">AI Activity</TabsTrigger>
              <TabsTrigger value="calendar" className="rounded-lg">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="rep-insights">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - AI Alerts */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        AI Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {aiAlerts.map((alert, index) => (
                        <div key={index} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${alert.color}`} />
                            <span className="font-medium text-sm">{alert.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                          <Button size="sm" variant="outline" className="text-xs">
                            {alert.action}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        AI Coaching
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <p className="text-sm font-medium">Micro-Coaching Suggestion</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            John needs objection handling training. Book Company Brain session?
                          </p>
                          <Button size="sm" variant="link" className="p-0 text-xs mt-2">
                            Open Training Module
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Center Column - Rep Performance */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Users className="h-6 w-6 text-blue-500" />
                        Team Performance Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {repInsights.map((rep, index) => (
                          <div key={index} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                  {rep.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h4 className="font-medium">{rep.name}</h4>
                                  <p className="text-sm text-muted-foreground">Top Channel: {rep.topChannel}</p>
                                </div>
                              </div>
                              <Badge className={getBadgeColor(rep.badge)}>
                                {rep.badge.replace('-', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{rep.conversionRate}%</span>
                                <TrendIcon trend={rep.trend} />
                                <span className={`text-sm ${rep.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                  {rep.change}
                                </span>
                              </div>
                              <Progress value={rep.conversionRate} className="w-24" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Quick Tools */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-500" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Team Meeting
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-sm">
                        <Award className="h-4 w-4 mr-2" />
                        Recognition Board
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        Recent AI Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {aiActivities.slice(0, 3).map((activity, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{activity.task}</p>
                          <div className="flex justify-between items-center mt-1">
                            <Badge variant="outline" className="text-xs">
                              {activity.impact} Impact
                            </Badge>
                            <span className="text-xs text-muted-foreground">{activity.completed}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="marketing">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                        Channel Performance Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {marketingInsights.map((channel, index) => (
                          <div key={index} className="p-4 rounded-lg border bg-card">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-lg">{channel.channel}</h4>
                              <TrendIcon trend={channel.trend} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Leads Generated</p>
                                <p className="text-xl font-bold">{channel.leads}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                                <p className="text-xl font-bold">{channel.conversion}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">ROI</p>
                                <p className="text-xl font-bold text-green-500">{channel.roi}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="text-lg">AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <p className="font-medium text-sm text-green-800 dark:text-green-200">Opportunity Detected</p>
                        <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                          Instagram showing 47% lead increase. Consider reallocating 20% budget from cold outreach.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <p className="font-medium text-sm text-blue-800 dark:text-blue-200">Optimization Tip</p>
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                          LinkedIn posts at 2PM show 35% higher engagement. Schedule content accordingly.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessMetrics.map((metric, index) => (
                  <Card key={index} className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                          <p className="text-3xl font-bold">{metric.value}</p>
                        </div>
                        <TrendIcon trend={metric.trend} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {metric.change}
                        </span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ai-activity">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Brain className="h-6 w-6 text-purple-500" />
                      AI Task Execution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiActivities.map((activity, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-lg border bg-card">
                          <div>
                            <p className="font-medium">{activity.task}</p>
                            <p className="text-sm text-muted-foreground">{activity.completed}</p>
                          </div>
                          <Badge variant={activity.impact === 'High' ? 'default' : 'secondary'}>
                            {activity.impact}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="text-xl">AI Learning Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                        <h4 className="font-medium text-purple-800 dark:text-purple-200">Pattern Recognition</h4>
                        <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                          AI identified that leads contacted within 5 minutes have 340% higher conversion rates.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200">Behavioral Analysis</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                          Tuesday 2PM calls show highest success rate across all team members.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-blue-500" />
                    Strategic Calendar View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">AI-Optimized Calendar</h3>
                    <p className="text-muted-foreground mb-4">
                      Smart scheduling with Google/Outlook integration and AI-suggested optimal time blocks
                    </p>
                    <Button>Connect Calendar</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Manager AI Assistant */}
      <ManagerAIAssistant />
    </div>
  );
};

export default ManagerAnalytics;
