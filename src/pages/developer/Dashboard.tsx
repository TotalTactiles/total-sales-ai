
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Users, 
  Database, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Brain,
  Code,
  RefreshCw,
  Monitor,
  Shield,
  Timer,
  BarChart3
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface SystemHealth {
  auth: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  ai_models: 'healthy' | 'degraded' | 'down';
  routing: 'healthy' | 'degraded' | 'down';
  webhooks: 'healthy' | 'degraded' | 'down';
}

interface ErrorDigest {
  id: string;
  timestamp: Date;
  type: 'claude' | 'gpt' | 'retell' | 'api' | 'auth';
  message: string;
  resolved: boolean;
  retryCount: number;
}

const DeveloperDashboard = () => {
  const { profile } = useAuth();
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    auth: 'healthy',
    database: 'healthy',
    ai_models: 'healthy',
    routing: 'healthy',
    webhooks: 'healthy'
  });
  
  const [errorDigest, setErrorDigest] = useState<ErrorDigest[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  const systemStats = {
    totalUsers: 156,
    activeIntegrations: 3,
    apiCallsToday: 2847,
    errorRate: 0.2,
    uptime: 99.8,
    aiAccuracy: 94.5,
    currentVersion: 'v1.2.3',
    lastDeploy: '2 hours ago'
  };

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    setErrorDigest([
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000),
        type: 'claude',
        message: 'Rate limit exceeded for Claude API',
        resolved: false,
        retryCount: 3
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 600000),
        type: 'api',
        message: 'Webhook delivery failed for lead creation',
        resolved: true,
        retryCount: 1
      }
    ]);
  };

  const handleSystemPatch = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'down': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Monitor className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 text-white min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
          <p className="text-slate-400 mt-2">System monitoring and diagnostics</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            {systemStats.currentVersion}
          </Badge>
          <Button 
            onClick={handleSystemPatch} 
            disabled={isRefreshing}
            variant="outline" 
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            System Patch
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(systemHealth).map(([key, status]) => (
          <Card key={key} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getHealthIcon(status)}
                  <span className="text-sm font-medium text-white capitalize">
                    {key.replace('_', ' ')}
                  </span>
                </div>
                <span className={`text-xs font-medium ${getHealthColor(status)} capitalize`}>
                  {status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="errors" className="text-slate-300 data-[state=active]:text-white">Error Digest</TabsTrigger>
          <TabsTrigger value="performance" className="text-slate-300 data-[state=active]:text-white">Performance</TabsTrigger>
          <TabsTrigger value="logs" className="text-slate-300 data-[state=active]:text-white">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-400">{systemStats.totalUsers}</div>
                <p className="text-slate-400">Total registered users</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  API Calls Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{systemStats.apiCallsToday.toLocaleString()}</div>
                <p className="text-slate-400">Total API requests</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  System Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400">{systemStats.uptime}%</div>
                <p className="text-slate-400">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Errors</CardTitle>
              <CardDescription className="text-slate-400">
                Latest system errors and their resolution status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorDigest.map((error) => (
                  <div key={error.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={error.resolved ? "default" : "destructive"}>
                        {error.type}
                      </Badge>
                      <div>
                        <p className="text-white font-medium">{error.message}</p>
                        <p className="text-slate-400 text-sm">
                          {error.timestamp.toLocaleTimeString()} • Retries: {error.retryCount}
                        </p>
                      </div>
                    </div>
                    {error.resolved ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">AI Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Accuracy Score</span>
                    <span className="text-green-400">{systemStats.aiAccuracy}%</span>
                  </div>
                  <Progress value={systemStats.aiAccuracy} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Error Rate</span>
                    <span className="text-yellow-400">{systemStats.errorRate}%</span>
                  </div>
                  <Progress value={systemStats.errorRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Database Connections</span>
                  <Badge className="bg-green-500">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Memory Usage</span>
                  <span className="text-cyan-400">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">CPU Load</span>
                  <span className="text-purple-400">34%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <div className="flex-1">
                    <p className="text-slate-200 text-sm">AI Brain processed 1,247 user interactions</p>
                    <p className="text-slate-400 text-xs">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-slate-200 text-sm">Database optimization completed</p>
                    <p className="text-slate-400 text-xs">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                  <Database className="h-4 w-4 text-green-400" />
                  <div className="flex-1">
                    <p className="text-slate-200 text-sm">System backup completed successfully</p>
                    <p className="text-slate-400 text-xs">15 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperDashboard;
