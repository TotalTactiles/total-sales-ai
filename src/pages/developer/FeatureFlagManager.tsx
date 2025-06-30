
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Flag, 
  Plus, 
  Settings, 
  Users, 
  BarChart3,
  Search,
  Filter
} from 'lucide-react';
import { useTSAM } from '@/hooks/useTSAM';

const FeatureFlagManager: React.FC = () => {
  const { featureFlags, toggleFeatureFlag, isDeveloper } = useTSAM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('all');

  const filteredFlags = featureFlags.filter(flag => {
    const matchesSearch = flag.flag_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (flag.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesAudience = selectedAudience === 'all' || flag.target_audience === selectedAudience;
    return matchesSearch && matchesAudience;
  });

  const flagsByAudience = {
    developers: featureFlags.filter(f => f.target_audience === 'developers'),
    managers: featureFlags.filter(f => f.target_audience === 'managers'),
    sales_reps: featureFlags.filter(f => f.target_audience === 'sales_reps'),
    all: featureFlags.filter(f => f.target_audience === 'all')
  };

  if (!isDeveloper) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Developer Access Required</h3>
          <p className="text-gray-500">Feature flag management is only available to developers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feature Flag Manager</h1>
          <p className="text-gray-600">Control feature rollouts across teams and modules</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Feature Flag
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flags</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featureFlags.length}</div>
            <p className="text-xs text-green-600">
              {featureFlags.filter(f => f.enabled).length} enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Developer Flags</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flagsByAudience.developers.length}</div>
            <p className="text-xs text-blue-600">
              {flagsByAudience.developers.filter(f => f.enabled).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manager Flags</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flagsByAudience.managers.length}</div>
            <p className="text-xs text-purple-600">
              {flagsByAudience.managers.filter(f => f.enabled).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Rep Flags</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flagsByAudience.sales_reps.length}</div>
            <p className="text-xs text-orange-600">
              {flagsByAudience.sales_reps.filter(f => f.enabled).length} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search feature flags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={selectedAudience} 
          onChange={(e) => setSelectedAudience(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Audiences</option>
          <option value="developers">Developers</option>
          <option value="managers">Managers</option>
          <option value="sales_reps">Sales Reps</option>
        </select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-audience">By Audience</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Feature Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFlags.map((flag) => (
                  <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{flag.flag_name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {flag.target_audience}
                        </Badge>
                      </div>
                      {flag.description && (
                        <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(flag.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={(checked) => toggleFeatureFlag(flag.flag_name, checked)}
                      />
                      <Badge variant={flag.enabled ? 'default' : 'secondary'}>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-audience" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Developer Flags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {flagsByAudience.developers.map((flag) => (
                  <div key={flag.id} className="flex items-center justify-between">
                    <span className="text-sm">{flag.flag_name}</span>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={(checked) => toggleFeatureFlag(flag.flag_name, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Manager Flags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {flagsByAudience.managers.map((flag) => (
                  <div key={flag.id} className="flex items-center justify-between">
                    <span className="text-sm">{flag.flag_name}</span>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={(checked) => toggleFeatureFlag(flag.flag_name, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  Sales Rep Flags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {flagsByAudience.sales_reps.map((flag) => (
                  <div key={flag.id} className="flex items-center justify-between">
                    <span className="text-sm">{flag.flag_name}</span>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={(checked) => toggleFeatureFlag(flag.flag_name, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-green-600" />
                  Global Flags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {flagsByAudience.all.map((flag) => (
                  <div key={flag.id} className="flex items-center justify-between">
                    <span className="text-sm">{flag.flag_name}</span>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={(checked) => toggleFeatureFlag(flag.flag_name, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flag Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Feature flag analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureFlagManager;
