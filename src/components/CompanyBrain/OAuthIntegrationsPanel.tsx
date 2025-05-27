
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  RefreshCw,
  Unplug
} from 'lucide-react';
import { useUnifiedOAuth } from '@/hooks/useUnifiedOAuth';

const OAuthIntegrationsPanel = () => {
  const { 
    providers, 
    isLoading, 
    connectProvider, 
    disconnectProvider, 
    syncProvider,
    getConnectionStatus,
    refreshProviders 
  } = useUnifiedOAuth();

  const handleConnect = async (providerId: string) => {
    await connectProvider(providerId);
  };

  const handleDisconnect = async (providerId: string) => {
    await disconnectProvider(providerId);
  };

  const handleSync = async (providerId: string) => {
    await syncProvider(providerId);
  };

  const connectedCount = providers.filter(p => p.connected).length;
  const totalCount = providers.length;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              OAuth Integrations
            </div>
            <Badge variant="outline">
              {connectedCount}/{totalCount} Connected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your accounts to enable AI-powered data ingestion for the Company Brain.
          </p>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshProviders}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers
            .filter(provider => ['gmail', 'outlook'].includes(provider.id))
            .map((provider) => {
              const status = getConnectionStatus(provider.id);
              return (
                <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                      {status.connected && status.account && (
                        <p className="text-sm text-muted-foreground">{status.account}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {status.connected ? (
                      <>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSync(provider.id)}
                          disabled={isLoading}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisconnect(provider.id)}
                          disabled={isLoading}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Unplug className="h-3 w-3 mr-1" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge variant="outline" className="text-gray-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Not Connected
                        </Badge>
                        <Button 
                          onClick={() => handleConnect(provider.id)}
                          disabled={isLoading}
                          size="sm"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Connect
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Social Media Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Media Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers
            .filter(provider => ['linkedin', 'facebook', 'twitter', 'instagram'].includes(provider.id))
            .map((provider) => {
              const status = getConnectionStatus(provider.id);
              return (
                <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                      {status.connected && status.account && (
                        <p className="text-sm text-muted-foreground">{status.account}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {status.connected ? (
                      <>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSync(provider.id)}
                          disabled={isLoading}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisconnect(provider.id)}
                          disabled={isLoading}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Unplug className="h-3 w-3 mr-1" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge variant="outline" className="text-gray-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Not Connected
                        </Badge>
                        <Button 
                          onClick={() => handleConnect(provider.id)}
                          disabled={isLoading}
                          size="sm"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Connect
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Integration Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">📧 Email Intelligence</h4>
              <p className="text-sm text-blue-700">
                Analyze email patterns, extract leads, and automate follow-ups
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">📱 Social Insights</h4>
              <p className="text-sm text-purple-700">
                Monitor brand mentions, engagement metrics, and audience behavior
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">💼 Professional Networks</h4>
              <p className="text-sm text-green-700">
                Track company updates, employee changes, and industry trends
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">🤖 AI-Powered Analysis</h4>
              <p className="text-sm text-orange-700">
                Automatic data processing and actionable insights generation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthIntegrationsPanel;
