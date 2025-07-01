
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Users,
  TrendingUp,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useCompanyBrain } from '@/hooks/useCompanyBrain';

const SocialMediaIntegrations = () => {
  const { connectSocialMedia, syncSocialMedia, socialConnections } = useCompanyBrain();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const platformConfigs = [
    {
      id: 'instagram',
      name: 'Instagram Business',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 border-pink-200',
      description: 'Connect Instagram Business profile for posts, stories, and engagement analytics',
      features: ['Posts & Stories', 'Engagement Metrics', 'Audience Insights', 'Hashtag Performance']
    },
    {
      id: 'facebook',
      name: 'Facebook Pages',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      description: 'Sync Facebook page content, audience data, and advertising insights',
      features: ['Page Posts', 'Audience Demographics', 'Ad Performance', 'Page Insights']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Company',
      icon: Linkedin,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 border-blue-200',
      description: 'Import LinkedIn company page posts and professional network analytics',
      features: ['Company Updates', 'Follower Analytics', 'Engagement Data', 'Industry Insights']
    },
    {
      id: 'tiktok',
      name: 'TikTok Business',
      icon: Globe,
      color: 'text-black',
      bgColor: 'bg-gray-50 border-gray-200',
      description: 'Connect TikTok Business account for video content and trend analysis',
      features: ['Video Content', 'Trend Analysis', 'Audience Metrics', 'Viral Content Insights']
    }
  ];

  const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId);
    try {
      // Simulate OAuth flow for demo
      toast.info(`Redirecting to ${platformConfigs.find(p => p.id === platformId)?.name} OAuth...`);
      
      setTimeout(async () => {
        const success = await connectSocialMedia(platformId);
        if (success) {
          toast.success(`${platformConfigs.find(p => p.id === platformId)?.name} connected successfully!`);
        } else {
          toast.info('OAuth integration coming soon - stay tuned!');
        }
        setIsConnecting(null);
      }, 2000);
    } catch (error) {
      toast.error('Failed to connect platform');
      setIsConnecting(null);
    }
  };

  const handleSync = async (platformId: string) => {
    try {
      await syncSocialMedia(platformId);
    } catch (error) {
      toast.error(`Failed to sync ${platformId} data`);
    }
  };

  const getConnectionStatus = (platformId: string) => {
    const connection = socialConnections.find(conn => conn.platform === platformId);
    return connection?.connected ? 'connected' : 'disconnected';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Not Connected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Social Media Integrations</h2>
          <p className="text-gray-600 mt-1">Connect your social media accounts to enhance AI insights and content analysis</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platformConfigs.map((platform) => {
          const IconComponent = platform.icon;
          const status = getConnectionStatus(platform.id);
          const isConnected = status === 'connected';
          
          return (
            <Card key={platform.id} className={`${platform.bgColor} hover:shadow-lg transition-all duration-200`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <IconComponent className={`h-6 w-6 ${platform.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{platform.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(status)}
                        {getStatusBadge(status)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{platform.description}</p>
                
                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-800">Data Collected:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {platform.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  {isConnected ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSync(platform.id)}
                        className="w-full border-gray-300 hover:bg-gray-50"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Data
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => handleConnect(platform.id)}
                      disabled={isConnecting === platform.id}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      {isConnecting === platform.id ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        `Connect ${platform.name}`
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TrendingUp className="h-5 w-5" />
            AI Enhancement Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 mb-2">Audience Intelligence</h4>
              <p className="text-sm text-blue-700">AI analyzes audience behavior patterns to improve lead targeting and messaging</p>
            </div>
            <div className="text-center">
              <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900 mb-2">Content Insights</h4>
              <p className="text-sm text-purple-700">Identify high-performing content themes to guide sales conversations</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900 mb-2">Trend Analysis</h4>
              <p className="text-sm text-green-700">Stay ahead of industry trends and adapt sales strategies accordingly</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaIntegrations;
