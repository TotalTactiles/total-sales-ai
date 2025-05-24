import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart, PieChart } from 'recharts';
import { 
  Headphones, 
  Phone, 
  Clock, 
  TrendingUp, 
  Users, 
  PhoneCall,
  MessageSquare,
  Brain,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import AIAgent from './AIAgent';

// Create simpler chart components for demo
const SimpleLineChart = () => {
  const data = [
    { name: 'Mon', value: 40 },
    { name: 'Tue', value: 30 },
    { name: 'Wed', value: 45 },
    { name: 'Thu', value: 50 },
    { name: 'Fri', value: 65 },
  ];

  return (
    <LineChart width={500} height={300} data={data}>
      {/* Chart components would go here */}
      <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
        Line Chart: Performance over time
      </div>
    </LineChart>
  );
};

const SimpleBarChart = () => {
  const data = [
    { name: 'Alice', calls: 120, conversions: 18 },
    { name: 'Bob', calls: 98, conversions: 22 },
    { name: 'Charlie', calls: 86, conversions: 19 },
    { name: 'Diana', calls: 99, conversions: 24 },
    { name: 'Edward', calls: 85, conversions: 21 },
    { name: 'Frank', calls: 65, conversions: 17 },
  ];

  return (
    <BarChart width={500} height={300} data={data}>
      {/* Chart components would go here */}
      <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
        Bar Chart: Team member performance comparison
      </div>
    </BarChart>
  );
};

const SimplePieChart = () => {
  const data = [
    { name: 'New', value: 400 },
    { name: 'In Progress', value: 300 },
    { name: 'Qualified', value: 300 },
    { name: 'Closed Won', value: 200 },
    { name: 'Closed Lost', value: 100 },
  ];

  return (
    <PieChart width={400} height={300}>
      {/* Chart components would go here */}
      <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
        Pie Chart: Lead status distribution
      </div>
    </PieChart>
  );
};

const Analytics = () => {
  const [showFullAIAgent, setShowFullAIAgent] = useState(false);

  // Sample data for sentiment tracking
  const sentimentData = [
    { type: 'Positive', count: 245, color: 'bg-green-500' },
    { type: 'Neutral', count: 124, color: 'bg-blue-500' },
    { type: 'Negative', count: 67, color: 'bg-red-500' },
  ];
  
  // Sample data for objection tracking
  const objectionData = [
    { objection: 'Price too high', count: 56, percentage: '38%' },
    { objection: 'Need approval', count: 34, percentage: '23%' },
    { objection: 'Current provider', count: 28, percentage: '19%' },
    { objection: 'No immediate need', count: 21, percentage: '14%' },
    { objection: 'Other', count: 9, percentage: '6%' },
  ];
  
  // Sample KPIs
  const kpis = [
    { label: 'Total Calls', value: '1,247', change: '+8%', trend: 'up' },
    { label: 'Conversion Rate', value: '23.5%', change: '+4.5%', trend: 'up' },
    { label: 'Avg Call Duration', value: '4m 12s', change: '-0:18', trend: 'down' },
    { label: 'Daily Target', value: '87%', change: '+12%', trend: 'up' },
  ];

  // AI Agent summary data
  const aiAgentStats = [
    { label: 'Active Calls', value: '3', icon: Phone, color: 'text-green-600' },
    { label: 'Queue Size', value: '47', icon: Users, color: 'text-blue-600' },
    { label: 'Avg Call Time', value: '3m 45s', icon: Clock, color: 'text-orange-600' },
    { label: 'Success Rate', value: '34%', icon: TrendingUp, color: 'text-purple-600' },
  ];

  const recentAICalls = [
    { id: 1, contact: 'John Smith', status: 'completed', outcome: 'qualified', duration: '4:23', time: '2 mins ago' },
    { id: 2, contact: 'Sarah Johnson', status: 'in-progress', outcome: '', duration: '2:15', time: 'now' },
    { id: 3, contact: 'Mike Wilson', status: 'completed', outcome: 'follow-up', duration: '3:45', time: '8 mins ago' },
  ];

  if (showFullAIAgent) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setShowFullAIAgent(false)}
            className="flex items-center gap-2"
          >
            ← Back to Analytics
          </Button>
          <h1 className="text-xl font-semibold">AI Calling Agent</h1>
        </div>
        <AIAgent />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-salesBlue">Analytics Dashboard</h1>
            <p className="text-slate-500">Performance metrics and insights for your team</p>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="text-slate-500 text-sm">{kpi.label}</div>
                  <div className="text-2xl font-bold mt-1">{kpi.value}</div>
                  <div className={`text-xs mt-1 flex items-center ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change} from last period
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Analytics Tabs */}
          <Tabs defaultValue="performance" className="mb-6">
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="calls">Call Analytics</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
              <TabsTrigger value="objections">Objection Tracking</TabsTrigger>
              <TabsTrigger value="ai-agent">AI Agent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Team Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleLineChart />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion by Team Member</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleBarChart />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimplePieChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="calls" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Call Volume by Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
                      Line Chart: Daily call volume
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Call Duration Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
                      Bar Chart: Call duration distribution
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Call Outcome Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
                      Area Chart: Call outcome trends over time
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sentiment" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Sentiment Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
                      Line Chart: Sentiment trends over time
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="space-y-4">
                      {sentimentData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={`block w-3 h-3 rounded-full ${item.color}`}></span>
                            <span>{item.type}</span>
                          </div>
                          <Badge variant="outline">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium mb-2">Key Insights</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Positive sentiment is up 12% this week</li>
                        <li>• Negative sentiment highest on Monday calls</li>
                        <li>• Product demos yield 45% more positive sentiment</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Sentiment by Lead Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
                      Grouped Bar Chart: Sentiment distribution by lead category
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="objections" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Common Objections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
                      Bar Chart: Top objections by frequency
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Objection Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="space-y-4">
                      {objectionData.map((item, index) => (
                        <div key={index} className="border-b pb-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{item.objection}</span>
                            <span className="text-slate-500">{item.percentage}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 mt-1 rounded-full overflow-hidden">
                            <div 
                              className="bg-salesBlue h-full rounded-full" 
                              style={{ width: item.percentage }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-5">
                  <CardHeader>
                    <CardTitle>Objection Handling Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
                      Combined Chart: Objection frequency vs. handling success rate
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="ai-agent" className="mt-4">
              <div className="space-y-6">
                {/* AI Agent Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Brain className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            AI Calling Agent Overview
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          </CardTitle>
                          <p className="text-sm text-slate-500 mt-1">
                            Autonomous voice AI handling cold outreach and lead qualification
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setShowFullAIAgent(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        View Full Dashboard
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* AI Agent Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {aiAgentStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-slate-500 text-sm">{stat.label}</div>
                              <div className="text-2xl font-bold mt-1">{stat.value}</div>
                            </div>
                            <IconComponent className={`h-8 w-8 ${stat.color}`} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent AI Calls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PhoneCall className="h-5 w-5" />
                        Recent AI Calls
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentAICalls.map((call) => (
                          <div key={call.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                call.status === 'in-progress' ? 'bg-green-400 animate-pulse' : 
                                call.outcome === 'qualified' ? 'bg-green-500' : 'bg-orange-500'
                              }`}></div>
                              <div>
                                <div className="font-medium">{call.contact}</div>
                                <div className="text-sm text-slate-500">{call.time} • {call.duration}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                call.status === 'in-progress' ? 'default' : 
                                call.outcome === 'qualified' ? 'default' : 'secondary'
                              }>
                                {call.status === 'in-progress' ? 'In Progress' : call.outcome}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Performance Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        AI Performance Today
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-slate-100 rounded-md">
                        Line Chart: AI call success rate over time
                      </div>
                    </CardContent>
                  </Card>

                  {/* Voice Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Headphones className="h-5 w-5" />
                        Active Voice Config
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Voice Model</span>
                          <Badge variant="outline">Professional Sarah</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Tone</span>
                          <Badge variant="outline">Friendly & Confident</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Speed</span>
                          <Badge variant="outline">1.1x</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Language</span>
                          <Badge variant="outline">English (AU)</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Play className="h-4 w-4 mr-2" />
                          Start New Campaign
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause All Calls
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Update Scripts
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Brain className="h-4 w-4 mr-2" />
                          Training Mode
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
