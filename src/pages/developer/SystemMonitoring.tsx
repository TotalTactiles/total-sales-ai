
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, AlertTriangle, CheckCircle, Activity, Database, Cpu, HardDrive } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const SystemMonitoring = () => {
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const shouldShowMockData = isDemoMode() || showDemo;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore system monitoring capabilities.');
  };

  const systemHealth = {
    overall: 'healthy',
    uptime: '99.9%',
    lastIncident: '7 days ago',
    totalAlerts: 3
  };

  const services = [
    { name: 'Web Application', status: 'healthy', uptime: '99.9%', responseTime: '245ms' },
    { name: 'Database', status: 'healthy', uptime: '100%', responseTime: '12ms' },
    { name: 'AI Services', status: 'warning', uptime: '98.5%', responseTime: '890ms' },
    { name: 'Email Service', status: 'healthy', uptime: '99.8%', responseTime: '156ms' },
    { name: 'Voice AI', status: 'healthy', uptime: '99.2%', responseTime: '320ms' },
    { name: 'Authentication', status: 'healthy', uptime: '100%', responseTime: '98ms' }
  ];

  const recentAlerts = [
    { level: 'warning', message: 'AI service response time above threshold', timestamp: '10:45 AM', service: 'AI Services' },
    { level: 'info', message: 'Database backup completed successfully', timestamp: '09:30 AM', service: 'Database' },
    { level: 'error', message: 'Failed connection to external API (resolved)', timestamp: '08:15 AM', service: 'Integrations' }
  ];

  const resourceMetrics = {
    cpu: { usage: 23, threshold: 80 },
    memory: { usage: 67, threshold: 85 },
    disk: { usage: 45, threshold: 90 },
    network: { usage: 34, threshold: 75 }
  };

  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="System Monitoring" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {shouldShowMockData && (
        <DemoModeIndicator workspace="System Monitoring & Infrastructure Health" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Real-time infrastructure monitoring and health analytics
          </p>
        </div>
        <Button>
          <Monitor className="h-4 w-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{systemHealth.overall}</div>
            <p className="text-xs text-green-600">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.uptime}</div>
            <p className="text-xs text-muted-foreground">30-day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.totalAlerts}</div>
            <p className="text-xs text-orange-600">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Incident</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.lastIncident}</div>
            <p className="text-xs text-muted-foreground">Minor service disruption</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Individual service health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{service.name}</p>
                      <Badge 
                        variant={service.status === 'healthy' ? 'default' : 'destructive'}
                        className={service.status === 'healthy' ? 'bg-green-100 text-green-800' : service.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                      >
                        {service.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Uptime: {service.uptime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{service.responseTime}</p>
                    <p className="text-xs text-muted-foreground">Response time</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>System resource utilization metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className="text-sm">{resourceMetrics.cpu.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${resourceMetrics.cpu.usage > resourceMetrics.cpu.threshold ? 'bg-red-500' : 'bg-blue-500'}`} 
                    style={{ width: `${resourceMetrics.cpu.usage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Memory Usage</span>
                  </div>
                  <span className="text-sm">{resourceMetrics.memory.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${resourceMetrics.memory.usage > resourceMetrics.memory.threshold ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${resourceMetrics.memory.usage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Disk Usage</span>
                  </div>
                  <span className="text-sm">{resourceMetrics.disk.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${resourceMetrics.disk.usage > resourceMetrics.disk.threshold ? 'bg-red-500' : 'bg-purple-500'}`} 
                    style={{ width: `${resourceMetrics.disk.usage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Network Usage</span>
                  </div>
                  <span className="text-sm">{resourceMetrics.network.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${resourceMetrics.network.usage > resourceMetrics.network.threshold ? 'bg-red-500' : 'bg-orange-500'}`} 
                    style={{ width: `${resourceMetrics.network.usage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts & Events</CardTitle>
          <CardDescription>Latest system alerts and important events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <Badge 
                  variant={alert.level === 'error' ? 'destructive' : alert.level === 'warning' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {alert.level}
                </Badge>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{alert.message}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{alert.service}</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
