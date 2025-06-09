
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const IntegrationsTab = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'instagram',
      name: 'Instagram Business',
      icon: Instagram,
      connected: false,
      lastSync: null,
      status: 'disconnected',
      description: 'Connect your Instagram Business profile to ingest posts, stories, and engagement data.'
    },
    {
      id: 'facebook',
      name: 'Facebook Page',
      icon: Facebook,
      connected: false,
      lastSync: null,
      status: 'disconnected',
      description: 'Sync Facebook page content, posts, and audience insights.'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Company',
      icon: Linkedin,
      connected: false,
      lastSync: null,
      status: 'disconnected',
      description: 'Import LinkedIn company page posts and professional network data.'
    }
  ]);

  const handleConnect = async (integrationId: string) => {
    try {
      // Simulate OAuth connection
      toast.info('Redirecting to OAuth authorization...');
      
      // In a real implementation, this would redirect to OAuth
      setTimeout(() => {
        setIntegrations(prev => prev.map(integration => 
          integration.id === integrationId 
            ? { 
                ...integration, 
                connected: true, 
                status: 'connected', 
                lastSync: new Date().toISOString() 
              }
            : integration
        ));
        toast.success(`${integrations.find(i => i.id === integrationId)?.name} connected successfully!`);
      }, 2000);
    } catch (error) {
      toast.error('Failed to connect integration');
    }
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, connected: false, status: 'disconnected', lastSync: null }
        : integration
    ));
    toast.success('Integration disconnected');
  };

  const handleSync = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration?.connected) return;

    toast.info(`Syncing ${integration.name} data...`);
    
    // Simulate sync process
    setTimeout(() => {
      setIntegrations(prev => prev.map(int => 
        int.id === integrationId 
          ? { ...int, lastSync: new Date().toISOString() }
          : int
      ));
      toast.success(`${integration.name} data synced successfully!`);
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Disconnected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Integrations</h2>
          <p className="text-muted-foreground">Connect your social media accounts to enhance AI insights and content analysis.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const IconComponent = integration.icon;
          
          return (
            <Card key={integration.id} className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(integration.status)}
                        {getStatusBadge(integration.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                
                {integration.connected && integration.lastSync && (
                  <div className="text-xs text-muted-foreground">
                    Last synced: {new Date(integration.lastSync).toLocaleString()}
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  {integration.connected ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSync(integration.id)}
                        className="w-full"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDisconnect(integration.id)}
                        className="w-full"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => handleConnect(integration.id)}
                      className="w-full"
                    >
                      Connect {integration.name}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Integration Benefits */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>What happens when you connect?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Data Ingested:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Posts, captions, and hashtags</li>
                <li>• Comments and replies</li>
                <li>• Engagement metrics (likes, shares, views)</li>
                <li>• Audience demographics</li>
                <li>• Publishing schedules and performance</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">AI Enhancements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Content-aware lead responses</li>
                <li>• Brand voice consistency</li>
                <li>• Market trend analysis</li>
                <li>• Competitor insight generation</li>
                <li>• Engagement optimization suggestions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTab;
