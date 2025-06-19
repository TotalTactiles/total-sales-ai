
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Play,
  Clock
} from 'lucide-react';
import { agentConnectionService } from '@/services/ai/AgentConnectionService';

interface AgentMetrics {
  totalTasks: number;
  successfulTasks: number;
  failedTasks: number;
  averageResponseTime: number;
  uptime: number;
}

const AgentHealth: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [metrics, setMetrics] = useState<AgentMetrics>({
    totalTasks: 0,
    successfulTasks: 0,
    failedTasks: 0,
    averageResponseTime: 0,
    uptime: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadAgentData();
    const interval = setInterval(loadAgentData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAgentData = async () => {
    try {
      const agentData = agentConnectionService.getAllAgents();
      setAgents(agentData);
      
      if (agentData.length > 0 && !selectedAgent) {
        setSelectedAgent(agentData[0].id);
      }
      
      // Calculate overall metrics
      const totalSuccess = agentData.reduce((sum, agent) => sum + agent.successCount, 0);
      const totalErrors = agentData.reduce((sum, agent) => sum + agent.errorCount, 0);
      const totalTasks = totalSuccess + totalErrors;
      const avgResponseTime = agentData.reduce((sum, agent) => sum + (agent.responseTimeMs || 0), 0) / agentData.length;
      
      setMetrics({
        totalTasks,
        successfulTasks: totalSuccess,
        failedTasks: totalErrors,
        averageResponseTime: Math.round(avgResponseTime),
        uptime: agentData.filter(a => a.status === 'active').length / agentData.length * 100
      });
    } catch (error) {
      console.error('Failed to load agent data:', error);
    }
  };

  const refreshAgentHealth = async () => {
    setIsRefreshing(true);
    try {
      await agentConnectionService.performHealthCheck();
      await loadAgentData();
    } catch (error) {
      console.error('Failed to refresh agent health:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const testAgent = async (agentId: string) => {
    try {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) return;

      // Create a test task
      await agentConnectionService.createTask(
        agentId,
        'health_check',
        { test: true, timestamp: new Date().toISOString() },
        'test-user',
        'test-company'
      );

      // Refresh data after test
      setTimeout(() => {
        loadAgentData();
      }, 2000);
    } catch (error) {
      console.error('Failed to test agent:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const selectedAgentData = agents.find(a => a.id === selectedAgent);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor AI agent performance and status</p>
        </div>
        <Button onClick={refreshAgentHealth} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Health
        </Button>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{agents.length}</div>
                <div className="text-sm text-muted-foreground">Active Agents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalTasks}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{metrics.successfulTasks}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{metrics.failedTasks}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>Current status of all AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div 
                  key={agent.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAgent === agent.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(agent.status)}>
                      {getStatusIcon(agent.status)}
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        testAgent(agent.id);
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Badge variant={agent.status === 'active' ? 'default' : 'destructive'}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedAgentData && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedAgentData.name} Details</CardTitle>
              <CardDescription>Detailed metrics for selected agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="flex items-center gap-2">
                    <div className={getStatusColor(selectedAgentData.status)}>
                      {getStatusIcon(selectedAgentData.status)}
                    </div>
                    <span className="font-medium capitalize">{selectedAgentData.status}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                  <div className="font-medium">{selectedAgentData.responseTimeMs || 0}ms</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Success Count</div>
                  <div className="font-medium text-green-600">{selectedAgentData.successCount}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Error Count</div>
                  <div className="font-medium text-red-600">{selectedAgentData.errorCount}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Success Rate</div>
                <Progress 
                  value={
                    selectedAgentData.successCount + selectedAgentData.errorCount > 0
                      ? (selectedAgentData.successCount / (selectedAgentData.successCount + selectedAgentData.errorCount)) * 100
                      : 0
                  } 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Last Health Check</div>
                <div className="font-medium">
                  {selectedAgentData.lastHealthCheck 
                    ? new Date(selectedAgentData.lastHealthCheck).toLocaleString()
                    : 'Never'
                  }
                </div>
              </div>

              <Button 
                onClick={() => testAgent(selectedAgentData.id)} 
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Health Check
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgentHealth;
