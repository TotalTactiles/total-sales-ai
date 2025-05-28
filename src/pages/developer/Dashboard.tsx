
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  Database, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Brain,
  Code
} from 'lucide-react';

const DeveloperDashboard = () => {
  const systemStats = {
    totalUsers: 156,
    activeIntegrations: 3,
    apiCallsToday: 2847,
    errorRate: 0.2,
    uptime: 99.8,
    aiAccuracy: 94.5
  };

  const recentActivities = [
    { id: 1, type: 'success', message: 'Zoho CRM sync completed successfully', time: '2 minutes ago' },
    { id: 2, type: 'warning', message: 'Rate limit approached for OpenAI API', time: '15 minutes ago' },
    { id: 3, type: 'info', message: 'New user registered: Manager Role', time: '1 hour ago' },
    { id: 4, type: 'error', message: 'Failed webhook delivery from ClickUp', time: '2 hours ago' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
          <p className="text-slate-400 mt-2">System overview and monitoring</p>
        </div>
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          All Systems Operational
        </Badge>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.totalUsers}</div>
            <p className="text-xs text-slate-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Integrations</CardTitle>
            <Database className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.activeIntegrations}</div>
            <p className="text-xs text-slate-400">Zoho, ClickUp, OpenAI</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">API Calls Today</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.apiCallsToday.toLocaleString()}</div>
            <p className="text-xs text-slate-400">Within rate limits</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.errorRate}%</div>
            <p className="text-xs text-slate-400">Below 1% threshold</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.uptime}%</div>
            <p className="text-xs text-slate-400">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">AI Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.aiAccuracy}%</div>
            <p className="text-xs text-slate-400">Above target threshold</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent System Activities</CardTitle>
          <CardDescription className="text-slate-400">
            Latest events and system notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-400' :
                  activity.type === 'warning' ? 'bg-yellow-400' :
                  activity.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400">
            Common developer tasks and tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
              <Code className="h-4 w-4 mr-2" />
              View API Logs
            </Button>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
              <Brain className="h-4 w-4 mr-2" />
              AI Brain Hub
            </Button>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
              <Database className="h-4 w-4 mr-2" />
              CRM Integrations
            </Button>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
              <Activity className="h-4 w-4 mr-2" />
              System Monitor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperDashboard;
