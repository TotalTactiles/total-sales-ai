
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Brain, 
  Database,
  Zap,
  Activity,
  Settings,
  Eye,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AIIntegrationMapper: React.FC = () => {
  const [aiIntegrations, setAiIntegrations] = useState([
    {
      model: 'Claude 4 Sonnet',
      status: 'active',
      locations: ['Manager OS - AI Assistant', 'Sales Rep - Copilot', 'TSAM Brain'],
      inputs: ['User conversations', 'Company knowledge', 'CRM data'],
      outputs: ['Strategic recommendations', 'Sales scripts', 'Lead insights'],
      usage: 85,
      latency: 120,
      cost: '$240/month'
    },
    {
      model: 'GPT-4.1',
      status: 'active',
      locations: ['Sales Academy', 'Lead Intelligence', 'Document Processing'],
      inputs: ['Training content', 'Lead data', 'PDF documents'],
      outputs: ['Lesson content', 'Lead scoring', 'Document summaries'],
      usage: 72,
      latency: 95,
      cost: '$180/month'
    },
    {
      model: 'Gemini Pro',
      status: 'standby',
      locations: ['Backup system', 'Load balancing'],
      inputs: ['Emergency requests', 'Overflow traffic'],
      outputs: ['Fallback responses', 'Basic assistance'],
      usage: 15,
      latency: 180,
      cost: '$45/month'
    }
  ]);

  const [dataFlows, setDataFlows] = useState([
    {
      source: 'CRM Integration',
      destination: 'Claude 4 Sonnet',
      dataType: 'Lead Information',
      volume: '1.2K records/day',
      status: 'healthy'
    },
    {
      source: 'User Sessions',
      destination: 'GPT-4.1',
      dataType: 'Behavior Patterns',
      volume: '850 events/hour',
      status: 'healthy'
    },
    {
      source: 'Document Uploads',
      destination: 'All Models',
      dataType: 'Knowledge Base',
      volume: '45 docs/week',
      status: 'healthy'
    },
    {
      source: 'Call Recordings',
      destination: 'Claude 4 Sonnet',
      dataType: 'Conversation Analysis',
      volume: '120 calls/day',
      status: 'warning'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'standby': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFlowStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Integration Mapper</h1>
          <p className="text-gray-600">Visualize and manage AI model deployments across TSAM OS</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Live Monitor
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure Models
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiIntegrations.filter(ai => ai.status === 'active').length}</div>
            <p className="text-xs text-green-600">+1 standby</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(aiIntegrations.reduce((sum, ai) => sum + ai.usage, 0) / aiIntegrations.length)}%
            </div>
            <p className="text-xs text-blue-600">Average across models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Flows</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataFlows.length}</div>
            <p className="text-xs text-purple-600">Active pipelines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$465</div>
            <p className="text-xs text-orange-600">All AI services</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="models">Model Status</TabsTrigger>
          <TabsTrigger value="flows">Data Flows</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiIntegrations.map((integration, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      {integration.model}
                    </CardTitle>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Deployed Locations</h4>
                    <div className="space-y-1">
                      {integration.locations.map((location, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {location}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Input Sources</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {integration.inputs.map((input, idx) => (
                          <li key={idx}>• {input}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Output Types</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {integration.outputs.map((output, idx) => (
                          <li key={idx}>• {output}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{integration.usage}%</span>
                    </div>
                    <Progress value={integration.usage} />
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Latency: {integration.latency}ms</span>
                    <span>Cost: {integration.cost}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-600" />
                Data Flow Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataFlows.map((flow, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">{flow.source}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-sm">{flow.destination}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{flow.dataType}</p>
                        <p className="text-xs text-gray-600">{flow.volume}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${getFlowStatusColor(flow.status)}`}>
                        {flow.status === 'healthy' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : flow.status === 'warning' ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <Activity className="h-4 w-4" />
                        )}
                        <span className="text-sm capitalize">{flow.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Data Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Live Processing</span>
                  </div>
                  <p className="text-2xl font-bold text-green-800">2.4K</p>
                  <p className="text-sm text-green-600">Events/hour</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Queue Size</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">47</p>
                  <p className="text-sm text-blue-600">Pending items</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Throughput</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-800">98.5%</p>
                  <p className="text-sm text-purple-600">Success rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiIntegrations.filter(ai => ai.status === 'active').map((model, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{model.model}</span>
                        <span className="text-sm text-gray-600">{model.latency}ms avg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.max(10, 100 - (model.latency / 2))}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiIntegrations.map((model, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{model.model}</p>
                        <p className="text-xs text-gray-600">{model.usage}% utilization</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{model.cost}</p>
                        <p className="text-xs text-gray-600">Monthly</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIIntegrationMapper;
