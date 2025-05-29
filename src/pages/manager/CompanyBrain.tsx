
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Database, 
  Zap, 
  Settings, 
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

const ManagerCompanyBrain = () => {
  const [integrations] = useState([
    {
      name: 'Zoho CRM',
      status: 'connected',
      lastSync: '2 minutes ago',
      records: '1,247 leads',
      description: 'Real-time lead ingestion and contact management'
    },
    {
      name: 'ClickUp',
      status: 'connected',
      lastSync: '5 minutes ago',
      records: '89 tasks',
      description: 'Task and project management integration'
    },
    {
      name: 'Salesforce',
      status: 'available',
      lastSync: 'Never',
      records: 'Not connected',
      description: 'Enterprise CRM and sales pipeline management'
    },
    {
      name: 'GoHighLevel',
      status: 'available',
      lastSync: 'Never',
      records: 'Not connected',
      description: 'All-in-one marketing and sales platform'
    }
  ]);

  const [knowledgeBase] = useState([
    {
      category: 'Sales Scripts',
      items: 47,
      lastUpdated: '1 day ago',
      aiOptimized: true
    },
    {
      category: 'Product Information',
      items: 23,
      lastUpdated: '3 days ago',
      aiOptimized: true
    },
    {
      category: 'Competitor Analysis',
      items: 15,
      lastUpdated: '1 week ago',
      aiOptimized: false
    },
    {
      category: 'Case Studies',
      items: 31,
      lastUpdated: '2 days ago',
      aiOptimized: true
    }
  ]);

  const [automations] = useState([
    {
      name: 'Lead Scoring Automation',
      status: 'active',
      triggers: 'New lead import',
      actions: 'AI scoring + assignment',
      lastRun: '5 minutes ago'
    },
    {
      name: 'Follow-up Sequence',
      status: 'active',
      triggers: 'Demo completed',
      actions: 'Email sequence + CRM update',
      lastRun: '1 hour ago'
    },
    {
      name: 'Deal Alert System',
      status: 'active',
      triggers: 'High-value opportunity',
      actions: 'Manager notification + priority flag',
      lastRun: '3 hours ago'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'available':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'available':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Brain</h1>
          <p className="text-gray-600">Centralized intelligence and automation hub</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Brain className="h-3 w-3 mr-1" />
            AI Brain Active
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Systems</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'connected').length}</div>
            <p className="text-xs text-muted-foreground">
              {integrations.filter(i => i.status === 'available').length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automations.filter(a => a.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Running smoothly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Items</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{knowledgeBase.reduce((acc, kb) => acc + kb.items, 0)}</div>
            <p className="text-xs text-muted-foreground">
              AI-optimized content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">CRM Integrations</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                CRM Integration Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">Last sync: {integration.lastSync}</span>
                          <span className="text-xs text-gray-500">{integration.records}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                      {integration.status === 'connected' ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Sync
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800">Zoho CRM Sync</h4>
                  <p className="text-sm text-green-700">Successfully imported 23 new leads in the last hour</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800">ClickUp Tasks</h4>
                  <p className="text-sm text-blue-700">12 follow-up tasks created automatically</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Knowledge Base
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledgeBase.map((kb, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{kb.category}</h4>
                      <p className="text-sm text-gray-600">{kb.items} items • Last updated: {kb.lastUpdated}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={kb.aiOptimized ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                        {kb.aiOptimized ? 'AI Optimized' : 'Manual'}
                      </Badge>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800">Update Competitor Analysis</h4>
                  <p className="text-sm text-yellow-700">AI detected new competitor pricing changes - knowledge base needs update</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800">Optimize Sales Scripts</h4>
                  <p className="text-sm text-blue-700">Based on call analysis, 3 scripts could be improved for better conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Workflow Builder
                </span>
                <Button>
                  Create Automation
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automations.map((automation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(automation.status)}
                      </div>
                      <div>
                        <h4 className="font-medium">{automation.name}</h4>
                        <p className="text-sm text-gray-600">
                          Trigger: {automation.triggers} → Action: {automation.actions}
                        </p>
                        <p className="text-xs text-gray-500">Last run: {automation.lastRun}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(automation.status)}>
                        {automation.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automation Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Workflows</span>
                  <span className="text-sm font-medium">3 / 10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Actions per Workflow</span>
                  <span className="text-sm font-medium">Max 10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice Triggers</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI System Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">AI Suggestions Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Suggestions Generated</span>
                      <span className="text-sm font-medium">147 this week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Acceptance Rate</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">System Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">AI Interactions</span>
                      <span className="text-sm font-medium">234 today</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Automation Runs</span>
                      <span className="text-sm font-medium">67 today</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800">Pattern Recognition Improved</h4>
                  <p className="text-sm text-green-700">AI now identifies high-value leads with 92% accuracy (up from 84%)</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800">New Automation Opportunities</h4>
                  <p className="text-sm text-blue-700">Detected 4 manual processes that could benefit from automation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerCompanyBrain;
