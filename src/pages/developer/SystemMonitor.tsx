
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Server,
  Database,
  Cpu,
  MemoryStick,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface SystemResource {
  name: string;
  usage: number;
  status: 'healthy' | 'warning' | 'critical';
  details: string;
}

const SystemMonitor: React.FC = () => {
  const [resources, setResources] = useState<SystemResource[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [osInfo, setOsInfo] = useState<string>('');

  useEffect(() => {
    loadSystemResources();
    const interval = setInterval(loadSystemResources, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const detectOS = () => {
      if (typeof navigator === 'undefined') {
        return 'Unknown';
      }
      const ua = navigator.userAgent;
      if (/windows/i.test(ua)) return 'Windows';
      if (/macintosh|mac os x/i.test(ua)) return 'macOS';
      if (/android/i.test(ua)) return 'Android';
      if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
      if (/linux/i.test(ua)) return 'Linux';
      return 'Unknown';
    };

    setOsInfo(detectOS());
  }, []);

  const requestIdRef = useRef(0);

  const loadSystemResources = async () => {
    const requestId = ++requestIdRef.current;

    try {
      const { data, error } = await supabase.functions.invoke('system-health');
      if (error) throw error;
      if (requestId !== requestIdRef.current) return;

      const cpuUsage = data.cpuUsage as number;
      const memoryUsage = data.memoryUsage as number;
      const dbStatus = data.dbStatus as string;
      const errorRate = data.errorRate as number;
      const dbQueryTime = data.dbQueryTime as number;

      setResources([
        {
          name: 'CPU Usage',
          usage: cpuUsage,
          status:
            cpuUsage > 80 ? 'critical' : cpuUsage > 60 ? 'warning' : 'healthy',
          details: `${cpuUsage.toFixed(1)}% load`
        },
        {
          name: 'Memory',
          usage: memoryUsage,
          status:
            memoryUsage > 80 ? 'critical' : memoryUsage > 60 ? 'warning' : 'healthy',
          details: `${memoryUsage.toFixed(1)}% used`
        },
        {
          name: 'Database',
          usage: Math.min(dbQueryTime / 10, 100),
          status: dbStatus === 'healthy' ? 'healthy' : 'critical',
          details: `${dbStatus} - ${dbQueryTime}ms`
        },
        {
          name: 'API Error Rate',
          usage: Math.min(errorRate * 100, 100),
          status:
            errorRate > 0.1 ? 'critical' : errorRate > 0.05 ? 'warning' : 'healthy',
          details: `${(errorRate * 100).toFixed(2)}% errors/min`
        }
      ]);
      setLastUpdate(new Date());
    } catch (err) {
      logger.error('Failed to load system resources', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getResourceIcon = (name: string) => {
    switch (name) {
      case 'CPU Usage': return <Cpu className="h-5 w-5 text-blue-500" />;
      case 'Memory': return <MemoryStick className="h-5 w-5 text-green-500" />;
      case 'Database': return <Database className="h-5 w-5 text-purple-500" />;
      default: return <Server className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Monitor</h1>
          <p className="text-slate-400">Real-time system resource monitoring</p>
        </div>
        <Badge className="bg-green-500 text-white">
          All Systems Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                {getResourceIcon(resource.name)}
                {resource.name}
              </CardTitle>
              {getStatusIcon(resource.status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">
                {resource.usage.toFixed(1)}%
              </div>
              <Progress 
                value={resource.usage} 
                className={`h-2 mb-2 ${
                  resource.usage > 80 ? 'bg-red-200' :
                  resource.usage > 60 ? 'bg-yellow-200' :
                  'bg-green-200'
                }`}
              />
              <p className="text-xs text-slate-400">{resource.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <div>
              <h4 className="font-medium mb-2">Server Details</h4>
              <p className="text-sm">OS: {osInfo || 'Unknown'}</p>
              <p className="text-sm">Runtime: Node.js 18.x</p>
              <p className="text-sm">Framework: React 18 + Vite</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Last Update</h4>
              <p className="text-sm">{lastUpdate.toLocaleString()}</p>
              <p className="text-sm text-green-400">Auto-refresh: Every 5 seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitor;
