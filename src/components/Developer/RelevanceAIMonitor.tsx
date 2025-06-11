
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Brain, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import AgentHealthDashboard from '@/components/Developer/AgentHealthDashboard';
import { relevanceAIConnection } from '@/services/relevance/RelevanceAIConnectionService';

const RelevanceAIMonitor: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [agentCount, setAgentCount] = useState(0);

  useEffect(() => {
    initializeConnection();
  }, []);

  const initializeConnection = async () => {
    try {
      const connected = await relevanceAIConnection.initialize();
      setConnectionStatus(connected ? 'connected' : 'error');
      
      if (connected) {
        const health = relevanceAIConnection.getHealthStatus();
        setAgentCount(health.agentsRegistered.filter(a => a.status === 'active').length);
      }
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="health" className="h-full">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Relevance AI Monitor</h1>
              <p className="text-muted-foreground">
                Monitor and manage Relevance AI agent performance
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                {connectionStatus === 'connected' ? (
                  <CheckCircle className="h-3 w-3" />
                ) : connectionStatus === 'error' ? (
                  <AlertTriangle className="h-3 w-3" />
                ) : (
                  <Activity className="h-3 w-3 animate-pulse" />
                )}
                {connectionStatus}
              </Badge>
              
              {connectionStatus === 'connected' && (
                <Badge variant="outline">
                  {agentCount} agents active
                </Badge>
              )}
            </div>
          </div>
          
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Health
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Config
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="health" className="h-full overflow-y-auto">
          <AgentHealthDashboard />
        </TabsContent>

        <TabsContent value="performance" className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Execution Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Performance metrics dashboard coming soon...
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Response time analytics coming soon...
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Agent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Agent activity logs coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="p-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Agent configuration interface coming soon...
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
