
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw,
  Settings,
  Eye,
  TrendingUp,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status: 'ok' | 'syncing' | 'failed';
  lastSync: Date | null;
  nextSync: Date | null;
  dataPoints: {
    posts: number;
    engagement: number;
    followers: number;
  };
  usedBy: string[];
}

const SocialMediaIntegration: React.FC = () => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    {
      id: 'meta',
      name: 'Meta (Facebook)',
      icon: '📘',
      connected: true,
      status: 'ok',
      lastSync: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      nextSync: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      dataPoints: { posts: 156, engagement: 2340, followers: 12500 },
      usedBy: ['AI Assistant', 'Campaign Tools', 'Lead Tab']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      connected: true,
      status: 'syncing',
      lastSync: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      nextSync: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      dataPoints: { posts: 89, engagement: 1820, followers: 8900 },
      usedBy: ['AI Assistant', 'Lead Tab']
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '🎵',
      connected: false,
      status: 'failed',
      lastSync: null,
      nextSync: null,
      dataPoints: { posts: 0, engagement: 0, followers: 0 },
      usedBy: []
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-green-600 bg-green-100';
      case 'syncing': return 'text-orange-600 bg-orange-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleConnect = (platformId: string) => {
    toast.info(`OAuth connection for ${platformId} - Feature disabled for demo`);
  };

  const handleDisconnect = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, connected: false, status: 'failed' as const, lastSync: null, nextSync: null }
        : p
    ));
    toast.success(`Disconnected from ${platforms.find(p => p.id === platformId)?.name}`);
  };

  const handleManualSync = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, status: 'syncing' as const }
        : p
    ));
    
    // Simulate sync completion
    setTimeout(() => {
      setPlatforms(prev => prev.map(p => 
        p.id === platformId 
          ? { 
            ...p, 
            status: 'ok' as const, 
            lastSync: new Date(),
            nextSync: new Date(Date.now() + 30 * 60 * 1000)
          }
          : p
      ));
      toast.success('Sync completed successfully');
    }, 2000);
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatTimeUntil = (date: Date | null) => {
    if (!date) return 'N/A';
    const minutes = Math.floor((date.getTime() - Date.now()) / (1000 * 60));
    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Social Media Integration</h3>
          <p className="text-sm text-gray-600">
            Sync data every 30 minutes • Data feeds into AI Assistant, Campaigns, and Lead profiles
          </p>
        </div>
        <Badge variant="outline" className="text-green-700 bg-green-50">
          Auto-sync: ON
        </Badge>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <CardTitle className="text-base">{platform.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(platform.status)} border-current`}
                      >
                        {getStatusIcon(platform.status)}
                        <span className="ml-1 capitalize">{platform.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {platform.connected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleManualSync(platform.id)}
                    disabled={platform.status === 'syncing'}
                  >
                    <RefreshCw className={`h-4 w-4 ${platform.status === 'syncing' ? 'animate-spin' : ''}`} />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {platform.connected ? (
                <>
                  {/* Sync Status */}
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sync:</span>
                      <span>{formatTimeAgo(platform.lastSync)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Sync:</span>
                      <span>{formatTimeUntil(platform.nextSync)}</span>
                    </div>
                  </div>

                  {/* Data Points */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-lg font-semibold">{platform.dataPoints.posts}</div>
                      <div className="text-xs text-gray-600">Posts</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-lg font-semibold">{platform.dataPoints.engagement}</div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-lg font-semibold">{platform.dataPoints.followers.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Followers</div>
                    </div>
                  </div>

                  {/* Used By */}
                  <div>
                    <div className="text-xs text-gray-600 mb-2">Data used by:</div>
                    <div className="flex flex-wrap gap-1">
                      {platform.usedBy.map((usage) => (
                        <Badge key={usage} variant="secondary" className="text-xs">
                          {usage}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDisconnect(platform.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-6">
                    <div className="text-gray-400 mb-3">
                      <Users className="h-8 w-8 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect {platform.name} to sync your social media data
                    </p>
                    <Button 
                      onClick={() => handleConnect(platform.id)}
                      className="w-full"
                    >
                      Connect {platform.name}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {platforms.filter(p => p.connected).length}
              </div>
              <div className="text-sm text-gray-600">Connected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {platforms.filter(p => p.status === 'syncing').length}
              </div>
              <div className="text-sm text-gray-600">Syncing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {platforms.reduce((sum, p) => sum + p.dataPoints.posts, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {platforms.reduce((sum, p) => sum + p.dataPoints.followers, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Reach</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaIntegration;
