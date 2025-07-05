
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Brain, 
  Zap, 
  Database, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Settings,
  ExternalLink
} from 'lucide-react';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface AIIntegration {
  id: string;
  name: string;
  type: 'llm' | 'voice' | 'analytics' | 'automation';
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'limited';
  health: number;
  apiKey: string;
  endpoint: string;
  requestCount: number;
  errorRate: number;
  avgResponseTime: number;
  rateLimitRemaining: number;
  rateLimitTotal: number;
  lastUpdated: Date;
}

const AIIntegrationMapper: React.FC = () => {
  const { execute, isLoading } = useAsyncOperation();
  const [integrations, setIntegrations] = useState<AIIntegration[]>([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      type: 'llm',
      provider: 'OpenAI',
      status: 'connected',
      health: 98,
      apiKey: 'sk-...abc123',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      requestCount: 12547,
      errorRate: 0.2,
      avgResponseTime: 850,
      rateLimitRemaining: 8750,
      rateLimitTotal: 10000,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      name: 'Anthropic Claude',
      type: 'llm',
      provider: 'Anthropic',
      status: 'connected',
      health: 95,
      apiKey: 'sk-ant-...def456',
      endpoint: 'https://api.anthropic.com/v1/messages',
      requestCount: 8934,
      errorRate: 0.8,
      avgResponseTime: 1200,
      rateLimitRemaining: 4500,
      rateLimitTotal: 5000,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 2)
    },
    {
      id: '3',
      name: 'ElevenLabs Voice',
      type: 'voice',
      provider: 'ElevenLabs',
      status: 'limited',
      health: 87,
      apiKey: 'xi-...ghi789',
      endpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
      requestCount: 2341,
      errorRate: 2.1,
      avgResponseTime: 2300,
      rateLimitRemaining: 250,
      rateLimitTotal: 1000,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
      id: '4',
      name: 'Retell AI',
      type: 'voice',
      provider: 'Retell',
      status: 'connected',
      health: 92,
      apiKey: 'ret-...jkl012',
      endpoint: 'https://api.retellai.com/v1/call',
      requestCount: 1567,
      errorRate: 1.5,
      avgResponseTime: 650,
      rateLimitRemaining: 7800,
      rateLimitTotal: 8000,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 1)
    },
    {
      id: '5',
      name: 'Custom Analytics Engine',
      type: 'analytics',
      provider: 'TSAM Internal',
      status: 'error',
      health: 34,
      apiKey: 'internal-key',
      endpoint: 'https://analytics.tsam.internal/api/v1',
      requestCount: 4567,
      errorRate: 15.3,
      avgResponseTime: 5600,
      rateLimitRemaining: 0,
      rateLimitTotal: 1000,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '6',
      name: 'Automation Flow Engine',
      type: 'automation',
      provider: 'TSAM Internal',
      status: 'connected',
      health: 89,
      apiKey: 'auto-...mno345',
      endpoint: 'https://automation.tsam.internal/api/v1',
      requestCount: 3456,
      errorRate: 3.2,
      avgResponseTime: 450,
      rateLimitRemaining: 9500,
      rateLimitTotal: 10000,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 7)
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntegrations(prev => prev.map(integration => ({
        ...integration,
        health: integration.status === 'connected' 
          ? Math.max(80, Math.min(100, integration.health + (Math.random() - 0.5) * 2))
          : integration.health,
        requestCount: integration.status === 'connected'
          ? integration.requestCount + Math.floor(Math.random() * 5)
          : integration.requestCount,
        avgResponseTime: integration.status === 'connected'
          ? Math.max(200, Math.min(3000, integration.avgResponseTime + (Math.random() - 0.5) * 100))
          : integration.avgResponseTime,
        rateLimitRemaining: integration.status !== 'error'
          ? Math.max(0, integration.rateLimitRemaining - Math.floor(Math.random() * 10))
          : integration.rateLimitRemaining
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const refreshIntegrations = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setIntegrations(prev => prev.map(integration => ({
        ...integration,
        health: integration.status === 'error' ? Math.random() * 40 + 60 : integration.health,
        status: integration.status === 'error' ? 'connected' : integration.status,
        errorRate: Math.max(0, integration.errorRate - Math.random() * 2),
        lastUpdated: new Date()
      })));
    }, 'sync');
  };

  const testIntegration = async (integrationId: string) => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIntegrations(prev => prev.map(integration =>
        integration.id === integrationId
          ? { 
              ...integration, 
              health: Math.random() * 20 + 80,
              avgResponseTime: Math.random() * 500 + 300,
              lastUpdated: new Date()
            }
          : integration
      ));
    }, 'ai');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'limited': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'disconnected': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'limited': return <Clock className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'disconnected': return <Network className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'llm': return <Brain className="h-5 w-5 text-purple-400" />;
      case 'voice': return <Activity className="h-5 w-5 text-blue-400" />;
      case 'analytics': return <Database className="h-5 w-5 text-green-400" />;
      case 'automation': return <Zap className="h-5 w-5 text-orange-400" />;
      default: return <Network className="h-5 w-5 text-gray-400" />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 85) return 'text-green-400';
    if (health >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const stats = {
    total: integrations.length,
    connected: integrations.filter(i => i.status === 'connected').length,
    errors: integrations.filter(i => i.status === 'error').length,
    totalRequests: integrations.reduce((sum, i) => sum + i.requestCount, 0)
  };

  if (isLoading) {
    return <LoadingManager type="ai" message="Mapping AI integrations..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Integration Mapper</h1>
          <p className="text-gray-400 mt-2">Monitor and manage AI service integrations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={refreshIntegrations}
            disabled={isLoading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Integrations</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Network className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Connected</p>
                <p className="text-2xl font-bold text-green-400">{stats.connected}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Errors</p>
                <p className="text-2xl font-bold text-red-400">{stats.errors}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-white">{stats.totalRequests.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(integration.type)}
                  <div>
                    <CardTitle className="text-white">{integration.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{integration.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(integration.status)}>
                    {getStatusIcon(integration.status)}
                    {integration.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Health Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Health</span>
                  <span className={`text-sm font-bold ${getHealthColor(integration.health)}`}>
                    {integration.health}%
                  </span>
                </div>
                <Progress value={integration.health} className="h-2" />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-lg font-bold text-white">{integration.requestCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Requests</p>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className={`text-lg font-bold ${integration.errorRate > 5 ? 'text-red-400' : 'text-green-400'}`}>
                    {integration.errorRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400">Error Rate</p>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-lg font-bold text-white">{integration.avgResponseTime}ms</p>
                  <p className="text-xs text-gray-400">Avg Response</p>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className={`text-lg font-bold ${
                    integration.rateLimitRemaining / integration.rateLimitTotal < 0.2 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {integration.rateLimitRemaining}
                  </p>
                  <p className="text-xs text-gray-400">Rate Limit</p>
                </div>
              </div>

              {/* Rate Limit Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Rate Limit Usage</span>
                  <span className="text-sm text-gray-400">
                    {integration.rateLimitRemaining}/{integration.rateLimitTotal}
                  </span>
                </div>
                <Progress 
                  value={(integration.rateLimitTotal - integration.rateLimitRemaining) / integration.rateLimitTotal * 100} 
                  className="h-2" 
                />
              </div>

              {/* Connection Details */}
              <div className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400">API Key:</span>
                  <span className="text-white font-mono">{integration.apiKey}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400">Endpoint:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs truncate max-w-[200px]">
                      {integration.endpoint}
                    </span>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white">{integration.lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => testIntegration(integration.id)}
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIIntegrationMapper;
