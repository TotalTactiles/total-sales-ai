
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp
} from 'lucide-react';
import { aiOrchestrator } from '@/services/ai/orchestration/AIOrchestrator';
import { agentCoordinator } from '@/services/ai/coordination/AgentCoordinator';

const AIOrchestrationDashboard = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [taskQueue, setTaskQueue] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [activeCoordinations, setActiveCoordinations] = useState<any[]>([]);
  const [orchestratorStats, setOrchestratorStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    avgResponseTime: 0,
    activeAgents: 0
  });

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [agentStatus, queueStatus, activeStatus, coordinations] = await Promise.all([
        aiOrchestrator.getAgentStatus(),
        aiOrchestrator.getTaskQueue(),
        aiOrchestrator.getActiveTasks(),
        agentCoordinator.getActiveCoordinations()
      ]);

      setAgents(agentStatus);
      setTaskQueue(queueStatus);
      setActiveTasks(activeStatus);
      setActiveCoordinations(coordinations);

      // Calculate stats
      const activeAgents = agentStatus.filter(agent => agent.status === 'active' || agent.status === 'busy').length;
      const totalTasks = queueStatus.length + activeStatus.length;
      const avgResponseTime = agentStatus.reduce((sum, agent) => sum + agent.performance.avgResponseTime, 0) / agentStatus.length;

      setOrchestratorStats({
        totalTasks,
        completedTasks: Math.floor(Math.random() * 100), // Mock data
        failedTasks: Math.floor(Math.random() * 10),
        avgResponseTime: Math.round(avgResponseTime || 0),
        activeAgents
      });

    } catch (error) {
      console.error('Failed to load orchestration data:', error);
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'idle': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'voice': return '🎤';
      case 'text': return '📝';
      case 'analytics': return '📊';
      case 'visual': return '👁️';
      default: return '🤖';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Active Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{orchestratorStats.activeAgents}</div>
            <p className="text-sm text-gray-600">of {agents.length} total</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{orchestratorStats.completedTasks}</div>
            <p className="text-sm text-gray-600">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{orchestratorStats.avgResponseTime}ms</div>
            <p className="text-sm text-gray-600">-5ms improvement</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Queue Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{taskQueue.length}</div>
            <p className="text-sm text-gray-600">{activeTasks.length} processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getAgentTypeIcon(agent.type)}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{agent.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{agent.type}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getAgentStatusColor(agent.status)}`}></div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium">{Math.round(agent.performance.successRate * 100)}%</span>
                  </div>
                  
                  <Progress 
                    value={agent.performance.successRate * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Avg: {agent.performance.avgResponseTime}ms</span>
                    <span>Errors: {agent.performance.errorCount}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 2).map((capability: string) => (
                    <Badge key={capability} variant="outline" className="text-xs">
                      {capability.replace('-', ' ')}
                    </Badge>
                  ))}
                  {agent.capabilities.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.capabilities.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Queue and Active Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Task Queue ({taskQueue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {taskQueue.slice(0, 10).map((task) => (
                <div key={task.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <span className="font-medium text-sm">{task.type}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(task.createdAt || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Requires: {task.requiredCapabilities?.join(', ') || 'General AI'}
                  </div>
                  
                  {task.deadline && (
                    <div className="text-xs text-orange-600 mt-1">
                      Deadline: {new Date(task.deadline).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
              
              {taskQueue.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No tasks in queue</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Active Tasks ({activeTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activeTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-3 bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-sm">{task.type}</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      Processing
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Agent: {task.assignedAgent || 'Assigning...'}
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.floor(Math.random() * 80 + 10)}%</span>
                    </div>
                    <Progress value={Math.floor(Math.random() * 80 + 10)} className="h-1" />
                  </div>
                </div>
              ))}
              
              {activeTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active tasks</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coordination Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Active Coordinations ({activeCoordinations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeCoordinations.length > 0 ? (
            <div className="space-y-4">
              {activeCoordinations.map((coordination) => (
                <div key={coordination.id} className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{coordination.type.toUpperCase()} Coordination</h3>
                      <p className="text-sm text-gray-600">
                        {coordination.tasks.length} tasks across {coordination.agents.length} agents
                      </p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      In Progress
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <div className="font-medium capitalize">{coordination.type}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Tasks:</span>
                      <div className="font-medium">{coordination.tasks.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Agents:</span>
                      <div className="font-medium">{coordination.agents.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Started:</span>
                      <div className="font-medium">
                        {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active coordinations</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Orchestrator Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start All Agents
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Pause className="h-4 w-4" />
              Pause Processing
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Restart Orchestrator
            </Button>
            <Button variant="outline" onClick={loadDashboardData}>
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIOrchestrationDashboard;
