
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from 'recharts';
import { Badge } from '@/components/ui/badge';

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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
