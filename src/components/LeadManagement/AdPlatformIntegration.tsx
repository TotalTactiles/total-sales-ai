
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Facebook, 
  Search, 
  Linkedin, 
  Settings, 
  Activity, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Zap,
  Brain,
  Shield
} from 'lucide-react';

interface AdPlatform {
  id: string;
  name: string;
  icon: React.ElementType;
  connected: boolean;
  status: 'active' | 'syncing' | 'error' | 'disconnected';
  lastSync?: string;
  leadCount: number;
  campaigns: number;
  authUrl?: string;
}

const AdPlatformIntegration = () => {
  const [platforms, setPlatforms] = useState<AdPlatform[]>([
    {
      id: 'meta',
      name: 'Meta Ads',
      icon: Facebook,
      connected: false,
      status: 'disconnected',
      leadCount: 0,
      campaigns: 0,
      authUrl: '/auth/oauth/meta'
    },
    {
      id: 'google',
      name: 'Google Ads/Analytics',
      icon: Search,
      connected: false,
      status: 'disconnected',
      leadCount: 0,
      campaigns: 0,
      authUrl: '/auth/oauth/google'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Ads',
      icon: Linkedin,
      connected: false,
      status: 'disconnected',
      leadCount: 0,
      campaigns: 0,
      authUrl: '/auth/oauth/linkedin'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'syncing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleConnect = (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { 
            ...platform, 
            connected: true, 
            status: 'syncing' as const,
            lastSync: new Date().toISOString()
          }
        : platform
    ));

    // Simulate OAuth connection process
    setTimeout(() => {
      setPlatforms(prev => prev.map(platform => 
        platform.id === platformId 
          ? { 
              ...platform, 
              status: 'active' as const,
              leadCount: Math.floor(Math.random() * 50) + 10,
              campaigns: Math.floor(Math.random() * 8) + 2
            }
          : platform
      ));
    }, 2000);
  };

  const handleDisconnect = (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { 
            ...platform, 
            connected: false, 
            status: 'disconnected' as const,
            leadCount: 0,
            campaigns: 0
          }
        : platform
    ));
  };

  const handleSync = (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { 
            ...platform, 
            status: 'syncing' as const,
            lastSync: new Date().toISOString()
          }
        : platform
    ));

    setTimeout(() => {
      setPlatforms(prev => prev.map(platform => 
        platform.id === platformId 
          ? { 
              ...platform, 
              status: 'active' as const,
              leadCount: Math.floor(Math.random() * 50) + 10
            }
          : platform
      ));
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ad Platform Integrations</h2>
          <p className="text-gray-600">Connect your advertising platforms to sync leads automatically</p>
        </div>
      </div>

      {/* AI Routing Information */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-900">
            <Brain className="h-5 w-5" />
            <span>AI Intelligence Routing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-purple-800 mb-4">
            All connected lead sources automatically route through our AI intelligence system:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <div className="font-medium text-blue-900">Lead Intelligence Command</div>
              </div>
              <div className="text-sm text-blue-700">AI-powered lead scoring, routing, and qualification</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <div className="font-medium text-purple-900">Company Brain</div>
              </div>
              <div className="text-sm text-purple-700">Knowledge base integration and insights</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <div className="font-medium text-green-900">TSAM Master Brain</div>
              </div>
              <div className="text-sm text-green-700">Internal analytics and optimization (Internal Only)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meta">Meta Ads</TabsTrigger>
          <TabsTrigger value="google">Google Ads</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn Ads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Card key={platform.id} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <IconComponent className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{platform.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(platform.status)}
                            <Badge className={getStatusColor(platform.status)}>
                              {platform.status === 'disconnected' ? 'Not Connected' : 
                               platform.status === 'syncing' ? 'Syncing...' :
                               platform.status === 'active' ? 'Connected' : 'Error'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platform.connected && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Leads</span>
                            <div className="font-semibold text-lg">{platform.leadCount}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Campaigns</span>
                            <div className="font-semibold text-lg">{platform.campaigns}</div>
                          </div>
                        </div>
                      )}
                      
                      {platform.lastSync && (
                        <div className="text-xs text-gray-500">
                          Last sync: {new Date(platform.lastSync).toLocaleString()}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {!platform.connected ? (
                          <Button 
                            onClick={() => handleConnect(platform.id)}
                            className="flex-1"
                            disabled={platform.status === 'syncing'}
                          >
                            {platform.status === 'syncing' ? 'Connecting...' : 'Connect via OAuth'}
                          </Button>
                        ) : (
                          <>
                            <Button 
                              onClick={() => handleSync(platform.id)}
                              variant="outline"
                              size="sm"
                              disabled={platform.status === 'syncing'}
                            >
                              <RefreshCw className={`h-4 w-4 mr-1 ${platform.status === 'syncing' ? 'animate-spin' : ''}`} />
                              Sync
                            </Button>
                            <Button 
                              onClick={() => handleDisconnect(platform.id)}
                              variant="destructive"
                              size="sm"
                            >
                              Disconnect
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Developer OS Audit Trail Information */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Integration Activity & Audit Trails</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  All platform connections and data transfers are automatically logged to Developer OS for audit trails and monitoring.
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium text-gray-900 mb-2">Recent Activity</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Meta Ads - Lead sync attempt</span>
                      <span className="text-green-600 font-medium">Success</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Google Ads - Connection established</span>
                      <span className="text-green-600 font-medium">Success</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">LinkedIn Ads - Auth renewal</span>
                      <span className="text-blue-600 font-medium">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {platforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <TabsContent key={platform.id} value={platform.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <IconComponent className="h-8 w-8 text-gray-700" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{platform.name} Integration</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(platform.status)}
                          <Badge className={getStatusColor(platform.status)}>
                            {platform.status === 'disconnected' ? 'Not Connected' : 
                             platform.status === 'syncing' ? 'Syncing...' :
                             platform.status === 'active' ? 'Connected via OAuth' : 'Error'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {platform.connected && (
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Settings
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Docs
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {platform.connected ? (
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{platform.leadCount}</div>
                          <div className="text-sm text-gray-600">Total Leads</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{platform.campaigns}</div>
                          <div className="text-sm text-gray-600">Active Campaigns</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">98%</div>
                          <div className="text-sm text-gray-600">Sync Success Rate</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">12min</div>
                          <div className="text-sm text-gray-600">Avg Sync Time</div>
                        </div>
                      </div>

                      {/* AI Routing Status */}
                      <div className="border rounded-lg p-4 bg-purple-50/30 border-purple-200">
                        <h4 className="font-medium mb-3 text-purple-900">AI Intelligence Routing Status</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Lead Intelligence Command: Active</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Company Brain: Synced</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">TSAM Master Brain: Connected</span>
                          </div>
                        </div>
                      </div>

                      {/* Sync Settings */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">Sync Settings</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Auto Sync</div>
                              <div className="text-sm text-gray-600">Automatically sync leads every 30 minutes</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">AI Lead Scoring</div>
                              <div className="text-sm text-gray-600">Apply AI scoring to incoming leads</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Duplicate Detection</div>
                              <div className="text-sm text-gray-600">Prevent duplicate lead entries</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Developer OS Logging</div>
                              <div className="text-sm text-gray-600">Log all activities to Developer OS audit trail</div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <IconComponent className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Connect {platform.name}</h3>
                      <p className="text-gray-600 mb-4">
                        Connect your {platform.name} account via OAuth to start syncing leads automatically through our AI intelligence system
                      </p>
                      <Button onClick={() => handleConnect(platform.id)} className="mb-4">
                        Connect via OAuth
                      </Button>
                      <div className="text-sm text-gray-500">
                        Secure OAuth authentication • Auto-sync every 30 minutes • AI-powered lead routing
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default AdPlatformIntegration;
