
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import ProductionReadinessMonitor from '@/components/SystemHealth/ProductionReadinessMonitor';
import UserAccountManager from '@/components/Developer/UserAccountManager';
import AgentHealthDashboard from '@/components/Developer/AgentHealthDashboard';
import ErrorBoundary from '@/components/auth/ErrorBoundary';
import { relevanceAIConnection } from '@/services/relevance/RelevanceAIConnectionService';
import { agentOrchestrator } from '@/services/agents/AgentOrchestrator';
import { Activity, Brain, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const DeveloperDashboard = () => {
  const { user, profile } = useAuth();
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    initializeAISystem();
    const interval = setInterval(refreshSystemHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const initializeAISystem = async () => {
    setIsInitializing(true);
    try {
      // Initialize Relevance AI connection
      const connected = await relevanceAIConnection.initialize();
      
      // Get system health
      await refreshSystemHealth();
      
      console.log('AI System initialized:', { connected });
    } catch (error) {
      console.error('Failed to initialize AI system:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const refreshSystemHealth = async () => {
    try {
      const health = relevanceAIConnection.getHealthStatus();
      const performanceMetrics = agentOrchestrator.getPerformanceMetrics();
      
      setSystemHealth({
        ...health,
        performanceMetrics
      });
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to refresh system health:', error);
    }
  };

  const handleTestAgent = async (agentType: string) => {
    try {
      const result = await agentOrchestrator.executeTask({
        agentType: agentType as any,
        taskType: 'health_check',
        context: {
          workspace: 'developer',
          userRole: 'developer',
          companyId: profile?.company_id || 'demo',
          userId: user?.id || 'demo'
        },
        priority: 'medium'
      });
      
      console.log(`${agentType} test result:`, result);
      await refreshSystemHealth();
    } catch (error) {
      console.error(`Failed to test ${agentType}:`, error);
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
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DeveloperNavigation />
      
      <main className="pt-[60px]">
        <div className="flex-1 px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="border-b pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Developer Dashboard</h1>
                  <p className="text-muted-foreground mt-2">
                    AI System monitoring, user management, and production readiness tools
                  </p>
                  {profile && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      Logged in as: <span className="font-medium">{profile.full_name}</span> ({profile.role})
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={refreshSystemHealth}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Badge variant={systemHealth?.apiConnected ? 'default' : 'destructive'}>
                    {isInitializing ? 'Initializing...' : systemHealth?.apiConnected ? 'AI Online' : 'AI Offline'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* AI System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemHealth?.apiConnected ? 'Connected' : 'Disconnected'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last check: {lastUpdate.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemHealth?.agentsRegistered?.filter((a: any) => a.status === 'active').length || 0}/
                    {systemHealth?.agentsRegistered?.length || 4}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Agents operational
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Task Queue</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Pending tasks
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemHealth?.agentsRegistered?.[0]?.responseTimeMs || 0}ms
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average agent response
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Agent Status Grid */}
            <Card>
              <CardHeader>
                <CardTitle>AI Agents Status</CardTitle>
                <CardDescription>Real-time status of all AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systemHealth?.agentsRegistered?.map((agent: any) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestAgent(agent.id)}
                        >
                          Test
                        </Button>
                        <Badge variant={agent.status === 'active' ? 'default' : 'destructive'}>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-muted-foreground">
                      No agents registered
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <ErrorBoundary>
                <ProductionReadinessMonitor />
              </ErrorBoundary>
              
              {/* User Management */}
              <ErrorBoundary>
                <UserAccountManager />
              </ErrorBoundary>
            </div>

            {/* Agent Health Details */}
            <ErrorBoundary>
              <AgentHealthDashboard />
            </ErrorBoundary>

            {/* System Information */}
            <ErrorBoundary>
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Current system status and configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Environment</p>
                      <p className="text-muted-foreground">
                        {process.env.NODE_ENV || 'development'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Current Route</p>
                      <p className="text-muted-foreground">
                        {window.location.pathname}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">User ID</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {user?.id || 'Not authenticated'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Timestamp</p>
                      <p className="text-muted-foreground">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;
