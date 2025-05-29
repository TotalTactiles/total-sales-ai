
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, 
  Brain, 
  Activity, 
  Database, 
  Zap, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';

interface SystemMetrics {
  totalUsers: number;
  activeAISessions: number;
  apiCalls24h: number;
  systemUptime: string;
  errorRate: number;
  performanceScore: number;
}

const DeveloperDashboard: React.FC = () => {
  const { metrics, isChecking, checkSystemHealth, overallHealth } = useSystemHealth();
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    activeAISessions: 0,
    apiCalls24h: 0,
    systemUptime: '99.9%',
    errorRate: 0.1,
    performanceScore: 95
  });

  useEffect(() => {
    loadSystemMetrics();
    const interval = setInterval(loadSystemMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemMetrics = async () => {
    // Simulate loading real-time metrics
    setSystemMetrics({
      totalUsers: Math.floor(Math.random() * 100) + 150,
      activeAISessions: Math.floor(Math.random() * 20) + 5,
      apiCalls24h: Math.floor(Math.random() * 10000) + 50000,
      systemUptime: '99.9%',
      errorRate: Math.random() * 0.5,
      performanceScore: Math.floor(Math.random() * 10) + 90
    });
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
          <p className="text-slate-400">System overview and health monitoring</p>
        </div>
        <Button onClick={checkSystemHealth} disabled={isChecking} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          {isChecking ? 'Checking...' : 'Health Check'}
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">System Health</CardTitle>
            <Monitor className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>
              {overallHealth.charAt(0).toUpperCase() + overallHealth.slice(1)}
            </div>
            <p className="text-xs text-slate-400">Overall status</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">AI Services</CardTitle>
            <Brain className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(metrics.aiSystemHealth)}`}>
              {metrics.aiSystemHealth}
            </div>
            <p className="text-xs text-slate-400">Claude + GPT + Voice</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Database</CardTitle>
            <Database className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(metrics.databaseHealth)}`}>
              {metrics.databaseHealth}
            </div>
            <p className="text-xs text-slate-400">{metrics.responseTime.toFixed(0)}ms response</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Users</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{systemMetrics.totalUsers}</div>
            <p className="text-xs text-slate-400">Total registered</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">Real-time Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Active AI Sessions</span>
              <Badge className="bg-green-500 text-white">{systemMetrics.activeAISessions}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">API Calls (24h)</span>
              <span className="text-cyan-400">{systemMetrics.apiCalls24h.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">System Uptime</span>
              <span className="text-green-400">{systemMetrics.systemUptime}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Performance Score</span>
                <span className="text-cyan-400">{systemMetrics.performanceScore}%</span>
              </div>
              <Progress value={systemMetrics.performanceScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">System Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-slate-300">Master AI Brain</span>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300">Voice System</span>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-slate-300">Analytics Engine</span>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">Data Pipeline</span>
              </div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">Recent System Activity</CardTitle>
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
                <p className="text-slate-200 text-sm">Voice system handled 23 conversations</p>
                <p className="text-slate-400 text-xs">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
              <Database className="h-4 w-4 text-green-400" />
              <div className="flex-1">
                <p className="text-slate-200 text-sm">Database optimization completed</p>
                <p className="text-slate-400 text-xs">15 minutes ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperDashboard;
