
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Database, 
  Settings, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { enterpriseIntegrationService } from '@/services/enterprise/EnterpriseIntegrationService';

const EnterpriseIntegrationDashboard: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [activeSyncs, setActiveSyncs] = useState<any[]>([]);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [integrationsData, activeSyncsData, historyData] = await Promise.all([
        enterpriseIntegrationService.getIntegrations(),
        enterpriseIntegrationService.getActiveSyncs(),
        enterpriseIntegrationService.getSyncHistory(undefined, 20)
      ]);

      setIntegrations(integrationsData);
      setActiveSyncs(activeSyncsData);
      setSyncHistory(historyData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (integrationId: string) => {
    try {
      await enterpriseIntegrationService.executeSync(integrationId, 'incremental');
      await loadDashboardData();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'healthy': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
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

  const totalIntegrations = integrations.length;
  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const healthyIntegrations = integrations.filter(i => i.healthCheck.status === 'healthy').length;
  const totalSyncsToday = syncHistory.filter(s => {
    const today = new Date();
    const syncDate = new Date(s.startTime);
    return syncDate.toDateString() === today.toDateString();
  }).length;

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
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIntegrations}</div>
            <p className="text-xs text-muted-foreground">
              {activeIntegrations} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthyIntegrations}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((healthyIntegrations / totalIntegrations) * 100)}% healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Syncs</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSyncs.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Syncs Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSyncsToday}</div>
            <p className="text-xs text-muted-foreground">
              Completed today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="syncs">Active Syncs</TabsTrigger>
          <TabsTrigger value="history">Sync History</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(integration.status)}`} />
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant="outline">{integration.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={integration.healthCheck.status === 'healthy' ? 'default' : 'destructive'}
                        className="flex items-center space-x-1"
                      >
                        {getStatusIcon(integration.healthCheck.status)}
                        <span>{integration.healthCheck.status}</span>
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                        disabled={integration.status !== 'active'}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Provider: {integration.provider} • Last sync: {integration.lastSync.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Response Time</p>
                      <p className="font-medium">{integration.healthCheck.responseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rate Limit</p>
                      <p className="font-medium">{integration.rateLimits.requestsPerMinute}/min</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sync Frequency</p>
                      <p className="font-medium">{integration.syncFrequency} min</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium">v1.0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="syncs" className="space-y-4">
          <div className="grid gap-4">
            {activeSyncs.length > 0 ? (
              activeSyncs.map((sync) => (
                <Card key={sync.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Sync Job {sync.id}</CardTitle>
                      <Badge className="flex items-center space-x-1">
                        {getStatusIcon(sync.status)}
                        <span>{sync.status}</span>
                      </Badge>
                    </div>
                    <CardDescription>
                      Integration: {integrations.find(i => i.id === sync.integrationId)?.name || 'Unknown'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{sync.recordsProcessed} records processed</span>
                      </div>
                      <Progress value={75} className="w-full" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Started</p>
                          <p className="font-medium">{sync.startTime.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium">{sync.type}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active syncs</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            {syncHistory.map((sync) => (
              <Card key={sync.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Sync {sync.id}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={sync.status === 'completed' ? 'default' : 'destructive'}
                        className="flex items-center space-x-1"
                      >
                        {getStatusIcon(sync.status)}
                        <span>{sync.status}</span>
                      </Badge>
                      <Badge variant="outline">{sync.type}</Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Integration: {integrations.find(i => i.id === sync.integrationId)?.name || 'Unknown'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Started</p>
                      <p className="font-medium">{sync.startTime.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">
                        {sync.endTime ? 
                          `${Math.round((sync.endTime.getTime() - sync.startTime.getTime()) / 1000)}s` : 
                          'Running...'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Records</p>
                      <p className="font-medium">{sync.recordsProcessed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Errors</p>
                      <p className="font-medium text-red-600">{sync.recordsErrored}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseIntegrationDashboard;
