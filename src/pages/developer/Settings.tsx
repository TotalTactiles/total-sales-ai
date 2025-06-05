import { logger } from '@/utils/logger';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Shield, Zap, Bug, Database, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [debugMode, setDebugMode] = useState(false);
  const [verboseLogging, setVerboseLogging] = useState(true);
  const [aiMockMode, setAiMockMode] = useState(false);
  const [performanceMonitoring, setPerformanceMonitoring] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [logLevel, setLogLevel] = useState('info');
  const [cacheStrategy, setCacheStrategy] = useState('aggressive');

  const saveSettings = () => {
    logger.info('Saving developer settings...');
    // In real app, this would save to database or config file
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Developer Settings</h1>
          <p className="text-slate-400">AI mode toggles, feature flags, and debug tools</p>
        </div>
        <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-600">General</TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600">AI Settings</TabsTrigger>
          <TabsTrigger value="debug" className="data-[state=active]:bg-red-600">Debug Tools</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-green-600">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-blue-400" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Performance Monitoring</label>
                    <p className="text-sm text-slate-400">Track system performance metrics</p>
                  </div>
                  <Switch
                    checked={performanceMonitoring}
                    onCheckedChange={setPerformanceMonitoring}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Auto Backup</label>
                    <p className="text-sm text-slate-400">Automatically backup system data</p>
                  </div>
                  <Switch
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-white font-medium">Log Level</label>
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="trace">Trace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-white font-medium">Cache Strategy</label>
                  <Select value={cacheStrategy} onValueChange={setCacheStrategy}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-400" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Export System Data
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Import Configuration
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                
                <div className="pt-2 text-xs text-slate-400">
                  <p>Last backup: {new Date().toLocaleString()}</p>
                  <p>Configuration version: 2.1.3</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  AI System Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">AI Mock Mode</label>
                    <p className="text-sm text-slate-400">Use mock AI responses for testing</p>
                  </div>
                  <Switch
                    checked={aiMockMode}
                    onCheckedChange={setAiMockMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-white font-medium">Primary AI Provider</label>
                  <Select defaultValue="hybrid">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="openai">OpenAI Only</SelectItem>
                      <SelectItem value="claude">Claude Only</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-white font-medium">Fallback Strategy</label>
                  <Select defaultValue="intelligent">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="none">No Fallback</SelectItem>
                      <SelectItem value="simple">Simple Fallback</SelectItem>
                      <SelectItem value="intelligent">Intelligent Routing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">AI Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">98.7%</p>
                    <p className="text-sm text-slate-400">Uptime</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">1.2s</p>
                    <p className="text-sm text-slate-400">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">2.1k</p>
                    <p className="text-sm text-slate-400">Daily Requests</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">0.1%</p>
                    <p className="text-sm text-slate-400">Error Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="debug" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bug className="h-5 w-5 text-red-400" />
                  Debug Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Debug Mode</label>
                    <p className="text-sm text-slate-400">Enable detailed debugging information</p>
                  </div>
                  <Switch
                    checked={debugMode}
                    onCheckedChange={setDebugMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-white font-medium">Verbose Logging</label>
                    <p className="text-sm text-slate-400">Log all system events and responses</p>
                  </div>
                  <Switch
                    checked={verboseLogging}
                    onCheckedChange={setVerboseLogging}
                  />
                </div>
                
                {debugMode && (
                  <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded">
                    <Badge className="bg-yellow-600 text-white mb-2">DEBUG MODE ACTIVE</Badge>
                    <p className="text-xs text-yellow-200">
                      Debug mode will significantly increase log output and may impact performance.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Debug Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Bug className="h-4 w-4 mr-2" />
                  Clear All Logs
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Bug className="h-4 w-4 mr-2" />
                  Export Debug Package
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Bug className="h-4 w-4 mr-2" />
                  Generate System Report
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Bug className="h-4 w-4 mr-2" />
                  Test All Integrations
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white font-medium">Session Timeout</label>
                  <Select defaultValue="24h">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="8h">8 Hours</SelectItem>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-white font-medium">API Rate Limiting</label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="lenient">Lenient</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Encryption</span>
                  <Badge className="bg-green-600 text-white">AES-256</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Authentication</span>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Rate Limiting</span>
                  <Badge className="bg-green-600 text-white">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Audit Logging</span>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">HTTPS</span>
                  <Badge className="bg-green-600 text-white">Enforced</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
