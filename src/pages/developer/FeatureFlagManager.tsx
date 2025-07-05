
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Flag, 
  Plus, 
  Search, 
  Users, 
  Code, 
  Zap,
  RefreshCw,
  Edit,
  Trash2,
  Target
} from 'lucide-react';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  environment: 'development' | 'staging' | 'production';
  audience: 'all' | 'developers' | 'managers' | 'sales_reps';
  rolloutPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

const FeatureFlagManager: React.FC = () => {
  const { execute, isLoading } = useAsyncOperation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnvironment, setFilterEnvironment] = useState<string>('all');
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: '1',
      name: 'enhanced_ai_responses',
      description: 'Enable enhanced AI response generation with GPT-4',
      enabled: true,
      environment: 'production',
      audience: 'all',
      rolloutPercentage: 75,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      usageCount: 1247
    },
    {
      id: '2',
      name: 'voice_ai_integration',
      description: 'Enable voice AI integration with ElevenLabs',
      enabled: false,
      environment: 'staging',
      audience: 'developers',
      rolloutPercentage: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      usageCount: 89
    },
    {
      id: '3',
      name: 'advanced_lead_scoring',
      description: 'Advanced ML-based lead scoring algorithm',
      enabled: true,
      environment: 'production',
      audience: 'managers',
      rolloutPercentage: 100,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      usageCount: 2156
    },
    {
      id: '4',
      name: 'realtime_notifications',
      description: 'Real-time push notifications for sales events',
      enabled: true,
      environment: 'development',
      audience: 'sales_reps',
      rolloutPercentage: 50,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
      usageCount: 345
    },
    {
      id: '5',
      name: 'beta_dashboard',
      description: 'New beta dashboard with enhanced analytics',
      enabled: false,
      environment: 'staging',
      audience: 'all',
      rolloutPercentage: 25,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      updatedAt: new Date(Date.now() - 1000 * 60 * 45),
      usageCount: 67
    }
  ]);

  const filteredFlags = featureFlags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEnvironment = filterEnvironment === 'all' || flag.environment === filterEnvironment;
    return matchesSearch && matchesEnvironment;
  });

  const toggleFlag = async (flagId: string) => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFeatureFlags(prev => prev.map(flag =>
        flag.id === flagId
          ? { ...flag, enabled: !flag.enabled, updatedAt: new Date() }
          : flag
      ));
    }, 'sync');
  };

  const refreshFlags = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFeatureFlags(prev => prev.map(flag => ({
        ...flag,
        usageCount: flag.usageCount + Math.floor(Math.random() * 50),
        updatedAt: new Date()
      })));
    }, 'sync');
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'production': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'staging': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'development': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all': return <Users className="h-4 w-4 text-blue-400" />;
      case 'developers': return <Code className="h-4 w-4 text-purple-400" />;
      case 'managers': return <Target className="h-4 w-4 text-green-400" />;
      case 'sales_reps': return <Zap className="h-4 w-4 text-orange-400" />;
      default: return <Users className="h-4 w-4 text-gray-400" />;
    }
  };

  const stats = {
    total: featureFlags.length,
    enabled: featureFlags.filter(flag => flag.enabled).length,
    production: featureFlags.filter(flag => flag.environment === 'production').length,
    totalUsage: featureFlags.reduce((sum, flag) => sum + flag.usageCount, 0)
  };

  if (isLoading) {
    return <LoadingManager type="sync" message="Managing feature flags..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Feature Flag Manager</h1>
          <p className="text-gray-400 mt-2">Control feature rollouts and system configurations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={refreshFlags}
            disabled={isLoading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Flag
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Flags</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Flag className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Enabled</p>
                <p className="text-2xl font-bold text-green-400">{stats.enabled}</p>
              </div>
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Production</p>
                <p className="text-2xl font-bold text-green-400">{stats.production}</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Usage</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsage.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search feature flags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <select
              value={filterEnvironment}
              onChange={(e) => setFilterEnvironment(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Environments</option>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags List */}
      <div className="space-y-4">
        {filteredFlags.map((flag) => (
          <Card key={flag.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Flag className="h-6 w-6 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{flag.name}</h3>
                    <p className="text-gray-400 text-sm">{flag.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={() => toggleFlag(flag.id)}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <Badge className={flag.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                    {flag.enabled ? 'ENABLED' : 'DISABLED'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Badge className={getEnvironmentColor(flag.environment)}>
                    {flag.environment.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {getAudienceIcon(flag.audience)}
                  <span className="text-gray-400 text-sm capitalize">{flag.audience.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-400 text-sm">{flag.rolloutPercentage}% rollout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-400" />
                  <span className="text-gray-400 text-sm">{flag.usageCount} uses</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  Created: {flag.createdAt.toLocaleDateString()} • 
                  Updated: {flag.updatedAt.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredFlags.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <Flag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Feature Flags Found</h3>
              <p className="text-gray-500">
                {searchTerm || filterEnvironment !== 'all' 
                  ? 'No flags match your current filters.' 
                  : 'Create your first feature flag to get started.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeatureFlagManager;
