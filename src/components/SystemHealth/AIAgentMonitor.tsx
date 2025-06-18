
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { logger } from '@/utils/logger';

interface AgentStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  lastSeen: Date;
  responseTime?: number;
  errorCount: number;
  version?: string;
}

const AIAgentMonitor = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const mockAgents: AgentStatus[] = [
    {
      name: 'Sales Agent',
      status: 'online',
      lastSeen: new Date(),
      responseTime: 120,
      errorCount: 0,
      version: '1.0.0'
    },
    {
      name: 'Manager Agent',
      status: 'online',
      lastSeen: new Date(Date.now() - 30000),
      responseTime: 95,
      errorCount: 0,
      version: '1.0.0'
    },
    {
      name: 'Developer Agent',
      status: 'degraded',
      lastSeen: new Date(Date.now() - 120000),
      responseTime: 250,
      errorCount: 2,
      version: '1.0.0'
    },
    {
      name: 'Automation Agent',
      status: 'online',
      lastSeen: new Date(Date.now() - 10000),
      responseTime: 180,
      errorCount: 0,
      version: '1.0.0'
    }
  ];

  const checkAgentHealth = async () => {
    setIsChecking(true);
    try {
      // In a real implementation, this would ping actual AI agents
      // For now, we'll simulate the check with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAgents(mockAgents);
      logger.info('AI Agent health check completed');
    } catch (error) {
      logger.error('AI Agent health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAgentHealth();
    const interval = setInterval(checkAgentHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: AgentStatus['status']) => {
    switch (status) {
      case 'online':
        return <Badge variant="default" className="bg-green-500">Online</Badge>;
      case 'degraded':
        return <Badge variant="secondary" className="bg-yellow-500">Degraded</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Agent Health Monitor</CardTitle>
            <CardDescription>
              Real-time status of all AI agents and automation systems
            </CardDescription>
          </div>
          <Button onClick={checkAgentHealth} disabled={isChecking} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agents.map((agent, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                {getStatusIcon(agent.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{agent.name}</p>
                    {agent.version && (
                      <span className="text-xs text-muted-foreground">v{agent.version}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatLastSeen(agent.lastSeen)}
                    </span>
                    {agent.responseTime && (
                      <span>{agent.responseTime}ms</span>
                    )}
                    {agent.errorCount > 0 && (
                      <span className="text-red-500">{agent.errorCount} errors</span>
                    )}
                  </div>
                </div>
              </div>
              {getStatusBadge(agent.status)}
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded text-sm">
          <h4 className="font-medium mb-1">AI System Status:</h4>
          <p className="text-xs">
            {agents.filter(a => a.status === 'online').length} online, {' '}
            {agents.filter(a => a.status === 'degraded').length} degraded, {' '}
            {agents.filter(a => a.status === 'offline').length} offline
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Failsafe mode: {agents.some(a => a.status === 'offline') ? 'Active' : 'Standby'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAgentMonitor;
