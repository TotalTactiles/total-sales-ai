
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Bot, Activity, CheckCircle, Circle, Terminal, Database, Code, GitBranch, AlertTriangle, Settings } from 'lucide-react';
import AISystemStatus from '@/components/developer/AISystemStatus';
import DeveloperDemoActions from '@/components/demo/DeveloperDemoActions';
import { useSystemData } from '@/hooks/useMockData';

const DeveloperDashboard: React.FC = () => {
  const { agentLogs, systemHealth, recentCommits, isLoading } = useSystemData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-400 border-t-transparent"></div>
      </div>
    );
  }

  // Ensure systemHealth has proper structure with fallbacks
  const healthData = {
    performance: 'Online',
    activeAgents: 6,
    apiCalls: 1247,
    uptime: '99.8%',
    errors: 0,
    responseTime: 45,
    memoryUsage: 68,
    cpuUsage: 23,
    ...systemHealth
  };

  return (
    <div className="space-y-6">
      {/* Demo Actions Panel */}
      <DeveloperDemoActions />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
          <p className="text-gray-400 mt-2">TSAM OS System Status & Control</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            System Online
          </Badge>
        </div>
      </div>

      {/* Quick System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">OS Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-lg font-bold text-white">{healthData.performance}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">AI Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-yellow-400" />
              <span className="text-lg font-bold text-white">{healthData.activeAgents} Active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-lg font-bold text-white">{healthData.apiCalls.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-lg font-bold text-white">{healthData.uptime}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI System Status Component */}
      <AISystemStatus />

      {/* Agent Logs */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Terminal className="h-5 w-5 text-green-400" />
            Agent Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agentLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bot className="h-4 w-4 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">{log.agent}</div>
                    <div className="text-gray-400 text-sm">{log.message}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={
                      log.level === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      log.level === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }
                  >
                    {log.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Commits */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-400" />
            Recent System Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCommits.map((commit: any) => (
              <div key={commit.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <Code className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-white font-medium">{commit.message}</div>
                    <div className="text-gray-400 text-sm">by {commit.author} • {commit.files} files</div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(commit.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Check */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-400" />
            System Health Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">Frontend Routing</span>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">Database Connection</span>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">Authentication</span>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <span className="text-gray-300">AI Infrastructure</span>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <Circle className="h-3 w-3 mr-1" />
                Standby
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Monitoring */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            Error Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-green-400 mb-2">{healthData.errors}</div>
            <div className="text-gray-400">Errors in last 24h</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperDashboard;
