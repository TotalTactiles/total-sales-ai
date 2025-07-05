
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Database, 
  Network, 
  RefreshCw,
  Activity,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface TSAMMetrics {
  systemHealth: number;
  processingLoad: number;
  memoryUsage: number;
  networkLatency: number;
  activeConnections: number;
  queriesProcessed: number;
  learningProgress: number;
  knowledgeBase: number;
}

interface BrainModule {
  name: string;
  status: 'active' | 'idle' | 'error';
  performance: number;
  tasks: number;
  description: string;
}

const TSAMBrainDashboard: React.FC = () => {
  const { execute, isLoading } = useAsyncOperation();
  const [metrics, setMetrics] = useState<TSAMMetrics>({
    systemHealth: 96,
    processingLoad: 73,
    memoryUsage: 58,
    networkLatency: 12,
    activeConnections: 47,
    queriesProcessed: 15234,
    learningProgress: 84,
    knowledgeBase: 91
  });

  const [brainModules, setBrainModules] = useState<BrainModule[]>([
    {
      name: 'Natural Language Processing',
      status: 'active',
      performance: 94,
      tasks: 156,
      description: 'Processing and understanding human language'
    },
    {
      name: 'Sales Intelligence Engine',
      status: 'active',
      performance: 89,
      tasks: 89,
      description: 'Analyzing sales patterns and opportunities'
    },
    {
      name: 'Conversation Manager',
      status: 'active',
      performance: 97,
      tasks: 234,
      description: 'Managing multi-turn conversations'
    },
    {
      name: 'Knowledge Retrieval',
      status: 'idle',
      performance: 76,
      tasks: 45,
      description: 'Accessing and retrieving relevant information'
    },
    {
      name: 'Predictive Analytics',
      status: 'active',
      performance: 82,
      tasks: 67,
      description: 'Predicting outcomes and trends'
    },
    {
      name: 'Voice Recognition',
      status: 'error',
      performance: 34,
      tasks: 12,
      description: 'Processing voice inputs and commands'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'query', message: 'Processed sales qualification query', timestamp: new Date(Date.now() - 1000 * 45) },
    { id: 2, type: 'learning', message: 'Updated conversation patterns database', timestamp: new Date(Date.now() - 1000 * 120) },
    { id: 3, type: 'analysis', message: 'Completed lead scoring analysis', timestamp: new Date(Date.now() - 1000 * 180) },
    { id: 4, type: 'optimization', message: 'Optimized response generation algorithms', timestamp: new Date(Date.now() - 1000 * 240) }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        processingLoad: Math.max(30, Math.min(100, prev.processingLoad + (Math.random() - 0.5) * 10)),
        activeConnections: Math.max(20, Math.min(80, prev.activeConnections + Math.floor((Math.random() - 0.5) * 6))),
        networkLatency: Math.max(5, Math.min(50, prev.networkLatency + (Math.random() - 0.5) * 8)),
        queriesProcessed: prev.queriesProcessed + Math.floor(Math.random() * 5)
      }));

      setBrainModules(prev => prev.map(module => ({
        ...module,
        performance: module.status === 'active' 
          ? Math.max(70, Math.min(100, module.performance + (Math.random() - 0.5) * 3))
          : module.performance,
        tasks: module.status === 'active'
          ? Math.max(0, module.tasks + Math.floor((Math.random() - 0.5) * 4))
          : module.tasks
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const refreshBrainData = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMetrics(prev => ({
        ...prev,
        systemHealth: Math.max(90, Math.min(100, prev.systemHealth + Math.random() * 5)),
        learningProgress: Math.max(80, Math.min(100, prev.learningProgress + Math.random() * 3)),
        knowledgeBase: Math.max(85, Math.min(100, prev.knowledgeBase + Math.random() * 2))
      }));

      // Add new activity
      const newActivity = {
        id: Date.now(),
        type: 'optimization',
        message: 'Brain module performance optimized',
        timestamp: new Date()
      };
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 'ai');
  };

  const restartModule = async (moduleName: string) => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setBrainModules(prev => prev.map(module =>
        module.name === moduleName
          ? { ...module, status: 'active', performance: 95, tasks: 0 }
          : module
      ));
    }, 'sync');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'idle': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'idle': return <Clock className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 85) return 'text-green-400';
    if (performance >= 70) return 'text-yellow-400';
    return 'text-red-400';
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

  if (isLoading) {
    return <LoadingManager type="ai" message="Connecting to TSAM Brain..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-400 animate-pulse" />
            TSAM Brain Control Center
          </h1>
          <p className="text-gray-400 mt-2">Advanced AI system monitoring and neural network oversight</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
            <Brain className="h-3 w-3 mr-1" />
            NEURAL ACTIVE
          </Badge>
          <Button 
            onClick={refreshBrainData}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Brain
          </Button>
        </div>
      </div>

      {/* Core System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 border-l-4 border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-6 w-6 text-green-400" />
              <span className={`text-lg font-bold ${getPerformanceColor(metrics.systemHealth)}`}>
                {metrics.systemHealth}%
              </span>
            </div>
            <p className="text-sm text-gray-400">System Health</p>
            <Progress value={metrics.systemHealth} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-6 w-6 text-blue-400" />
              <span className={`text-lg font-bold ${getPerformanceColor(metrics.processingLoad)}`}>
                {metrics.processingLoad}%
              </span>
            </div>
            <p className="text-sm text-gray-400">Processing Load</p>
            <Progress value={metrics.processingLoad} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 border-l-4 border-l-yellow-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Database className="h-6 w-6 text-yellow-400" />
              <span className={`text-lg font-bold ${getPerformanceColor(metrics.memoryUsage)}`}>
                {metrics.memoryUsage}%
              </span>
            </div>
            <p className="text-sm text-gray-400">Memory Usage</p>
            <Progress value={metrics.memoryUsage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 border-l-4 border-l-purple-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Network className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold text-purple-400">{metrics.networkLatency}ms</span>
            </div>
            <p className="text-sm text-gray-400">Network Latency</p>
            <p className="text-xs text-purple-400 mt-1">Neural pathways</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Brain Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{metrics.activeConnections}</p>
                <p className="text-xs text-gray-400">Active Connections</p>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <MessageSquare className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{metrics.queriesProcessed.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Queries Processed</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Learning Progress</span>
                  <span className={`font-bold ${getPerformanceColor(metrics.learningProgress)}`}>
                    {metrics.learningProgress}%
                  </span>
                </div>
                <Progress value={metrics.learningProgress} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Knowledge Base</span>
                  <span className={`font-bold ${getPerformanceColor(metrics.knowledgeBase)}`}>
                    {metrics.knowledgeBase}%
                  </span>
                </div>
                <Progress value={metrics.knowledgeBase} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              Recent Brain Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-3 bg-gray-700/50 rounded-lg">
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

      {/* Brain Modules */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Neural Module Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brainModules.map((module, index) => (
              <Card key={index} className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white text-sm">{module.name}</h4>
                    <Badge className={getStatusColor(module.status)}>
                      {getStatusIcon(module.status)}
                      {module.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400 text-xs mb-3">{module.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Performance</span>
                      <span className={`text-xs font-bold ${getPerformanceColor(module.performance)}`}>
                        {module.performance}%
                      </span>
                    </div>
                    <Progress value={module.performance} className="h-1" />
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Tasks: {module.tasks}</span>
                      {module.status === 'error' && (
                        <Button
                          size="sm"
                          onClick={() => restartModule(module.name)}
                          className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                        >
                          Restart
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TSAMBrainDashboard;
