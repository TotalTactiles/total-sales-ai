
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/Dashboard/StatsCard';
import { 
  Code, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Server,
  Database,
  Zap,
  Bug,
  GitBranch,
  Monitor
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DeveloperDashboard = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const mockStats = [
    {
      title: "System Uptime",
      value: "99.9%",
      change: "All systems operational",
      changeType: "positive" as const,
      icon: Server,
      iconColor: "text-green-600"
    },
    {
      title: "API Requests",
      value: "2.4M",
      change: "+15% from last week",
      changeType: "positive" as const,
      icon: Activity,
      iconColor: "text-blue-600"
    },
    {
      title: "Active Bugs",
      value: "3",
      change: "2 resolved this week",
      changeType: "positive" as const,
      icon: Bug,
      iconColor: "text-orange-600"
    },
    {
      title: "Performance Score",
      value: "95/100",
      change: "+3 points improvement",
      changeType: "positive" as const,
      icon: Zap,
      iconColor: "text-purple-600"
    }
  ];

  const systemHealth = [
    { service: "Authentication Service", status: "healthy", uptime: "99.9%" },
    { service: "Database Cluster", status: "healthy", uptime: "99.8%" },
    { service: "AI Agent Processing", status: "warning", uptime: "97.5%" },
    { service: "File Storage", status: "healthy", uptime: "100%" },
  ];

  const recentLogs = [
    { timestamp: "2024-01-15 14:32:15", level: "INFO", message: "User authentication successful", service: "auth" },
    { timestamp: "2024-01-15 14:31:45", level: "WARN", message: "High memory usage detected", service: "ai-agent" },
    { timestamp: "2024-01-15 14:30:12", level: "INFO", message: "Database backup completed", service: "database" },
    { timestamp: "2024-01-15 14:28:33", level: "ERROR", message: "Rate limit exceeded for API key", service: "api" },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {profile?.full_name || 'Developer'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-green-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'healthy' ? 'bg-green-500' :
                      service.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{service.service}</p>
                      <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <Badge variant={
                    service.status === 'healthy' ? 'default' :
                    service.status === 'warning' ? 'secondary' :
                    'destructive'
                  }>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-600" />
              Recent Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.map((log, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.level === 'INFO' ? 'bg-blue-100 text-blue-800' :
                      log.level === 'WARN' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="text-gray-700 ml-2">{log.message}</p>
                  <p className="text-gray-500 ml-2">Service: {log.service}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Database className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Database Console</h3>
            <p className="text-sm text-gray-600">Query and monitor</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <GitBranch className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Deploy Status</h3>
            <p className="text-sm text-gray-600">View deployments</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Bug className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Bug Tracker</h3>
            <p className="text-sm text-gray-600">Manage issues</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
            <p className="text-sm text-gray-600">System metrics</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Message */}
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-blue-600">🚀 Developer OS Active</h2>
        <p className="text-gray-600 mt-2">Your development environment is running smoothly with full monitoring</p>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
