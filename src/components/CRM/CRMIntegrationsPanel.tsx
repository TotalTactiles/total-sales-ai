
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Database,
  Zap,
  Users,
  Calendar
} from 'lucide-react';
import { crmIntegrationService, CRMIntegration, CRMSyncResult } from '@/services/crm/crmIntegrationService';
import { mockCRMIntegrations } from '@/data/enhancedMockData';
import { toast } from 'sonner';

const CRMIntegrationsPanel = () => {
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncResults, setSyncResults] = useState<Record<string, CRMSyncResult>>({});
  const [newIntegrationForm, setNewIntegrationForm] = useState({
    type: '',
    credentials: {}
  });

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, use mock data
      const data = mockCRMIntegrations.map(integration => ({
        ...integration,
        lastSync: integration.lastSync || undefined
      }));
      setIntegrations(data);
    } catch (error) {
      console.error('Failed to load integrations:', error);
      toast.error('Failed to load CRM integrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (integrationId: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, simulate sync
      const result: CRMSyncResult = {
        success: true,
        leadsImported: Math.floor(Math.random() * 20) + 5,
        tasksImported: Math.floor(Math.random() * 15) + 3,
        errors: []
      };
      
      setSyncResults(prev => ({ ...prev, [integrationId]: result }));
      toast.success(`Synced ${result.leadsImported} leads and ${result.tasksImported} tasks`);
      
      // Update last sync time
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, lastSync: new Date().toISOString() }
            : integration
        )
      );
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (type: string, credentials: any) => {
    setIsLoading(true);
    try {
      // For demo purposes, simulate connection
      const newIntegration: CRMIntegration = {
        id: `crm-${Date.now()}`,
        name: type === 'zoho' ? 'Zoho CRM' : type === 'clickup' ? 'ClickUp' : type,
        type: type as any,
        isConnected: true,
        lastSync: new Date().toISOString()
      };
      
      setIntegrations(prev => [...prev, newIntegration]);
      toast.success(`${newIntegration.name} connected successfully`);
      setNewIntegrationForm({ type: '', credentials: {} });
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error('Failed to connect integration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { ...integration, isConnected: false }
            : integration
        )
      );
      toast.success('Integration disconnected');
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast.error('Failed to disconnect integration');
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'zoho': return <Database className="h-6 w-6" />;
      case 'clickup': return <Calendar className="h-6 w-6" />;
      case 'salesforce': return <Users className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const getStatusColor = (isConnected: boolean) => {
    return isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const switchToAddNewTab = () => {
    const addNewTab = document.querySelector('[data-value="add-new"]') as HTMLElement;
    if (addNewTab) {
      addNewTab.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">CRM Integrations</h2>
        <Button 
          onClick={loadIntegrations} 
          disabled={isLoading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="connected" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="add-new" data-value="add-new">Add New</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {integrations.filter(i => i.isConnected).map(integration => (
            <Card key={integration.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-3">
                  {getIntegrationIcon(integration.type)}
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Last sync: {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(integration.isConnected)}>
                    {integration.isConnected ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        Disconnected
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Leads Imported</p>
                      <p className="font-medium">{syncResults[integration.id]?.leadsImported || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tasks Imported</p>
                      <p className="font-medium">{syncResults[integration.id]?.tasksImported || 0}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleSync(integration.id)}
                      disabled={isLoading}
                      size="sm"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>
                    <Button
                      onClick={() => handleDisconnect(integration.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {integrations.filter(i => i.isConnected).length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Connected Integrations</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your CRM systems to sync leads and automate workflows.
                  </p>
                  <Button onClick={switchToAddNewTab}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {['salesforce', 'hubspot', 'pipedrive'].map(type => (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIntegrationIcon(type)}
                  <div>
                    <CardTitle className="text-lg capitalize">{type}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Popular CRM integration available
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="add-new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="integration-type">Integration Type</Label>
                <select
                  id="integration-type"
                  className="w-full p-2 border border-input rounded-md"
                  value={newIntegrationForm.type}
                  onChange={(e) => setNewIntegrationForm(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="">Select integration type</option>
                  <option value="zoho">Zoho CRM</option>
                  <option value="clickup">ClickUp</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="hubspot">HubSpot</option>
                </select>
              </div>

              {newIntegrationForm.type === 'zoho' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoho-client-id">Client ID</Label>
                    <Input
                      id="zoho-client-id"
                      placeholder="Enter Zoho client ID"
                      onChange={(e) => setNewIntegrationForm(prev => ({
                        ...prev,
                        credentials: { ...prev.credentials, clientId: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zoho-client-secret">Client Secret</Label>
                    <Input
                      id="zoho-client-secret"
                      type="password"
                      placeholder="Enter Zoho client secret"
                      onChange={(e) => setNewIntegrationForm(prev => ({
                        ...prev,
                        credentials: { ...prev.credentials, clientSecret: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}

              {newIntegrationForm.type === 'clickup' && (
                <div className="space-y-2">
                  <Label htmlFor="clickup-api-key">API Key</Label>
                  <Input
                    id="clickup-api-key"
                    type="password"
                    placeholder="Enter ClickUp API key"
                    onChange={(e) => setNewIntegrationForm(prev => ({
                      ...prev,
                      credentials: { apiKey: e.target.value }
                    }))}
                  />
                </div>
              )}

              <Button
                onClick={() => handleConnect(newIntegrationForm.type, newIntegrationForm.credentials)}
                disabled={!newIntegrationForm.type || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Connect Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMIntegrationsPanel;
