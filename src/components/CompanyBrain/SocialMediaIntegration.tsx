
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Facebook, 
  Linkedin, 
  Twitter,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  connected: boolean;
  lastSynced?: Date;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  syncInterval: number; // minutes
}

const SocialMediaIntegration: React.FC = () => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    {
      id: 'meta',
      name: 'Meta (Facebook/Instagram)',
      icon: Facebook,
      connected: true,
      lastSynced: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      status: 'connected',
      syncInterval: 30
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      connected: true,
      lastSynced: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      status: 'syncing',
      syncInterval: 30
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Twitter, // Using Twitter icon as placeholder for TikTok
      connected: false,
      status: 'disconnected',
      syncInterval: 30
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'bg-green-100 text-green-800',
      syncing: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800',
      disconnected: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status === 'connected' ? 'Connected' : 
         status === 'syncing' ? 'Syncing...' :
         status === 'error' ? 'Error' : 'Not Connected'}
      </Badge>
    );
  };

  const handleConnect = (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { ...platform, connected: true, status: 'syncing' as const }
        : platform
    ));

    // Simulate OAuth flow
    setTimeout(() => {
      setPlatforms(prev => prev.map(platform => 
        platform.id === platformId 
          ? { 
              ...platform, 
              status: 'connected' as const, 
              lastSynced: new Date() 
            }
          : platform
      ));
    }, 2000);
  };

  const handleSync = (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { ...platform, status: 'syncing' as const }
        : platform
    ));

    setTimeout(() => {
      setPlatforms(prev => prev.map(platform => 
        platform.id === platformId 
          ? { 
              ...platform, 
              status: 'connected' as const, 
              lastSynced: new Date() 
            }
          : platform
      ));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Social Media Integration</h2>
        <p className="text-muted-foreground">
          Connect your social media accounts to sync data for AI Assistant, Campaign tools, and Lead analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <Card key={platform.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <platform.icon className="h-5 w-5" />
                  {platform.name}
                </CardTitle>
                {getStatusIcon(platform.status)}
              </div>
              {getStatusBadge(platform.status)}
            </CardHeader>
            <CardContent className="space-y-4">
              {platform.connected && platform.lastSynced && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Last synced: </span>
                  <span className="font-medium">
                    {platform.lastSynced.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              )}
              
              <div className="text-sm">
                <span className="text-muted-foreground">Sync interval: </span>
                <span className="font-medium">Every {platform.syncInterval} minutes</span>
              </div>

              <div className="space-y-2">
                {!platform.connected ? (
                  <Button 
                    className="w-full" 
                    onClick={() => handleConnect(platform.id)}
                  >
                    Connect {platform.name}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSync(platform.id)}
                      disabled={platform.status === 'syncing'}
                    >
                      {platform.status === 'syncing' ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Syncing
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync Now
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      Settings
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>AI Assistant:</strong> Uses social media insights for context-aware responses</p>
            <p>• <strong>Campaign Tools:</strong> Leverages audience data for better targeting</p>
            <p>• <strong>Lead Tab:</strong> Enriches lead profiles with social media activity</p>
            <p>• <strong>Sync Schedule:</strong> Data refreshes automatically every 30 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaIntegration;
