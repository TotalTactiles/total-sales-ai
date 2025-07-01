
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Bot
} from 'lucide-react';
import { agentOrchestrator, AgentPerformanceMetrics } from '@/services/agents/AgentOrchestrator';
import { logger } from '@/utils/logger';

const AgentHealthDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Map<string, AgentPerformanceMetrics>>(new Map());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const performanceMetrics = agentOrchestrator.getPerformanceMetrics();
      setMetrics(performanceMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      logger.error('Failed to load agent metrics:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMetrics();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getHealthStatus = (metric: AgentPerformanceMetrics) => {
    if (metric.successRate >= 0.9) return { status: 'healthy', color: 'text-green-600', bg: 'bg-green-50' };
    if (metric.successRate >= 0.7) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'critical', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'salesAgent_v1': return <Bot className="h-5 w-5 text-blue-600" />;
      case 'managerAgent_v1': return <Bot className="h-5 w-5 text-purple-600" />;
      case 'automationAgent_v1': return <Bot className="h-5 w-5 text-green-600" />;
      case 'developerAgent_v1': return <Bot className="h-5 w-5 text-orange-600" />;
      default: return <Bot className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAgentName = (agentType: string) => {
    switch (agentType) {
      case 'salesAgent_v1': return 'Sales Agent (SAM)';
      case 'managerAgent_v1': return 'Manager Agent (MIRA)';
      case 'automationAgent_v1': return 'Automation Agent (ATLAS)';
      case 'developerAgent_v1': return 'Developer Agent (NOVA)';
      default: return agentType;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agent Health Dashboard</h2>
          <p className="text-gray-600">Monitor AI agent performance and system health</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Active Agents</div>
                <div className="text-2xl font-bold">{metrics.size}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Healthy Agents</div>
                <div className="text-2xl font-bold">
                  {Array.from(metrics.values()).filter(m => m.successRate >= 0.9).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-sm text-gray-600">Warnings</div>
                <div className="text-2xl font-bold">
                  {Array.from(metrics.values()).filter(m => m.successRate >= 0.7 && m.successRate < 0.9).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
                <div className="text-2xl font-bold">
                  {Array.from(metrics.values()).length > 0 
                    ? Math.round(Array.from(metrics.values()).reduce((acc, m) => acc + m.avgExecutionTime, 0) / metrics.size)
                    : 0}ms
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from(metrics.entries()).map(([agentType, metric]) => {
          const health = getHealthStatus(metric);
          return (
            <Card key={agentType}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  {getAgentIcon(agentType)}
                  {getAgentName(agentType)}
                  <Badge 
                    variant={health.status === 'healthy' ? 'default' : health.status === 'warning' ? 'secondary' : 'destructive'}
                  >
                    {health.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-semibold">
                        {(metric.successRate * 100).toFixed(1)}%
                      </div>
                      {metric.successRate >= 0.9 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Tasks</div>
                    <div className="text-lg font-semibold">{metric.totalTasks}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                    <div className="text-lg font-semibold">{Math.round(metric.avgExecutionTime)}ms</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Active</div>
                    <div className="text-sm">
                      {new Date(metric.lastActive).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Health Indicator */}
                <div className={`p-3 rounded-lg ${health.bg}`}>
                  <div className={`text-sm font-medium ${health.color}`}>
                    {health.status === 'healthy' && 'Agent performing optimally'}
                    {health.status === 'warning' && 'Agent performance degraded - monitoring required'}
                    {health.status === 'critical' && 'Agent experiencing issues - immediate attention needed'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {metrics.size === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Agent Data Available</h3>
            <p className="text-gray-500">Agent performance metrics will appear here once agents start processing tasks.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentHealthDashboard;
