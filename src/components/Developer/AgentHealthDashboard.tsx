
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Brain,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import { relevanceAIConnection } from '@/services/relevance/RelevanceAIConnectionService';
import { agentOrchestrator } from '@/services/agents/AgentOrchestrator';

interface HealthMetrics {
  apiConnection: boolean;
  agentsActive: number;
  totalAgents: number;
  avgResponseTime: number;
  successRate: number;
  lastUpdate: string;
}

const AgentHealthDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    apiConnection: false,
    agentsActive: 0,
    totalAgents: 4,
    avgResponseTime: 0,
    successRate: 0,
    lastUpdate: ''
  });
  const [isChecking, setIsChecking] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<any[]>([]);

  useEffect(() => {
    performHealthCheck();
    const interval = setInterval(performHealthCheck, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const performHealthCheck = async () => {
    setIsChecking(true);
    try {
      // Check API connection
      const connectionHealth = await relevanceAIConnection.performHealthCheck();
      
      // Get performance metrics
      const performanceMetrics = agentOrchestrator.getPerformanceMetrics();
      
      // Calculate averages
      let totalExecutions = 0;
      let totalSuccesses = 0;
      let totalTime = 0;
      let activeAgents = 0;

      const agentStatusList = connectionHealth.agentsRegistered.map(agent => {
        const agentMetrics = performanceMetrics.get(`${agent.id}-general`) || {};
        if (agent.status === 'active') activeAgents++;
        
        if (agentMetrics.totalExecutions > 0) {
          totalExecutions += agentMetrics.totalExecutions;
          totalSuccesses += agentMetrics.successCount || 0;
          totalTime += agentMetrics.totalTime || 0;
        }

        return {
          ...agent,
          metrics: agentMetrics
        };
      });

      setAgentStatuses(agentStatusList);
      setMetrics({
        apiConnection: connectionHealth.apiConnected,
        agentsActive: activeAgents,
        totalAgents: connectionHealth.agentsRegistered.length,
        avgResponseTime: totalExecutions > 0 ? totalTime / totalExecutions : 0,
        successRate: totalExecutions > 0 ? (totalSuccesses / totalExecutions) * 100 : 0,
        lastUpdate: new Date().toLocaleTimeString()
      });

    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'destructive';
      case 'error': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Health Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of Relevance AI agent status and performance
          </p>
        </div>
        <Button
          onClick={performHealthCheck}
          disabled={isChecking}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'Checking...' : 'Refresh'}
        </Button>
      </div>

      {/* Overall Health Status */}
      <Alert className={metrics.apiConnection ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        {metrics.apiConnection ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        )}
        <AlertDescription className={metrics.apiConnection ? 'text-green-800' : 'text-red-800'}>
          {metrics.apiConnection 
            ? 'Relevance AI connection is healthy and operational'
            : 'Relevance AI connection is down or experiencing issues'
          }
        </AlertDescription>
      </Alert>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Connection</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.apiConnection ? 'Connected' : 'Disconnected'}
            </div>
            <Badge variant={metrics.apiConnection ? 'default' : 'destructive'} className="mt-1">
              {metrics.apiConnection ? 'Healthy' : 'Error'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.agentsActive}/{metrics.totalAgents}
            </div>
            <Progress 
              value={(metrics.agentsActive / metrics.totalAgents) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.avgResponseTime.toFixed(0)}ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average task execution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.successRate.toFixed(1)}%
            </div>
            <Progress value={metrics.successRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Agent Status Details */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Status Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentStatuses.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(agent.status)}
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-sm text-muted-foreground">{agent.id}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {agent.metrics?.totalExecutions > 0 && (
                    <div className="text-right text-sm">
                      <div>{agent.metrics.totalExecutions} tasks</div>
                      <div className="text-muted-foreground">
                        {agent.metrics.averageTime?.toFixed(0)}ms avg
                      </div>
                    </div>
                  )}
                  
                  <Badge variant={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Update */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {metrics.lastUpdate}
      </div>
    </div>
  );
};

export default AgentHealthDashboard;
