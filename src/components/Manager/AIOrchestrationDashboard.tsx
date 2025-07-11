
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Cpu,
  Eye,
  Mic,
  BarChart3
} from 'lucide-react';
import { aiOrchestrator } from '@/services/ai/orchestration/AIOrchestrator';
import { agentCoordinator } from '@/services/ai/coordination/AgentCoordinator';
import { multiModalProcessor } from '@/services/ai/multimodal/MultiModalProcessor';

const AIOrchestrationDashboard: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [taskQueue, setTaskQueue] = useState<any[]>([]);
  const [coordinations, setCoordinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [agentsData, activeTasksData, queueData, coordinationsData] = await Promise.all([
        aiOrchestrator.getAgentStatus(),
        aiOrchestrator.getActiveTasks(),
        aiOrchestrator.getTaskQueue(),
        agentCoordinator.getActiveCoordinations()
      ]);

      setAgents(agentsData);
      setActiveTasks(activeTasksData);
      setTaskQueue(queueData);
      setCoordinations(coordinationsData);
    } catch (error) {
      console.error('Failed to load AI orchestration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'voice': return <Mic className="h-4 w-4" />;
      case 'visual': return <Eye className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'text': return <Brain className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-blue-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'idle':
        return <CheckCircle className="h-4 w-4" />;
      case 'busy':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'busy').length;
  const avgResponseTime = agents.length > 0 ? 
    Math.round(agents.reduce((sum, a) => sum + a.performance.avgResponseTime, 0) / agents.length) : 0;
  const avgSuccessRate = agents.length > 0 ?
    Math.round(agents.reduce((sum, a) => sum + a.performance.successRate, 0) / agents.length * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              {activeAgents} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {taskQueue.length} queued
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Across all agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
          <TabsTrigger value="queue">Task Queue</TabsTrigger>
          <TabsTrigger value="coordination">Coordination</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                      {getAgentIcon(agent.type)}
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <Badge variant="outline">{agent.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={agent.status === 'active' || agent.status === 'idle' ? 'default' : 'destructive'}
                        className="flex items-center space-x-1"
                      >
                        {getStatusIcon(agent.status)}
                        <span>{agent.status}</span>
                      </Badge>
                      <Badge variant="secondary">Priority {agent.priority}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Last heartbeat: {agent.lastHeartbeat.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Response Time</p>
                        <p className="font-medium">{agent.performance.avgResponseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Success Rate</p>
                        <p className="font-medium">{Math.round(agent.performance.successRate * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Error Count</p>
                        <p className="font-medium text-red-600">{agent.performance.errorCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Capabilities</p>
                        <p className="font-medium">{agent.capabilities.length}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Capabilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((capability: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4">
            {activeTasks.length > 0 ? (
              activeTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Task {task.id}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default" className="flex items-center space-x-1">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <span>Processing</span>
                        </Badge>
                        <Badge variant="outline">{task.priority}</Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Type: {task.type} • Deadline: {task.deadline ? task.deadline.toLocaleString() : 'None'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Required Capabilities</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {task.requiredCapabilities.map((cap: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {cap}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Context</p>
                          <p className="font-medium">User: {task.context.userId}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active tasks</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <div className="grid gap-4">
            {taskQueue.length > 0 ? (
              taskQueue.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Queued Task {task.id}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Queued</span>
                        </Badge>
                        <Badge 
                          variant={task.priority === 'critical' ? 'destructive' : 
                                 task.priority === 'high' ? 'default' : 'outline'}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Type: {task.type} • Dependencies: {task.dependencies?.length || 0}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Required Capabilities</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.requiredCapabilities.map((cap: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Estimated Wait</p>
                        <p className="font-medium">~2 minutes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Task queue is empty</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="coordination" className="space-y-4">
          <div className="grid gap-4">
            {coordinations.length > 0 ? (
              coordinations.map((coordination) => (
                <Card key={coordination.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Coordination {coordination.id}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className="flex items-center space-x-1">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <span>Active</span>
                        </Badge>
                        <Badge variant="outline">{coordination.type}</Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Agents: {coordination.agents.length} • Tasks: {coordination.tasks.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Coordination Type</p>
                          <p className="font-medium capitalize">{coordination.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeout</p>
                          <p className="font-medium">{coordination.timeout ? `${coordination.timeout}ms` : 'None'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Involved Agents:</p>
                        <div className="flex flex-wrap gap-1">
                          {coordination.agents.map((agentId: string, index: number) => {
                            const agent = agents.find(a => a.id === agentId);
                            return (
                              <Badge key={index} variant="outline" className="text-xs">
                                {agent ? agent.name : agentId}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active coordinations</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIOrchestrationDashboard;
