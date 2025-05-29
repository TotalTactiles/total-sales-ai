
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Code, Database, Shield, Bell, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const DeveloperSettings = () => {
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [devMode, setDevMode] = useState(true);
  const [debugLogs, setDebugLogs] = useState(false);
  const [apiLogging, setApiLogging] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const shouldShowMockData = isDemoMode() || showDemo;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore developer settings.');
  };

  const apiKeys = [
    { name: 'OpenAI API', status: 'active', lastUsed: '2 hours ago' },
    { name: 'Retell AI', status: 'active', lastUsed: '5 minutes ago' },
    { name: 'ElevenLabs', status: 'active', lastUsed: '1 hour ago' },
    { name: 'Supabase', status: 'active', lastUsed: 'Just now' }
  ];

  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Developer Settings" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Developer Settings & Configuration" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Settings</h1>
          <p className="text-muted-foreground mt-2">
            System configuration, API management, and development tools
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Development Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Development Configuration
            </CardTitle>
            <CardDescription>Core development and debugging settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Developer Mode</p>
                  <p className="text-sm text-muted-foreground">Enable advanced debugging features</p>
                </div>
                <Switch checked={devMode} onCheckedChange={setDevMode} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Debug Logging</p>
                  <p className="text-sm text-muted-foreground">Verbose console logging</p>
                </div>
                <Switch checked={debugLogs} onCheckedChange={setDebugLogs} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">API Request Logging</p>
                  <p className="text-sm text-muted-foreground">Log all API requests and responses</p>
                </div>
                <Switch checked={apiLogging} onCheckedChange={setApiLogging} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Alerts</p>
                  <p className="text-sm text-muted-foreground">Enable system notifications</p>
                </div>
                <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Management
            </CardTitle>
            <CardDescription>Manage external service integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((api, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{api.name}</p>
                    <p className="text-sm text-muted-foreground">Last used: {api.lastUsed}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={api.status === 'active' ? 'default' : 'secondary'}
                      className={api.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {api.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Configuration
          </CardTitle>
          <CardDescription>Database settings and connection management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Connection Pool</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <p className="text-sm text-muted-foreground">85% utilized, 15 active connections</p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                View Details
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Query Performance</span>
                <Badge className="bg-blue-100 text-blue-800">Optimal</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Avg response: 12ms</p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Analyze Queries
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Backup Status</span>
                <Badge className="bg-green-100 text-green-800">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Backup Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Security configuration and access control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Access Control</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Two-Factor Authentication</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Rate Limiting</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Request Encryption</span>
                  <Badge className="bg-green-100 text-green-800">TLS 1.3</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Audit Logging</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">User Actions</span>
                  <Badge className="bg-blue-100 text-blue-800">Logged</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">System Changes</span>
                  <Badge className="bg-blue-100 text-blue-800">Monitored</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data Access</span>
                  <Badge className="bg-blue-100 text-blue-800">Tracked</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
          <CardDescription>Administrative tools and system maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Database className="h-6 w-6" />
              <span>Flush Cache</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Code className="h-6 w-6" />
              <span>Restart Services</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Bell className="h-6 w-6" />
              <span>Test Alerts</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Settings className="h-6 w-6" />
              <span>Export Config</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperSettings;
