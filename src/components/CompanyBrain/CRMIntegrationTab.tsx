
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Database, CheckCircle, AlertCircle, Settings, Zap } from 'lucide-react';
import { toast } from 'sonner';

const CRMIntegrationTab: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Sync leads, contacts, and opportunities',
      status: 'connected',
      enabled: true,
      lastSync: '2024-01-15 10:30',
      recordsCount: 2450
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Import contacts and deal pipeline',
      status: 'disconnected',
      enabled: false,
      lastSync: null,
      recordsCount: 0
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      description: 'Manage deals and sales activities',
      status: 'error',
      enabled: true,
      lastSync: '2024-01-14 15:20',
      recordsCount: 1200
    }
  ]);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
    toast.success('Integration settings updated');
  };

  const handleConnect = (name: string) => {
    toast.info(`Connecting to ${name}...`);
    // Simulate connection logic
  };

  const handleSync = (name: string) => {
    toast.info(`Syncing ${name} data...`);
    // Simulate sync logic
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Database className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Error</Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">CRM Integrations</h3>
          <p className="text-sm text-gray-600">Connect and sync your CRM platforms</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Integration Cards */}
      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(integration.status)}
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(integration.status)}
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => handleToggleIntegration(integration.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">{integration.recordsCount.toLocaleString()}</span> records
                  </div>
                  {integration.lastSync && (
                    <div>
                      Last sync: <span className="font-medium">{integration.lastSync}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {integration.status === 'connected' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSync(integration.name)}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Sync Now
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleConnect(integration.name)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sync Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">3,650</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">Active Connections</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">24h</div>
              <div className="text-sm text-gray-600">Last Full Sync</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMIntegrationTab;
