
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Database, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const DeveloperAnalytics = () => {
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const shouldShowMockData = isDemoMode() || showDemo;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore developer analytics.');
  };

  const analyticsData = {
    performance: {
      avgResponseTime: 245,
      throughput: 1250,
      errorCount: 12,
      successRate: 99.2
    },
    usage: {
      totalUsers: 2847,
      activeUsers: 847,
      apiCalls: 156000,
      dataProcessed: 2.4
    },
    trends: [
      { period: 'Week 1', users: 2200, errors: 15, performance: 92 },
      { period: 'Week 2', users: 2450, errors: 8, performance: 94 },
      { period: 'Week 3', users: 2650, errors: 12, performance: 95 },
      { period: 'Week 4', users: 2847, errors: 6, performance: 97 }
    ]
  };

  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Developer Analytics" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Developer Analytics & Performance Monitoring" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Analytics</h1>
          <p className="text-muted-foreground mt-2">
            System performance, user analytics, and technical insights
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performance.avgResponseTime}ms</div>
            <p className="text-xs text-green-600">-15ms from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performance.throughput}/min</div>
            <p className="text-xs text-green-600">+8% increase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Count</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performance.errorCount}</div>
            <p className="text-xs text-orange-600">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performance.successRate}%</div>
            <p className="text-xs text-green-600">Above target</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>Platform usage and user behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Total Users</p>
                    <p className="text-sm text-muted-foreground">Registered accounts</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{analyticsData.usage.totalUsers.toLocaleString()}</p>
                  <Badge variant="secondary">+12% growth</Badge>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">API Calls</p>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{analyticsData.usage.apiCalls.toLocaleString()}</p>
                  <Badge variant="secondary">+25% increase</Badge>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Data Processed</p>
                    <p className="text-sm text-muted-foreground">GB this month</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{analyticsData.usage.dataProcessed}GB</p>
                  <Badge variant="secondary">Normal range</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Weekly performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{trend.period}</p>
                    <p className="text-sm text-muted-foreground">{trend.users} users</p>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{trend.errors}</p>
                      <p className="text-muted-foreground">Errors</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-green-600">{trend.performance}%</p>
                      <p className="text-muted-foreground">Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
          <CardDescription>Real-time system status and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Database</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Connection pool: 85% utilized</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">API Services</span>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <p className="text-sm text-muted-foreground">All endpoints responding</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">AI Services</span>
                <Badge className="bg-yellow-100 text-yellow-800">Monitoring</Badge>
              </div>
              <p className="text-sm text-muted-foreground">High usage detected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperAnalytics;
