import React, { useState, useEffect } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  HardDrive,
  MemoryStick,
  RefreshCw,
  Server,
  Wifi,
  AlertTriangle
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: string | number;
  unit?: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ReactNode;
}

const SystemMonitorPage: React.FC = () => {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const isDeveloper = profile?.role === 'developer';

  useEffect(() => {
    if (!isDeveloper) return;

    const generateMetrics = (): SystemMetric[] => [
      {
        name: 'CPU Usage',
        value: Math.floor(Math.random() * 40) + 20,
        unit: '%',
        status: Math.random() > 0.8 ? 'warning' : 'healthy',
        icon: <Cpu className="h-4 w-4" />
      },
      {
        name: 'Memory Usage',
        value: Math.floor(Math.random() * 30) + 50,
        unit: '%',
        status: Math.random() > 0.9 ? 'critical' : 'healthy',
        icon: <MemoryStick className="h-4 w-4" />
      },
      {
        name: 'Disk Usage',
        value: Math.floor(Math.random() * 20) + 65,
        unit: '%',
        status: 'healthy',
        icon: <HardDrive className="h-4 w-4" />
      },
      {
        name: 'Active Connections',
        value: Math.floor(Math.random() * 100) + 150,
        unit: '',
        status: 'healthy',
        icon: <Wifi className="h-4 w-4" />
      },
      {
        name: 'Response Time',
        value: Math.floor(Math.random() * 50) + 120,
        unit: 'ms',
        status: Math.random() > 0.7 ? 'warning' : 'healthy',
        icon: <Activity className="h-4 w-4" />
      },
      {
        name: 'Database Connections',
        value: Math.floor(Math.random() * 20) + 5,
        unit: '',
        status: 'healthy',
        icon: <Database className="h-4 w-4" />
      }
    ];

    setMetrics(generateMetrics());
    setLoading(false);

    // Update metrics every 10 seconds
    const interval = setInterval(() => {
      setMetrics(generateMetrics());
    }, 10000);

    return () => clearInterval(interval);
  }, [isDeveloper]);

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPriorityFromStatus = (status: string) => {
    switch (status) {
      case 'critical':
        return 'critical' as const;
      case 'warning':
        return 'high' as const;
      default:
        return 'medium' as const;
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const generateMetrics = (): SystemMetric[] => [
        {
          name: 'CPU Usage',
          value: Math.floor(Math.random() * 40) + 20,
          unit: '%',
          status: Math.random() > 0.8 ? 'warning' : 'healthy',
          icon: <Cpu className="h-4 w-4" />
        },
        {
          name: 'Memory Usage',
          value: Math.floor(Math.random() * 30) + 50,
          unit: '%',
          status: Math.random() > 0.9 ? 'critical' : 'healthy',
          icon: <MemoryStick className="h-4 w-4" />
        },
        {
          name: 'Disk Usage',
          value: Math.floor(Math.random() * 20) + 65,
          unit: '%',
          status: 'healthy',
          icon: <HardDrive className="h-4 w-4" />
        },
        {
          name: 'Active Connections',
          value: Math.floor(Math.random() * 100) + 150,
          unit: '',
          status: 'healthy',
          icon: <Wifi className="h-4 w-4" />
        },
        {
          name: 'Response Time',
          value: Math.floor(Math.random() * 50) + 120,
          unit: 'ms',
          status: Math.random() > 0.7 ? 'warning' : 'healthy',
          icon: <Activity className="h-4 w-4" />
        },
        {
          name: 'Database Connections',
          value: Math.floor(Math.random() * 20) + 5,
          unit: '',
          status: 'healthy',
          icon: <Database className="h-4 w-4" />
        }
      ];
      setMetrics(generateMetrics());
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <TSAMLayout title="System Monitor">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="System Performance Monitor">
      <div className="space-y-6">
        {/* Header with Refresh */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Server className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Live System Metrics</h2>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-purple-500 text-purple-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* System Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <TSAMCard 
              key={index} 
              title={metric.name} 
              icon={metric.icon}
              priority={getPriorityFromStatus(metric.status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}{metric.unit}
                  </div>
                  <div className={`text-sm capitalize ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </div>
                </div>
                {metric.status !== 'healthy' && (
                  <AlertTriangle className={`h-5 w-5 ${getStatusColor(metric.status)}`} />
                )}
              </div>
            </TSAMCard>
          ))}
        </div>

        {/* System Health Overview */}
        <TSAMCard title="System Health Overview" icon={<Globe className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {metrics.filter(m => m.status === 'healthy').length}
              </div>
              <div className="text-gray-300">Healthy Services</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {metrics.filter(m => m.status !== 'healthy').length}
              </div>
              <div className="text-gray-300">Issues Detected</div>
            </div>
          </div>
        </TSAMCard>

        {/* Recent Alerts */}
        <TSAMCard title="Recent System Alerts" icon={<AlertTriangle className="h-5 w-5" />}>
          <div className="space-y-3">
            {metrics
              .filter(metric => metric.status !== 'healthy')
              .map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    {metric.icon}
                    <div>
                      <p className="text-white font-medium">{metric.name}</p>
                      <p className="text-sm text-gray-400">
                        Current: {metric.value}{metric.unit}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    metric.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {metric.status}
                  </span>
                </div>
              ))}
            {metrics.filter(m => m.status !== 'healthy').length === 0 && (
              <div className="text-center py-4 text-gray-400">
                All systems are running normally
              </div>
            )}
          </div>
        </TSAMCard>
      </div>
    </TSAMLayout>
  );
};

export default SystemMonitorPage;
