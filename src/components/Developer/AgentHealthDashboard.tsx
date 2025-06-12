
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Zap,
  Clock,
  TrendingUp,
  Server
} from 'lucide-react';

const AgentHealthDashboard: React.FC = () => {
  const agentMetrics = [
    { name: 'Sales Assistant', status: 'healthy', uptime: '99.9%', response: '120ms' },
    { name: 'Lead Qualifier', status: 'warning', uptime: '98.2%', response: '340ms' },
    { name: 'Email Agent', status: 'healthy', uptime: '99.7%', response: '95ms' },
    { name: 'Call Coach', status: 'error', uptime: '85.1%', response: '1200ms' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Agent Health Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Monitor AI agent performance, uptime, and system health metrics
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Agents</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">4</p>
              </div>
              <Server className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Healthy</p>
                <p className="text-2xl font-bold text-green-600">2</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Avg Response</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">439ms</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Uptime</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">95.7%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Status List */}
      <Card className="bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Activity className="h-5 w-5" />
            Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentMetrics.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(agent.status)}
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">{agent.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Response: {agent.response}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{agent.uptime}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Uptime</p>
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Sales Assistant restarted successfully</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Lead Qualifier experiencing high latency</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <XCircle className="h-4 w-4 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Call Coach agent connection failed</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentHealthDashboard;
