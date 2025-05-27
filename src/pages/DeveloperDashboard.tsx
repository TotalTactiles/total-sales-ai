
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Terminal, 
  Database, 
  Brain, 
  Shield, 
  Activity, 
  Settings,
  Eye,
  Code,
  Zap
} from 'lucide-react';
import ProductionReadinessMonitor from '@/components/SystemHealth/ProductionReadinessMonitor';
import DeveloperModeToggle from '@/components/DeveloperMode/DeveloperModeToggle';
import { useAuth } from '@/contexts/AuthContext';

const DeveloperDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <DeveloperModeToggle />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Developer Control Panel</h1>
            <Badge variant="destructive" className="animate-pulse">
              SECURE ACCESS
            </Badge>
          </div>
          <p className="text-slate-400">
            System diagnostics, AI monitoring, and production readiness validation
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-brain" className="data-[state=active]:bg-purple-600">
              <Brain className="h-4 w-4 mr-2" />
              AI Brain
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-green-600">
              <Database className="h-4 w-4 mr-2" />
              Database
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-red-600">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="sandbox" className="data-[state=active]:bg-yellow-600">
              <Code className="h-4 w-4 mr-2" />
              Sandbox
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductionReadinessMonitor />
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">System Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">AI Response Time</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        &lt; 2s
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Database Queries</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        1.2k/min
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Active Sessions</span>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        24
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Error Rate</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        0.1%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-brain" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    Master AI Brain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Status</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Learning Rate</span>
                      <span className="text-white">95.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Models</span>
                      <span className="text-white">Claude + GPT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Automations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Active Flows</span>
                      <span className="text-white">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Success Rate</span>
                      <span className="text-white">98.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Last Run</span>
                      <span className="text-white">2 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Voice AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">ElevenLabs</span>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Speech Recognition</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Response Time</span>
                      <span className="text-white">1.2s avg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="database" className="mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Database Health Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">99.9%</div>
                    <div className="text-slate-400">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">1.2ms</div>
                    <div className="text-slate-400">Avg Query</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">847</div>
                    <div className="text-slate-400">Active Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">2.1GB</div>
                    <div className="text-slate-400">Storage Used</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-400" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Encryption</span>
                      <Badge className="bg-green-600">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Authentication</span>
                      <Badge className="bg-green-600">Multi-Factor</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">API Security</span>
                      <Badge className="bg-green-600">Rate Limited</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Audit Logs</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Security Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-300">
                      <div className="flex justify-between">
                        <span>Login Success</span>
                        <span className="text-green-400">2 min ago</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300">
                      <div className="flex justify-between">
                        <span>API Key Rotation</span>
                        <span className="text-blue-400">1 hour ago</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300">
                      <div className="flex justify-between">
                        <span>Security Scan</span>
                        <span className="text-green-400">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sandbox" className="mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-yellow-400" />
                  Development Sandbox
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Test Manager View
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Test Sales Rep View
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Inject Test Data
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">System Tests</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                      <span className="text-slate-300">AI Response Generation</span>
                      <Badge className="bg-green-600">PASS</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                      <span className="text-slate-300">Voice Recognition</span>
                      <Badge className="bg-green-600">PASS</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                      <span className="text-slate-300">Email Automation</span>
                      <Badge className="bg-green-600">PASS</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                      <span className="text-slate-300">Database Operations</span>
                      <Badge className="bg-green-600">PASS</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
