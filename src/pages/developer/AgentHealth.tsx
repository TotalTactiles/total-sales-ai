
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Bot, 
  Brain, 
  Zap, 
  Heart, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Phone,
  MessageSquare,
  Users
} from 'lucide-react';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface Agent {
  id: string;
  name: string;
  type: 'voice' | 'chat' | 'automation';
  status: 'active' | 'idle' | 'error' | 'maintenance';
  health: number;
  activeConnections: number;
  tasksCompleted: number;
  errorRate: number;
  lastActive: Date;
  uptime: string;
}

const AgentHealth: React.FC = () => {
  const { execute, isLoading } = useAsyncOperation();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'TSAM Voice Agent',
      type: 'voice',
      status: 'active',
      health: 98,
      activeConnections: 12,
      tasksCompleted: 1247,
      errorRate: 0.2,
      lastActive: new Date(),
      uptime: '99.8%'
    },
    {
      id: '2',
      name: 'Chat Assistant',
      type: 'chat',
      status: 'active',
      health: 95,
      activeConnections: 34,
      tasksCompleted: 3456,
      errorRate: 1.1,
      lastActive: new Date(Date.now() - 1000 * 30),
      uptime: '98.2%'
    },
    {
      id: '3',
      name: 'Lead Automation Agent',
      type: 'automation',
      status: 'idle',
      health: 89,
      activeConnections: 0,
      tasksCompleted: 789,
      errorRate: 2.3,
      lastActive: new Date(Date.now() - 1000 * 60 * 5),
      uptime: '96.7%'
    },
    {
      id: '4',
      name: 'Sales Assistant AI',
      type: 'chat',
      status: 'error',
      health: 45,
      activeConnections: 0,
      tasksCompleted: 234,
      errorRate: 15.4,
      lastActive: new Date(Date.now() - 1000 * 60 * 15),
      uptime: '82.1%'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        health: Math.max(0, Math.min(100, agent.health + (Math.random() - 0.5) * 2)),
        activeConnections: agent.status === 'active' 
          ? Math.max(0, agent.activeConnections + Math.floor((Math.random() - 0.5) * 3))
          : 0,
        lastActive: agent.status === 'active' ? new Date() : agent.lastActive
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshAgents = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAgents(prev => prev.map(agent => ({
        ...agent,
        health: Math.min(100, agent.health + Math.random() * 10),
        status: agent.status === 'error' ? 'active' : agent.status,
        errorRate: Math.max(0, agent.errorRate - Math.random() * 2)
      })));
    }, 'sync');
  };

  const restartAgent = async (agentId: string) => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'active', health: 100, errorRate: 0, lastActive: new Date() }
          : agent
      ));
    }, 'sync');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'idle': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'maintenance': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'idle': return <Activity className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance': return <RefreshCw className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'voice': return <Phone className="h-5 w-5 text-blue-400" />;
      case 'chat': return <MessageSquare className="h-5 w-5 text-green-400" />;
      case 'automation': return <Zap className="h-5 w-5 text-purple-400" />;
      default: return <Bot className="h-5 w-5 text-gray-400" />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-400';
    if (health >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const overallHealth = Math.round(agents.reduce((sum, agent) => sum + agent.health, 0) / agents.length);
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const errorAgents = agents.filter(agent => agent.status === 'error').length;

  if (isLoading) {
    return <LoadingManager type="sync" message="Refreshing agent health..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agent Health Monitor</h1>
          <p className="text-gray-400 mt-2">Monitor AI agent performance and system health</p>
        </div>
        <Button 
          onClick={refreshAgents}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Overall Health</p>
                <p className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>
                  {overallHealth}%
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Agents</p>
                <p className="text-2xl font-bold text-green-400">{activeAgents}</p>
              </div>
              <Bot className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Error Agents</p>
                <p className="text-2xl font-bold text-red-400">{errorAgents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Connections</p>
                <p className="text-2xl font-bold text-blue-400">
                  {agents.reduce((sum, agent) => sum + agent.activeConnections, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(agent.type)}
                  <div>
                    <CardTitle className="text-white">{agent.name}</CardTitle>
                    <p className="text-gray-400 text-sm capitalize">{agent.type} Agent</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(agent.status)}>
                    {getStatusIcon(agent.status)}
                    {agent.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Health Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Health</span>
                  <span className={`text-sm font-bold ${getHealthColor(agent.health)}`}>
                    {agent.health}%
                  </span>
                </div>
                <Progress 
                  value={agent.health} 
                  className="h-2"
                />
              </div>

              {/* Agent Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-lg font-bold text-white">{agent.activeConnections}</p>
                  <p className="text-xs text-gray-400">Active Connections</p>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-lg font-bold text-white">{agent.tasksCompleted}</p>
                  <p className="text-xs text-gray-400">Tasks Completed</p>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className={`text-lg font-bold ${agent.errorRate > 5 ? 'text-red-400' : 'text-green-400'}`}>
                    {agent.errorRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400">Error Rate</p>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-lg font-bold text-white">{agent.uptime}</p>
                  <p className="text-xs text-gray-400">Uptime</p>
                </div>
              </div>

              {/* Last Active */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last Active:</span>
                <span className="text-white">{agent.lastActive.toLocaleTimeString()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {agent.status === 'error' && (
                  <Button 
                    onClick={() => restartAgent(agent.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart Agent
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentHealth;
