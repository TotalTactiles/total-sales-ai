
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Activity, 
  Settings, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import AgentHealthDashboard from '@/components/Developer/AgentHealthDashboard';
import { relevanceAIService } from '@/services/relevance/RelevanceAIService';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';

const AgentManagement: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState<string>('');
  const [agents, setAgents] = useState<any[]>([]);
  const { executeTask, isLoading } = useAgentIntegration('developer');

  useEffect(() => {
    loadAgents();
    initializeService();
  }, []);

  const loadAgents = () => {
    const agentList = relevanceAIService.getAgents();
    setAgents(agentList);
  };

  const initializeService = async () => {
    setIsInitializing(true);
    try {
      const success = await relevanceAIService.initialize();
      setInitStatus(success ? 'connected' : 'mock_mode');
    } catch (error) {
      setInitStatus('error');
    } finally {
      setIsInitializing(false);
    }
  };

  const testAgent = async (agentId: string) => {
    try {
      await executeTask('test_task_execution', agentId as any, {
        testPayload: { message: 'Health check test' }
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Management</h1>
          <p className="text-muted-foreground">
            Configure and monitor AI agents for SalesOS
          </p>
        </div>
        <Button 
          onClick={initializeService} 
          disabled={isInitializing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isInitializing ? 'animate-spin' : ''}`} />
          {isInitializing ? 'Initializing...' : 'Refresh'}
        </Button>
      </div>

      {/* Status Alert */}
      <Alert className={initStatus === 'connected' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
        {initStatus === 'connected' ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        )}
        <AlertDescription>
          {initStatus === 'connected' && 'Relevance AI is connected and all agents are operational'}
          {initStatus === 'mock_mode' && 'Running in mock mode - add RELEVANCE_API_KEY to enable live agents'}
          {initStatus === 'error' && 'Failed to connect to Relevance AI - check configuration'}
          {initStatus === '' && 'Checking connection status...'}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="health" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health">Health Dashboard</TabsTrigger>
          <TabsTrigger value="agents">Agent Management</TabsTrigger>
          <TabsTrigger value="testing">Testing Suite</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <AgentHealthDashboard />
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>
                    <Badge variant={initStatus === 'connected' ? 'default' : 'secondary'}>
                      {initStatus === 'connected' ? 'Active' : 'Mock'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">Agent ID: {agent.id}</div>
                      <div className="text-muted-foreground">Role: {agent.role}</div>
                    </div>
                    <Button 
                      onClick={() => testAgent(agent.id)}
                      disabled={isLoading}
                      size="sm"
                      variant="outline"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Test Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Integration Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => testAgent('salesAgent_v1')}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Test Sales Agent Response
                </Button>
                <Button 
                  onClick={() => testAgent('managerAgent_v1')}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Test Manager Agent Analysis
                </Button>
                <Button 
                  onClick={() => testAgent('automationAgent_v1')}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Test Automation Triggers
                </Button>
                <Button 
                  onClick={() => testAgent('developerAgent_v1')}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Test Developer Agent Debug
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Database Connection Test
                </Button>
                <Button 
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Memory Table Access Test
                </Button>
                <Button 
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  API Rate Limit Test
                </Button>
                <Button 
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  Error Recovery Test
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentManagement;
