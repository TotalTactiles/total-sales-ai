
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Loader2,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { crmIntegrationService, CRMIntegration } from '@/services/crm/crmIntegrationService';

const CRMIntegrationsPanel: React.FC = () => {
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingType, setConnectingType] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await crmIntegrationService.getConnectedIntegrations();
      setIntegrations(data);
    } catch (error) {
      toast.error('Failed to load CRM integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (type: CRMIntegration['type']) => {
    setConnectingType(type);
    
    // Simulate credentials input - in real app this would be a modal
    const mockCredentials = {
      apiKey: 'demo-api-key',
      clientId: 'demo-client-id'
    };
    
    const success = await crmIntegrationService.connectIntegration(type, mockCredentials);
    
    if (success) {
      await loadIntegrations();
    }
    
    setConnectingType(null);
  };

  const handleDisconnect = async (integrationId: string) => {
    const success = await crmIntegrationService.disconnectIntegration(integrationId);
    if (success) {
      await loadIntegrations();
    }
  };

  const handleSync = async (integrationId: string) => {
    setSyncingId(integrationId);
    
    const result = await crmIntegrationService.syncIntegration(integrationId);
    
    if (result.success) {
      await loadIntegrations();
    }
    
    setSyncingId(null);
  };

  const getIntegrationIcon = (type: string) => {
    const icons = {
      zoho: '🏢',
      salesforce: '☁️',
      hubspot: '🧲',
      clickup: '📋'
    };
    return icons[type as keyof typeof icons] || '🔗';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading integrations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Integrations */}
      <div className="grid gap-4">
        {integrations.filter(i => i.isConnected).map((integration) => (
          <Card key={integration.id} className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getIntegrationIcon(integration.type)}</span>
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-gray-600">
                      Last sync: {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(integration.id)}
                    disabled={syncingId === integration.id}
                  >
                    {syncingId === integration.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(integration.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Available Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {integrations.filter(i => !i.isConnected).map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getIntegrationIcon(integration.type)}</span>
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-gray-600">
                      Connect your {integration.type} account
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleConnect(integration.type)}
                  disabled={connectingType === integration.type}
                >
                  {connectingType === integration.type ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex-col py-4">
              <Download className="h-6 w-6 mb-2" />
              Import Leads
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4">
              <RefreshCw className="h-6 w-6 mb-2" />
              Sync All
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4">
              <Settings className="h-6 w-6 mb-2" />
              Settings
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4">
              <CheckCircle className="h-6 w-6 mb-2" />
              Test Connections
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMIntegrationsPanel;
