
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Cpu, AlertTriangle, CheckCircle, Activity, Settings, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const DeveloperDashboard = () => {
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const shouldShowMockData = isDemoMode() || showDemo;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore developer command center.');
  };

  const systemStats = {
    apiRequests: 15432,
    errorRate: 0.12,
    uptime: 99.9,
    activeUsers: 847,
    cpuUsage: 23,
    memoryUsage: 67,
    diskUsage: 45
  };

  const recentLogs = [
    { level: 'info', message: 'User authentication successful', timestamp: '10:45:23', service: 'auth' },
    { level: 'warning', message: 'High memory usage detected', timestamp: '10:44:15', service: 'system' },
    { level: 'error', message: 'Failed to connect to external API', timestamp: '10:43:02', service: 'integration' },
    { level: 'info', message: 'Database backup completed', timestamp: '10:42:30', service: 'database' }
  ];

  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Developer Command Center" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Developer Command Center & System Monitor" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            System monitoring, debugging, and development tools
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          System Config
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.apiRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.errorRate}%</div>
            <p className="text-xs text-green-600">Within normal range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.uptime}%</div>
            <p className="text-xs text-muted-foreground">30-day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Resources */}
        <Card>
          <CardHeader>
            <CardTitle>System Resources</CardTitle>
            <CardDescription>Real-time resource monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm">{systemStats.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${systemStats.cpuUsage}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm">{systemStats.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${systemStats.memoryUsage}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Disk Usage</span>
                  <span className="text-sm">{systemStats.diskUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${systemStats.diskUsage}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent System Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Logs</CardTitle>
            <CardDescription>Latest system events and errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-muted/50">
                  <Badge 
                    variant={log.level === 'error' ? 'destructive' : log.level === 'warning' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {log.level}
                  </Badge>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{log.message}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{log.service}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Developer Tools</CardTitle>
          <CardDescription>Quick access to development and debugging tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Code className="h-6 w-6" />
              <span>API Logs</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Database className="h-6 w-6" />
              <span>Database Monitor</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Error Tracker</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Zap className="h-6 w-6" />
              <span>AI Master Brain</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperDashboard;
