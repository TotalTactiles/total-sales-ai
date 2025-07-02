import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Database,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

const CRMIntegrationsPanel = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'salesforce',
      name: 'Salesforce',
      logo: '🏢',
      connected: true,
      lastSync: new Date('2024-01-15T10:30:00'),
      status: 'active',
      features: ['Leads', 'Contacts', 'Opportunities', 'Activities']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      logo: '🟠',
      connected: false,
      lastSync: null,
      status: 'disconnected',
      features: ['Contacts', 'Deals', 'Companies', 'Tasks']
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      logo: '🟢',
      connected: true,
      lastSync: new Date('2024-01-15T09:15:00'),
      status: 'active',
      features: ['Leads', 'Deals', 'Organizations', 'Activities']
    },
    {
      id: 'zoho',
      name: 'Zoho CRM',
      logo: '🔵',
      connected: false,
      lastSync: null,
      status: 'disconnected',
      features: ['Leads', 'Contacts', 'Deals', 'Accounts']
    }
  ]);

  const handleConnect = async (crmId: string) => {
    try {
      // Simulate OAuth flow
      toast.info(`Redirecting to ${crmId} OAuth...`);
      
      setTimeout(() => {
        setIntegrations(prev => 
          prev.map(crm => 
            crm.id === crmId 
              ? { ...crm, connected: true, status: 'active', lastSync: new Date() }
              : crm
          )
        );
        toast.success(`${crmId} connected successfully!`);
      }, 2000);
    } catch (error) {
      toast.error(`Failed to connect ${crmId}`);
    }
  };

  const handleDisconnect = async (crmId: string) => {
    try {
      setIntegrations(prev => 
        prev.map(crm => 
          crm.id === crmId 
            ? { ...crm, connected: false, status: 'disconnected', lastSync: null }
            : crm
        )
      );
      toast.success(`${crmId} disconnected`);
    } catch (error) {
      toast.error(`Failed to disconnect ${crmId}`);
    }
  };

  const handleSync = async (crmId: string) => {
    try {
      toast.info(`Syncing ${crmId} data...`);
      
      setTimeout(() => {
        setIntegrations(prev => 
          prev.map(crm => 
            crm.id === crmId 
              ? { ...crm, lastSync: new Date() }
              : crm
          )
        );
        toast.success(`${crmId} sync completed`);
      }, 3000);
    } catch (error) {
      toast.error(`Failed to sync ${crmId}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Disconnected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Integrations</h1>
          <p className="text-gray-600 mt-1">Connect and manage your CRM systems</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected CRMs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.filter(i => i.connected).length}
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-2xl font-bold text-gray-900">2h ago</p>
              </div>
              <RefreshCw className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Records Synced</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="border-2 hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(integration.status)}
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={integration.connected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleConnect(integration.id);
                    } else {
                      handleDisconnect(integration.id);
                    }
                  }}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Features */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Synced Data:</h4>
                <div className="flex flex-wrap gap-1">
                  {integration.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Sync */}
              {integration.lastSync && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Last sync:</span>{' '}
                  {integration.lastSync.toLocaleDateString()} at{' '}
                  {integration.lastSync.toLocaleTimeString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {integration.connected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(integration.id)}
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleConnect(integration.id)}
                    className="flex-1"
                  >
                    Connect {integration.name}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Salesforce Sync Completed</p>
                  <p className="text-sm text-green-700">125 leads, 89 contacts updated</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">2 hours ago</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Pipedrive Sync In Progress</p>
                  <p className="text-sm text-blue-700">Syncing deals and activities...</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMIntegrationsPanel;
