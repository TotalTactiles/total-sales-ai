
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Activity, 
  RefreshCw,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  Database,
  Network
} from 'lucide-react';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface BrainMetrics {
  processingPower: number;
  memoryUsage: number;
  activeThoughts: number;
  queriesPerSecond: number;
  learningRate: number;
  knowledgeBase: number;
  responseTime: number;
  accuracy: number;
}

const AIBrainMonitor: React.FC = () => {
  const { execute, isLoading } = useAsyncOperation();
  const [metrics, setMetrics] = useState<BrainMetrics>({
    processingPower: 87,
    memoryUsage: 64,
    activeThoughts: 12,
    queriesPerSecond: 45,
    learningRate: 92,
    knowledgeBase: 78,
    responseTime: 120,
    accuracy: 96
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'query', message: 'Processing lead qualification request', timestamp: new Date(Date.now() - 1000 * 30) },
    { id: 2, type: 'learning', message: 'Updated sales objection handling patterns', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    { id: 3, type: 'analysis', message: 'Analyzed customer conversation sentiment', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 4, type: 'optimization', message: 'Optimized response generation model', timestamp: new Date(Date.now() - 1000 * 60 * 8) }
  ]);

  const [neuralActivity, setNeuralActivity] = useState([
    { layer: 'Input Processing', activity: 85, color: 'text-blue-400' },
    { layer: 'Pattern Recognition', activity: 92, color: 'text-green-400' },
    { layer: 'Context Analysis', activity: 78, color: 'text-yellow-400' },
    { layer: 'Response Generation', activity: 96, color: 'text-purple-400' },
    { layer: 'Quality Assurance', activity: 89, color: 'text-pink-400' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        processingPower: Math.max(50, Math.min(100, prev.processingPower + (Math.random() - 0.5) * 5)),
        activeThoughts: Math.max(0, Math.min(20, prev.activeThoughts + Math.floor((Math.random() - 0.5) * 3))),
        queriesPerSecond: Math.max(20, Math.min(80, prev.queriesPerSecond + Math.floor((Math.random() - 0.5) * 8))),
        responseTime: Math.max(80, Math.min(200, prev.responseTime + (Math.random() - 0.5) * 20))
      }));

      setNeuralActivity(prev => prev.map(layer => ({
        ...layer,
        activity: Math.max(60, Math.min(100, layer.activity + (Math.random() - 0.5) * 4))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const refreshBrainData = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setMetrics(prev => ({
        ...prev,
        processingPower: Math.max(80, Math.min(100, prev.processingPower + Math.random() * 10)),
        learningRate: Math.max(85, Math.min(100, prev.learningRate + Math.random() * 5)),
        accuracy: Math.max(90, Math.min(100, prev.accuracy + Math.random() * 3))
      }));
      
      // Add new activity
      const newActivity = {
        id: Date.now(),
        type: 'optimization',
        message: 'Neural pathways optimized for better performance',
        timestamp: new Date()
      };
      setRecentActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 'ai');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'query': return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case 'learning': return <Brain className="h-4 w-4 text-green-400" />;
      case 'analysis': return <Activity className="h-4 w-4 text-yellow-400" />;
      case 'optimization': return <Zap className="h-4 w-4 text-purple-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'query': return 'bg-blue-500/20 border-blue-500/30';
      case 'learning': return 'bg-green-500/20 border-green-500/30';
      case 'analysis': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'optimization': return 'bg-purple-500/20 border-purple-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return <LoadingManager type="ai" message="Connecting to TSAM AI Brain..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-400" />
            TSAM AI Brain Monitor
          </h1>
          <p className="text-gray-400 mt-2">Real-time AI processing and neural activity monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
            <Brain className="h-3 w-3 mr-1" />
            ACTIVE
          </Badge>
          <Button 
            onClick={refreshBrainData}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Core System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Cpu className="h-6 w-6 text-blue-400" />
              <span className={`text-lg font-bold ${getPerformanceColor(metrics.processingPower)}`}>
                {metrics.processingPower}%
              </span>
            </div>
            <p className="text-sm text-gray-400">Processing Power</p>
            <Progress value={metrics.processingPower} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Database className="h-6 w-6 text-green-400" />
              <span className={`text-lg font-bold ${getPerformanceColor(metrics.memoryUsage)}`}>
                {metrics.memoryUsage}%
              </span>
            </div>
            <p className="text-sm text-gray-400">Memory Usage</p>
            <Progress value={metrics.memoryUsage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Brain className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold text-white">{metrics.activeThoughts}</span>
            </div>
            <p className="text-sm text-gray-400">Active Thoughts</p>
            <p className="text-xs text-purple-400 mt-1">Neural processes running</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Network className="h-6 w-6 text-orange-400" />
              <span className="text-lg font-bold text-white">{metrics.queriesPerSecond}</span>
            </div>
            <p className="text-sm text-gray-400">Queries/Second</p>
            <p className="text-xs text-orange-400 mt-1">Real-time processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Learning Rate</span>
              <span className={`font-bold ${getPerformanceColor(metrics.learningRate)}`}>
                {metrics.learningRate}%
              </span>
            </div>
            <Progress value={metrics.learningRate} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Knowledge Base</span>
              <span className={`font-bold ${getPerformanceColor(metrics.knowledgeBase)}`}>
                {metrics.knowledgeBase}%
              </span>
            </div>
            <Progress value={metrics.knowledgeBase} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Response Accuracy</span>
              <span className={`font-bold ${getPerformanceColor(metrics.accuracy)}`}>
                {metrics.accuracy}%
              </span>
            </div>
            <Progress value={metrics.accuracy} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Response Time</span>
              <span className="font-bold text-white">{metrics.responseTime}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Neural Layer Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {neuralActivity.map((layer, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{layer.layer}</span>
                  <span className={`font-bold ${layer.color}`}>
                    {layer.activity.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      layer.activity > 90 ? 'bg-green-400' :
                      layer.activity > 70 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${layer.activity}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            Recent AI Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
                <div className="flex items-center gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs">
                      {activity.timestamp.toLocaleTimeString()} • {activity.type}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {activity.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainMonitor;
