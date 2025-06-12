
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
import { agentOrchestrator } from '@/services/agents/AgentOrchestrator';
import { relevanceAIService } from '@/services/relevance/RelevanceAIService';

const AgentHealthDashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    performHealthCheck();
    loadAgents();
    const interval = setInterval(performHealthCheck, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAgents = async () => {
    try {
      const agentList = await relevanceAIService.getAgents();
      setAgents(agentList);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const performHealthCheck = async () => {
    setIsChecking(true);
    try {
      const health = await agentOrchestrator.getAgentHealth();
      setHealthData(health);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (isHealthy: boolean) => {
    return isHealthy ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  if (!healthData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading agent health data...</p>
        </div>
      </div>
    );
  }

  const isHealthy = healthData.connectedAgents === healthData.totalAgents;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Health Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of AI agent status and performance
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
      <Alert className={isHealthy ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        {getStatusIcon(isHealthy)}
        <AlertDescription className={isHealthy ? 'text-green-800' : 'text-red-800'}>
          {isHealthy 
            ? 'All AI agents are healthy and operational'
            : `${healthData.connectedAgents}/${healthData.totalAgents} agents connected`
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
              {healthData.apiKeyConfigured ? 'Connected' : 'Mock Mode'}
            </div>
            <Badge variant={healthData.apiKeyConfigured ? 'default' : 'secondary'} className="mt-1">
              {healthData.apiKeyConfigured ? 'Live' : 'Demo'}
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
              {healthData.connectedAgents}/{healthData.totalAgents}
            </div>
            <Progress 
              value={(healthData.connectedAgents / healthData.totalAgents) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthData.totalTasks || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks executed
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
              {((healthData.successRate || 0) * 100).toFixed(1)}%
            </div>
            <Progress value={(healthData.successRate || 0) * 100} className="mt-2" />
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
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(healthData.apiKeyConfigured)}
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-sm text-muted-foreground">Agent ID: {agent.id}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={healthData.apiKeyConfigured ? 'default' : 'secondary'}>
                    {healthData.apiKeyConfigured ? 'Active' : 'Mock'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {healthData.performanceMetrics && healthData.performanceMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData.performanceMetrics.map(([key, metrics]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-2 border-b">
                  <div className="text-sm font-medium">{key}</div>
                  <div className="text-right text-sm">
                    <div>{metrics.totalExecutions} executions</div>
                    <div className="text-muted-foreground">
                      {metrics.averageTime?.toFixed(0)}ms avg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Update */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {lastUpdate}
      </div>
    </div>
  );
};

export default AgentHealthDashboard;
