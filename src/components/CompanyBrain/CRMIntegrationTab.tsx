
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Database, CheckCircle, AlertCircle, Settings, Zap, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import CRMConnectionModal from './CRMConnectionModal';

const CRMIntegrationTab: React.FC = () => {
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [integrations, setIntegrations] = useState([
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Sync leads, contacts, and opportunities',
      status: 'connected',
      enabled: true,
      lastSync: '2024-01-15 10:30',
      recordsCount: 2450,
      logo: '🔵'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Import contacts and deal pipeline',
      status: 'disconnected',
      enabled: false,
      lastSync: null,
      recordsCount: 0,
      logo: '🟠'
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      description: 'Manage deals and sales activities',
      status: 'error',
      enabled: true,
      lastSync: '2024-01-14 15:20',
      recordsCount: 1200,
      logo: '🟡'
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

  const handleConnect = (crmId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === crmId 
          ? { 
              ...integration, 
              status: 'connected', 
              enabled: true,
              lastSync: new Date().toISOString(),
              recordsCount: Math.floor(Math.random() * 1000) + 500
            }
          : integration
      )
    );
  };

  const handleRequestIntegration = (request: any) => {
    console.log('Integration request submitted:', request);
    // Here you would send this to your Developer OS ticket system
  };

  const handleSync = (name: string) => {
    toast.info(`Syncing ${name} data...`);
    
    // Simulate sync process
    setTimeout(() => {
      toast.success(`${name} sync completed successfully!`);
      
      // Update last sync time
      setIntegrations(prev => 
        prev.map(integration => 
          integration.name === name 
            ? { ...integration, lastSync: new Date().toISOString() }
            : integration
        )
      );
    }, 3000);
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

  const getSyncIndicator = (integration: any) => {
    if (integration.status !== 'connected') return null;
    
    const lastSyncDate = integration.lastSync ? new Date(integration.lastSync) : null;
    const now = new Date();
    const timeDiff = lastSyncDate ? now.getTime() - lastSyncDate.getTime() : 0;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    if (minutesDiff < 60) {
      return (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Synced {minutesDiff}m ago
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-xs text-orange-600">
        <Clock className="h-3 w-3" />
        Last synced {Math.floor(minutesDiff / 60)}h ago
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">CRM Integrations</h3>
          <p className="text-sm text-gray-600">Connect and sync your CRM platforms to enhance AI insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={() => setIsConnectionModalOpen(true)}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {getStatusIcon(integration.status)}
                      {getStatusBadge(integration.status)}
                      {getSyncIndicator(integration)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => handleToggleIntegration(integration.id)}
                    disabled={integration.status === 'disconnected'}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">{integration.recordsCount.toLocaleString()}</span> records synced
                  </div>
                  {integration.lastSync && (
                    <div>
                      Last sync: <span className="font-medium">{new Date(integration.lastSync).toLocaleString()}</span>
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
                      onClick={() => setIsConnectionModalOpen(true)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              {/* Data Usage Information */}
              {integration.status === 'connected' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">Data Usage</h5>
                  <div className="text-xs text-blue-800 space-y-1">
                    <div>✓ Enhanced lead intelligence in Sales OS</div>
                    <div>✓ AI-powered CRM analysis and recommendations</div>
                    <div>✓ Automated sync every 30-60 minutes</div>
                    <div>✓ Data routed to Company Brain for insights</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Integration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {integrations.reduce((sum, i) => sum + i.recordsCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {integrations.filter(i => i.status === 'connected').length}
              </div>
              <div className="text-sm text-gray-600">Active Connections</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">30m</div>
              <div className="text-sm text-gray-600">Avg Sync Interval</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">99.8%</div>
              <div className="text-sm text-gray-600">Sync Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-900">For Your Team:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Real-time lead intelligence and scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>AI-powered insights from historical data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Automated workflow triggers and actions</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-900">For Management:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Comprehensive sales analytics and reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Team performance insights and coaching opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Predictive forecasting and trend analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CRM Connection Modal */}
      <CRMConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        onConnect={handleConnect}
        onRequestIntegration={handleRequestIntegration}
      />
    </div>
  );
};

export default CRMIntegrationTab;
