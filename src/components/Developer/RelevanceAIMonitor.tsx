
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  AlertTriangle,
  Zap,
  Database,
  Settings,
  TrendingUp,
  Eye
} from 'lucide-react';
import { relevanceAIAgent, AgentHealthStatus, AgentTask } from '@/services/relevance/RelevanceAIAgentService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const RelevanceAIMonitor: React.FC = () => {
  const { profile } = useAuth();
  const [agentStatuses, setAgentStatuses] = useState<AgentHealthStatus[]>([]);
  const [recentTasks, setRecentTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [pingResult, setPingResult] = useState<{ success: boolean; responseTime: number; error?: string } | null>(null);

  useEffect(() => {
    loadMonitoringData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      setLoading(true);
      
      const [statuses, tasks] = await Promise.all([
        relevanceAIAgent.getAllAgentStatuses(),
        profile?.company_id ? relevanceAIAgent.getAgentTasks(profile.company_id) : Promise.resolve([])
      ]);

      setAgentStatuses(statuses);
      setRecentTasks(tasks);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
      toast.error('Failed to load agent monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const performPingTest = async () => {
    try {
      const result = await relevanceAIAgent.pingTest();
      setPingResult(result);
      
      if (result.success) {
        toast.success(`Relevance AI connected successfully (${result.responseTime}ms)`);
      } else {
        toast.error(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('Ping test failed');
    }
  };

  const performHealthCheck = async (agentName: string) => {
    try {
      await relevanceAIAgent.performHealthCheck(agentName);
      toast.success(`Health check completed for ${agentName}`);
      loadMonitoringData();
    } catch (error) {
      toast.error(`Health check failed for ${agentName}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'maintenance': return <Settings className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'retrying': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const totalTasks = recentTasks.length;
  const completedTasks = recentTasks.filter(t => t.status === 'completed').length;
  const failedTasks = recentTasks.filter(t => t.status === 'failed').length;
  const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Relevance AI Monitor</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={performPingTest}>
            <Activity className="h-4 w-4 mr-2" />
            Ping Test
          </Button>
          <Button variant="outline" onClick={loadMonitoringData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Ping Test Result */}
      {pingResult && (
        <Card className={`border-l-4 ${pingResult.success ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {pingResult.success ? 
                  <CheckCircle className="h-5 w-5 text-green-600" /> : 
                  <XCircle className="h-5 w-5 text-red-600" />
                }
                <span className="font-semibold">
                  {pingResult.success ? 'API Connected' : 'Connection Failed'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Response Time: {pingResult.responseTime}ms
              </div>
            </div>
            {pingResult.error && (
              <p className="text-red-700 text-sm mt-2">{pingResult.error}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-green-600">
                  {agentStatuses.filter(a => a.status === 'online').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-purple-600">{totalTasks}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Tasks</p>
                <p className="text-2xl font-bold text-red-600">{failedTasks}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="tasks">Task History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentStatuses.map((agent) => (
              <Card key={agent.agent_name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{agent.agent_name}</CardTitle>
                    {getStatusIcon(agent.status)}
                  </div>
                  <Badge className={`w-fit ${
                    agent.status === 'online' ? 'bg-green-100 text-green-800' :
                    agent.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {agent.status.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="font-medium">{agent.response_time_ms || 0}ms</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium text-green-600">
                        {agent.success_count + agent.error_count > 0 
                          ? Math.round((agent.success_count / (agent.success_count + agent.error_count)) * 100)
                          : 0}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Check:</span>
                      <span className="font-medium">
                        {new Date(agent.last_health_check).toLocaleTimeString()}
                      </span>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => performHealthCheck(agent.agent_name)}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Health Check
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-2">
            {recentTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">{task.task_type.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-600">{task.agent_type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      
                      {task.execution_time_ms && (
                        <span className="text-sm text-gray-600">
                          {task.execution_time_ms}ms
                        </span>
                      )}
                      
                      <span className="text-sm text-gray-600">
                        {new Date(task.started_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {task.error_message && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {task.error_message}
                    </div>
                  )}

                  {task.retry_count > 0 && (
                    <div className="mt-2 text-sm text-yellow-600">
                      Retried {task.retry_count} time(s)
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-bold text-green-600">{successRate}%</span>
                  </div>
                  <Progress value={successRate} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Completed</p>
                      <p className="text-xl font-bold text-green-600">{completedTasks}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Failed</p>
                      <p className="text-xl font-bold text-red-600">{failedTasks}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentStatuses.map((agent) => {
                    const totalOps = agent.success_count + agent.error_count;
                    const successRate = totalOps > 0 ? Math.round((agent.success_count / totalOps) * 100) : 0;
                    
                    return (
                      <div key={agent.agent_name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{agent.agent_name}</span>
                          <span className="font-medium">{successRate}%</span>
                        </div>
                        <Progress value={successRate} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelevanceAIMonitor;
