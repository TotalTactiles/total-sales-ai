
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Zap,
  RefreshCcw,
  ExternalLink,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

const ManagerCRMIntegrations = () => {
  const integrations = [
    {
      name: 'Salesforce',
      type: 'crm',
      status: 'connected',
      lastSync: '2 minutes ago',
      records: 1247,
      enabled: true,
      logo: '🔵'
    },
    {
      name: 'HubSpot',
      type: 'marketing',
      status: 'connected',
      lastSync: '5 minutes ago',
      records: 892,
      enabled: true,
      logo: '🟠'
    },
    {
      name: 'Pipedrive',
      type: 'crm',
      status: 'error',
      lastSync: '2 hours ago',
      records: 0,
      enabled: false,
      logo: '🟢'
    },
    {
      name: 'Mailchimp',
      type: 'email',
      status: 'connected',
      lastSync: '1 hour ago',
      records: 456,
      enabled: true,
      logo: '🐵'
    },
    {
      name: 'Zapier',
      type: 'automation',
      status: 'connected',
      lastSync: '30 seconds ago',
      records: 234,
      enabled: true,
      logo: '⚡'
    }
  ];

  const syncStats = {
    totalRecords: 2829,
    lastFullSync: '6 hours ago',
    syncErrors: 2,
    avgSyncTime: '1.2 minutes'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'syncing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'syncing': return <RefreshCcw className="h-4 w-4 animate-spin" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM Integrations</h1>
          <p className="text-muted-foreground">Manage external system connections and data sync</p>
        </div>
        <Button className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {/* Sync Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.totalRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Synced records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Full Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.lastFullSync}</div>
            <p className="text-xs text-muted-foreground">All systems</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{syncStats.syncErrors}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sync Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.avgSyncTime}</div>
            <p className="text-xs text-muted-foreground">Per integration</p>
          </CardContent>
        </Card>
      </div>

      {/* Integration List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Active Integrations
          </CardTitle>
          <CardDescription>Manage your connected systems and data flow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{integration.logo}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{integration.name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {integration.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getStatusColor(integration.status)} text-white`}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-1 capitalize">{integration.status}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Last sync: {integration.lastSync}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{integration.records.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">records</p>
                  </div>
                  <Switch checked={integration.enabled} />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sync Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Salesforce sync completed</p>
                  <p className="text-xs text-muted-foreground">247 records updated - 2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">HubSpot contacts imported</p>
                  <p className="text-xs text-muted-foreground">89 new leads added - 5 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pipedrive sync failed</p>
                  <p className="text-xs text-muted-foreground">Authentication error - 2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">System Uptime</span>
                <Badge className="bg-green-500 text-white">99.9%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Accuracy</span>
                <Badge className="bg-green-500 text-white">98.7%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sync Success Rate</span>
                <Badge className="bg-yellow-500 text-white">96.4%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Connections</span>
                <Badge className="bg-blue-500 text-white">4/5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Rate Limits</span>
                <Badge className="bg-green-500 text-white">Normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerCRMIntegrations;
