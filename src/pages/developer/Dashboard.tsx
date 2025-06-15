
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
  GitBranch,
  Globe,
  Shield,
  Timer,
  BarChart3,
  Monitor,
  Bell,
  Settings
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

interface LogEntry {
  id: string;
  timestamp: Date;
  module: string;
  endpoint: string;
  agentId?: string;
  companyId?: string;
  status: 'success' | 'error' | 'warning';
  message: string;
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
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [retryQueue, setRetryQueue] = useState<any[]>([]);
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
    const interval = setInterval(loadSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    // Simulate loading system data
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

    setLogs([
      {
        id: '1',
        timestamp: new Date(),
        module: 'auth',
        endpoint: '/api/login',
        companyId: 'comp_123',
        status: 'success',
        message: 'User login successful'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 60000),
        module: 'ai',
        endpoint: '/api/claude/chat',
        agentId: 'agent_456',
        status: 'error',
        message: 'Claude API timeout'
      }
    ]);

    setRetryQueue([
      {
        id: 'retry_1',
        type: 'webhook',
        target: 'lead_created',
        attempts: 2,
        nextRetry: new Date(Date.now() + 300000)
      }
    ]);
  };

  const handleSystemPatch = async () => {
    setIsRefreshing(true);
    // Simulate system patch
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'down': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Monitor className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
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
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
            <Monitor className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="errors" className="data-[state=active]:bg-slate-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Errors
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-slate-700">
            <Code className="h-4 w-4 mr-2" />
            Live Logs
          </TabsTrigger>
          <TabsTrigger value="retry" className="data-[state=active]:bg-slate-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Queue
          </TabsTrigger>
          <TabsTrigger value="deployment" className="data-[state=active]:bg-slate-700">
            <GitBranch className="h-4 w-4 mr-2" />
            Deployment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <CardTitle className="text-sm font-medium text-white">System Uptime</CardTitle>
                <Activity className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{systemStats.uptime}%</div>
                <p className="text-xs text-slate-400">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Error Rate</span>
                  <span className="text-cyan-400">{systemStats.errorRate}%</span>
                </div>
                <Progress value={systemStats.errorRate} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">AI Accuracy</span>
                  <span className="text-cyan-400">{systemStats.aiAccuracy}%</span>
                </div>
                <Progress value={systemStats.aiAccuracy} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Error Digest</CardTitle>
              <CardDescription className="text-slate-400">
                Recent system errors and resolutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorDigest.map((error) => (
                  <div key={error.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        error.resolved ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <div>
                        <p className="text-sm text-white">{error.message}</p>
                        <p className="text-xs text-slate-400">
                          {error.type.toUpperCase()} • {error.timestamp.toLocaleTimeString()} • {error.retryCount} retries
                        </p>
                      </div>
                    </div>
                    <Badge variant={error.resolved ? "default" : "destructive"}>
                      {error.resolved ? 'Resolved' : 'Active'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Realtime Logs</CardTitle>
              <CardDescription className="text-slate-400">
                Live system activity and API calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      log.status === 'success' ? 'bg-green-400' :
                      log.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        {log.module} • {log.endpoint}
                      </p>
                      <p className="text-xs text-slate-400">
                        {log.message} • {log.timestamp.toLocaleTimeString()}
                        {log.companyId && ` • Company: ${log.companyId}`}
                        {log.agentId && ` • Agent: ${log.agentId}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retry" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Retry Queue</CardTitle>
              <CardDescription className="text-slate-400">
                Failed operations awaiting retry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {retryQueue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-sm text-white">{item.type} • {item.target}</p>
                      <p className="text-xs text-slate-400">
                        Attempts: {item.attempts} • Next retry: {item.nextRetry.toLocaleTimeString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="border-slate-600 text-white">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Version Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Current Version</span>
                  <Badge className="bg-green-500 text-white">{systemStats.currentVersion}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Last Deploy</span>
                  <span className="text-cyan-400">{systemStats.lastDeploy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Environment</span>
                  <Badge variant="outline">Production</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Webhook Monitor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Active Webhooks</span>
                  <span className="text-cyan-400">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Failed Deliveries</span>
                  <span className="text-red-400">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Success Rate</span>
                  <span className="text-green-400">99.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperDashboard;
