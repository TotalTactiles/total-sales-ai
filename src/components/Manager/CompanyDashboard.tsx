
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  AlertTriangle,
  FileDown,
  Activity,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const CompanyDashboard = () => {
  const [teamMetrics] = useState({
    totalLeads: 847,
    totalReps: 12,
    activeDeals: 45,
    pipelineValue: 1250000,
    conversionRate: 23.5,
    avgResponseTime: 2.3
  });

  const [recentActivity] = useState([
    { id: 1, rep: 'Sarah Chen', action: 'Closed deal with TechCorp', value: '$45,000', time: '2 hours ago' },
    { id: 2, rep: 'Mike Johnson', action: 'Scheduled demo with StartupX', value: '$12,000', time: '4 hours ago' },
    { id: 3, rep: 'Emma Davis', action: 'Follow-up call completed', value: '$8,500', time: '6 hours ago' },
  ]);

  const [aiInsights] = useState([
    { type: 'success', message: 'Sarah Chen is 15% ahead of monthly target - consider promoting her success strategy', severity: 'success' },
    { type: 'warning', message: '3 deals worth $125K are stalling - AI suggests intervention needed', severity: 'warning' },
    { type: 'info', message: 'Team conversion rate improved by 8% this week - email outreach is performing well', severity: 'info' }
  ]);

  const repPerformanceData = [
    { name: 'Sarah Chen', deals: 12, revenue: 145000 },
    { name: 'Mike Johnson', deals: 8, revenue: 98000 },
    { name: 'Emma Davis', deals: 10, revenue: 112000 },
    { name: 'Alex Thompson', deals: 6, revenue: 75000 },
    { name: 'Lisa Wang', deals: 9, revenue: 105000 }
  ];

  const leadSourceData = [
    { name: 'Website', value: 45, color: '#3B82F6' },
    { name: 'Social Media', value: 25, color: '#10B981' },
    { name: 'Referrals', value: 20, color: '#F59E0B' },
    { name: 'Cold Outreach', value: 10, color: '#EF4444' }
  ];

  const pipelineData = [
    { stage: 'New Leads', count: 156 },
    { stage: 'Contacted', count: 89 },
    { stage: 'Qualified', count: 45 },
    { stage: 'Proposal', count: 23 },
    { stage: 'Closed Won', count: 12 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMetrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(teamMetrics.pipelineValue / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMetrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMetrics.avgResponseTime}h</div>
            <p className="text-xs text-muted-foreground">
              -0.8h from target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rep Performance */}
        <Card className="rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Rep Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Lead Sources Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Funnel */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Sales Pipeline Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            AI Manager Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                insight.severity === 'success' ? 'bg-green-50 border-green-400' :
                insight.severity === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    insight.severity === 'success' ? 'text-green-600' :
                    insight.severity === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <p className="text-sm text-gray-700">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Team Activity */}
      <Card className="rounded-lg shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Team Activity</CardTitle>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{activity.rep}</p>
                  <p className="text-xs text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {activity.value}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;
