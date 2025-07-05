
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Database, 
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

const SystemMonitor: React.FC = () => {
  const { execute, isLoading } = useAsyncOperation();
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: { usage: 45, status: 'healthy' },
    memory: { usage: 62, total: 16, used: 9.9, status: 'healthy' },
    disk: { usage: 78, total: 512, used: 399, status: 'warning' },
    network: { latency: 24, throughput: 1.2, status: 'healthy' },
    database: { connections: 12, queries: 245, status: 'healthy' }
  });

  const [logs, setLogs] = useState([
    { id: 1, level: 'info', message: 'System startup completed', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    { id: 2, level: 'warning', message: 'High disk usage detected', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 3, level: 'error', message: 'API timeout on external service', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
    { id: 4, level: 'info', message: 'Database backup completed', timestamp: new Date(Date.now() - 1000 * 60 * 15) }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpu: { ...prev.cpu, usage: Math.max(20, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 10)) },
        network: { ...prev.network, latency: Math.max(10, Math.min(100, prev.network.latency + (Math.random() - 0.5) * 20)) }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const refreshMetrics = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSystemMetrics(prev => ({
        ...prev,
        cpu: { usage: Math.floor(Math.random() * 80) + 10, status: 'healthy' },
        memory: { usage: Math.floor(Math.random() * 40) + 40, total: 16, used: Math.floor(Math.random() * 8) + 6, status: 'healthy' }
      }));
    }, 'sync');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return <LoadingManager type="sync" message="Refreshing system metrics..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Monitor</h1>
          <p className="text-gray-400 mt-2">Real-time system performance and health metrics</p>
        </div>
        <Button 
          onClick={refreshMetrics}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.cpu.usage.toFixed(1)}%</div>
            <div className="flex items-center justify-between mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${systemMetrics.cpu.usage}%` }}
                />
              </div>
              <Badge className={getStatusColor(systemMetrics.cpu.status)}>
                {getStatusIcon(systemMetrics.cpu.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Memory</CardTitle>
            <HardDrive className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.memory.used}GB</div>
            <p className="text-xs text-gray-400">of {systemMetrics.memory.total}GB total</p>
            <div className="flex items-center justify-between mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${systemMetrics.memory.usage}%` }}
                />
              </div>
              <Badge className={getStatusColor(systemMetrics.memory.status)}>
                {getStatusIcon(systemMetrics.memory.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Network</CardTitle>
            <Wifi className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.network.latency}ms</div>
            <p className="text-xs text-gray-400">{systemMetrics.network.throughput}Gbps throughput</p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-400">Latency</div>
              <Badge className={getStatusColor(systemMetrics.network.status)}>
                {getStatusIcon(systemMetrics.network.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Database</CardTitle>
            <Database className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.database.connections}</div>
            <p className="text-xs text-gray-400">{systemMetrics.database.queries} queries/min</p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-400">Active connections</div>
              <Badge className={getStatusColor(systemMetrics.database.status)}>
                {getStatusIcon(systemMetrics.database.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.disk.used}GB</div>
            <p className="text-xs text-gray-400">of {systemMetrics.disk.total}GB used</p>
            <div className="flex items-center justify-between mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                <div 
                  className="bg-red-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${systemMetrics.disk.usage}%` }}
                />
              </div>
              <Badge className={getStatusColor(systemMetrics.disk.status)}>
                {getStatusIcon(systemMetrics.disk.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">System Health</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Healthy</div>
            <p className="text-xs text-gray-400">All systems operational</p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm text-gray-400">Overall status</div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="h-4 w-4" />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    log.level === 'error' ? 'bg-red-400' : 
                    log.level === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <p className="text-white text-sm">{log.message}</p>
                    <p className="text-gray-400 text-xs">{log.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`${getLevelColor(log.level)} border-current`}>
                  {log.level.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitor;
