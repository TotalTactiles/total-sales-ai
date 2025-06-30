
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Activity, 
  Database,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  Clock,
  Network,
  Shield,
  BarChart3
} from 'lucide-react';

const TSAMBrainDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isDeveloper] = useState(true); // Simplified for demo
  const [logs, setLogs] = useState([
    { id: 1, type: 'AI Model Switch', created_at: new Date().toISOString(), resolved: true, priority: 'high' },
    { id: 2, type: 'Memory Optimization', created_at: new Date().toISOString(), resolved: false, priority: 'medium' },
    { id: 3, type: 'Feature Flag Update', created_at: new Date().toISOString(), resolved: true, priority: 'low' }
  ]);

  const [aiModels] = useState([
    { name: 'Claude 4 Sonnet', status: 'active', usage: 85, latency: 120 },
    { name: 'GPT-4.1', status: 'active', usage: 72, latency: 95 },
    { name: 'Gemini Pro', status: 'standby', usage: 15, latency: 180 }
  ]);

  const [learningInsights] = useState([
    {
      type: 'pattern_detected',
      message: 'Sales reps perform 34% better during 10-11 AM calls',
      confidence: 92,
      impact: 'high',
      timestamp: new Date()
    },
    {
      type: 'optimization_found',
      message: 'Manager dashboard loads 2.3s faster with lazy loading',
      confidence: 88,
      impact: 'medium',
      timestamp: new Date()
    },
    {
      type: 'anomaly_detected',
      message: 'Unusual spike in API errors from CRM integration',
      confidence: 95,
      impact: 'critical',
      timestamp: new Date()
    }
  ]);

  const [metrics] = useState({
    responseTime: 145,
    systemHealth: 'healthy'
  });

  useEffect(() => {
    // Simulate data loading without subscriptions
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const checkSystemHealth = () => {
    console.log('System health check initiated');
  };

  if (!isDeveloper) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Developer Access Required</h3>
          <p className="text-gray-500">TSAM Brain dashboard is only available to developers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="responsive-text-2xl font-bold text-gray-900">TSAM Brain Control Tower</h1>
          <p className="text-gray-600 mt-1 responsive-text-base">Central AI intelligence and system optimization command center</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Brain className="h-3 w-3 mr-1" />
            TSAM Brain Online
          </Badge>
          <Button onClick={checkSystemHealth} size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Health Check
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="card-grid card-grid-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Models Active</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiModels.filter(m => m.status === 'active').length}</div>
            <p className="text-xs text-green-600">+1 standby model</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-blue-600">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <p className="text-xs text-purple-600">Average latency</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="intelligence" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
          <TabsTrigger value="models">Model Status</TabsTrigger>
          <TabsTrigger value="learning">Learning Logs</TabsTrigger>
          <TabsTrigger value="control">Control Panel</TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence" className="space-y-6">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Learning Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningInsights.map((insight, index) => (
                <div key={index} className={`p-4 border-l-4 rounded-lg ${
                  insight.impact === 'critical' ? 'bg-red-50 border-red-400' :
                  insight.impact === 'high' ? 'bg-orange-50 border-orange-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm capitalize">{insight.type.replace('_', ' ')}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{insight.timestamp.toLocaleTimeString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${
                        insight.impact === 'critical' ? 'text-red-700 border-red-200' :
                        insight.impact === 'high' ? 'text-orange-700 border-orange-200' :
                        'text-blue-700 border-blue-200'
                      }`}>
                        {insight.impact}
                      </Badge>
                      <span className="text-xs text-gray-500">{insight.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Impact Mapping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-600" />
                System Impact Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="card-grid card-grid-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Sales OS</span>
                  </div>
                  <p className="text-sm text-green-700">94% AI assistance adoption</p>
                  <p className="text-xs text-green-600 mt-1">Performance: Excellent</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Manager OS</span>
                  </div>
                  <p className="text-sm text-yellow-700">67% feature utilization</p>
                  <p className="text-xs text-yellow-600 mt-1">Performance: Good</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Developer OS</span>
                  </div>
                  <p className="text-sm text-blue-700">100% monitoring coverage</p>
                  <p className="text-xs text-blue-600 mt-1">Performance: Optimal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Model Status & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiModels.map((model, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      model.status === 'active' ? 'bg-green-500' :
                      model.status === 'standby' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <h4 className="font-medium">{model.name}</h4>
                      <p className="text-sm text-gray-600">Latency: {model.latency}ms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{model.usage}% Usage</p>
                      <Progress value={model.usage} className="w-24 h-2" />
                    </div>
                    <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Learning Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.slice(0, 10).map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">{log.type}</p>
                          <p className="text-xs text-gray-600">{new Date(log.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge variant={log.resolved ? 'default' : 'secondary'}>
                        {log.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="control" className="space-y-6">
          <div className="card-grid card-grid-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Learning Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">User Session Tracking</h4>
                    <p className="text-sm text-gray-600">Monitor user behavior patterns</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">API Log Analysis</h4>
                    <p className="text-sm text-gray-600">Analyze API performance and errors</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Real-time Optimization</h4>
                    <p className="text-sm text-gray-600">Auto-suggest system improvements</p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  Emergency Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Freeze & Snapshot Current State
                </Button>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Change Timeline
                </Button>
                <Button variant="destructive" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency AI Shutdown
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TSAMBrainDashboard;
