
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  BarChart3,
  LineChart,
  Lightbulb
} from 'lucide-react';
import { useAdvancedAnalytics } from '@/hooks/telephony/useAdvancedAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Cell, LineChart as RechartsLineChart, Line } from 'recharts';

const AdvancedAnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const { 
    callAnalytics, 
    smsAnalytics, 
    repPerformance, 
    insights,
    isLoading,
    refreshAnalytics
  } = useAdvancedAnalytics(dateRange.start, dateRange.end);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const callStatusData = [
    { name: 'Answered', value: callAnalytics?.answered_calls || 0 },
    { name: 'Missed', value: callAnalytics?.missed_calls || 0 },
    { name: 'Failed', value: callAnalytics?.failed_calls || 0 }
  ];

  const smsFlowData = [
    { name: 'Outbound', value: smsAnalytics?.outbound_messages || 0 },
    { name: 'Inbound', value: smsAnalytics?.inbound_messages || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Advanced Analytics</h1>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <Button onClick={refreshAnalytics} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calls">Call Analytics</TabsTrigger>
          <TabsTrigger value="sms">SMS Analytics</TabsTrigger>
          <TabsTrigger value="performance">Rep Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(callAnalytics?.total_calls || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(callAnalytics?.answer_rate || 0)} answer rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Talk Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDuration(callAnalytics?.total_duration || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Avg: {formatDuration(callAnalytics?.average_duration || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(smsAnalytics?.total_messages || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(smsAnalytics?.response_rate || 0)} response rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Reps</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{repPerformance.length}</div>
                <p className="text-xs text-muted-foreground">
                  Performance tracked
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calls" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Call Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <PieChart
                      data={callStatusData}
                      cx="50%"
                      cy="50%"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {callStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </PieChart>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Call Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={callAnalytics?.peak_call_hours || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>SMS Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Messages</span>
                    <Badge variant="outline">{formatNumber(smsAnalytics?.total_messages || 0)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Outbound</span>
                    <Badge variant="outline">{formatNumber(smsAnalytics?.outbound_messages || 0)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Inbound</span>
                    <Badge variant="outline">{formatNumber(smsAnalytics?.inbound_messages || 0)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Rate</span>
                    <Badge variant="default">{formatPercentage(smsAnalytics?.response_rate || 0)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery Rate</span>
                    <Badge variant="default">{formatPercentage(smsAnalytics?.delivery_rate || 0)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <PieChart
                      data={smsFlowData}
                      cx="50%"
                      cy="50%"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {smsFlowData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </PieChart>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rep Performance Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repPerformance.map((rep, index) => (
                  <div key={rep.rep_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{rep.rep_name}</p>
                        <p className="text-sm text-gray-600">{rep.calls_made} calls made</p>
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium">{rep.calls_answered}</p>
                        <p className="text-gray-600">Connected</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{formatDuration(rep.talk_time)}</p>
                        <p className="text-gray-600">Talk Time</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{formatPercentage(rep.conversion_rate)}</p>
                        <p className="text-gray-600">Conversion</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{rep.quality_score.toFixed(1)}</p>
                        <p className="text-gray-600">Quality</p>
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

export default AdvancedAnalyticsDashboard;
