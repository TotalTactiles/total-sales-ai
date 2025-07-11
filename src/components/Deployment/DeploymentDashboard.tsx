
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  Zap, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Activity,
  TrendingUp
} from 'lucide-react';
import { deploymentOrchestrator } from '@/services/deployment/DeploymentOrchestrator';

const DeploymentDashboard: React.FC = () => {
  const [environments, setEnvironments] = useState<any[]>([]);
  const [activeDeployments, setActiveDeployments] = useState<any[]>([]);
  const [deploymentHistory, setDeploymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [envData, activeData, historyData] = await Promise.all([
        deploymentOrchestrator.getEnvironments(),
        deploymentOrchestrator.getActiveDeployments(),
        deploymentOrchestrator.getDeploymentHistory(undefined, 20)
      ]);

      setEnvironments(envData);
      setActiveDeployments(activeData);
      setDeploymentHistory(historyData);
    } catch (error) {
      console.error('Failed to load deployment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'healthy': return 'bg-green-500';
      case 'completed': return 'bg-green-500';
      case 'deploying': return 'bg-blue-500';
      case 'building': return 'bg-blue-500';
      case 'running': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      case 'failed': return 'bg-red-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'healthy':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'deploying':
      case 'building':
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error':
      case 'failed':
      case 'down':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalEnvironments = environments.length;
  const activeEnvironments = environments.filter(e => e.status === 'active').length;
  const healthyenvironments = environments.filter(e => e.healthCheck.status === 'healthy').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environments</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnvironments}</div>
            <p className="text-xs text-muted-foreground">
              {activeEnvironments} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthyEnvironments}</div>
            <p className="text-xs text-muted-foreground">
              {totalEnvironments > 0 ? Math.round((healthyEnvironments / totalEnvironments) * 100) : 0}% healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeployments.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently deploying
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="environments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="environments">Environments</TabsTrigger>
          <TabsTrigger value="active">Active Deployments</TabsTrigger>
          <TabsTrigger value="history">Deployment History</TabsTrigger>
        </TabsList>

        <TabsContent value="environments" className="space-y-4">
          <div className="grid gap-4">
            {environments.map((environment) => (
              <Card key={environment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(environment.status)}`} />
                      <CardTitle className="text-lg">{environment.name}</CardTitle>
                      <Badge variant="outline">{environment.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={environment.healthCheck.status === 'healthy' ? 'default' : 'destructive'}
                        className="flex items-center space-x-1"
                      >
                        {getStatusIcon(environment.healthCheck.status)}
                        <span>{environment.healthCheck.status}</span>
                      </Badge>
                      <Button size="sm" variant="outline">
                        <GitBranch className="h-4 w-4 mr-1" />
                        Deploy
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Version: {environment.version} • Last deployment: {environment.lastDeployment.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">URL</p>
                      <p className="font-medium text-blue-600">{environment.url}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Response Time</p>
                      <p className="font-medium">{environment.healthCheck.responseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Instances</p>
                      <p className="font-medium">
                        {environment.scaling.currentInstances}/{environment.scaling.maxInstances}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Auto Scaling</p>
                      <p className="font-medium">
                        {environment.scaling.autoScaling ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeDeployments.length > 0 ? (
              activeDeployments.map((deployment) => {
                const currentStage = deployment.stages.find((s: any) => s.status === 'running') || 
                                  deployment.stages[deployment.stages.length - 1];
                const completedStages = deployment.stages.filter((s: any) => s.status === 'completed').length;
                const progress = (completedStages / deployment.stages.length) * 100;

                return (
                  <Card key={deployment.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Deployment {deployment.id}</CardTitle>
                        <Badge className="flex items-center space-x-1">
                          {getStatusIcon(deployment.status)}
                          <span>{deployment.status}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        Environment: {environments.find(e => e.id === deployment.environmentId)?.name || 'Unknown'} • 
                        Version: {deployment.config.version}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{completedStages}/{deployment.stages.length} stages</span>
                          </div>
                          <Progress value={progress} className="w-full" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Current Stage</p>
                            <p className="font-medium">{currentStage?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Strategy</p>
                            <p className="font-medium">{deployment.config.rolloutStrategy}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Stages:</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {deployment.stages.map((stage: any, index: number) => (
                              <div key={index} className="flex items-center space-x-2 text-xs">
                                {getStatusIcon(stage.status)}
                                <span className={stage.status === 'completed' ? 'text-green-600' : 
                                              stage.status === 'running' ? 'text-blue-600' :
                                              stage.status === 'failed' ? 'text-red-600' : 
                                              'text-muted-foreground'}>
                                  {stage.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active deployments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            {deploymentHistory.length > 0 ? (
              deploymentHistory.map((deployment) => (
                <Card key={deployment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Deployment {deployment.id}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={deployment.status === 'completed' ? 'default' : 'destructive'}
                          className="flex items-center space-x-1"
                        >
                          {getStatusIcon(deployment.status)}
                          <span>{deployment.status}</span>
                        </Badge>
                        <Badge variant="outline">{deployment.config.rolloutStrategy}</Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Environment: {environments.find(e => e.id === deployment.environmentId)?.name || 'Unknown'} • 
                      Version: {deployment.config.version}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Started</p>
                        <p className="font-medium">{deployment.startTime.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">
                          {deployment.endTime ? 
                            `${Math.round((deployment.endTime.getTime() - deployment.startTime.getTime()) / 1000)}s` : 
                            'Running...'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Stages</p>
                        <p className="font-medium">
                          {deployment.stages.filter((s: any) => s.status === 'completed').length}/{deployment.stages.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Build ID</p>
                        <p className="font-medium font-mono text-xs">{deployment.config.buildId}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No deployment history</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeploymentDashboard;
