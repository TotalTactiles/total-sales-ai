
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { novaSystemMonitor } from '@/services/ai/novaSystemMonitor';
import { logger } from '@/utils/logger';

const NovaSystemStatus: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState({ healthy: true, errors: 0, activeRetries: 0 });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Initialize Nova monitoring
    novaSystemMonitor.initialize();
    
    const updateStatus = () => {
      const status = novaSystemMonitor.getSystemStatus();
      setSystemStatus(status);
      setLastUpdate(new Date());
      logger.debug('Nova status updated:', status, 'nova');
    };

    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000);
    updateStatus(); // Initial update

    return () => {
      clearInterval(interval);
    };
  }, []);

  const toggleMonitoring = () => {
    if (isMonitoring) {
      novaSystemMonitor.stop();
      setIsMonitoring(false);
      logger.info('Nova monitoring disabled', {}, 'nova');
    } else {
      novaSystemMonitor.initialize();
      setIsMonitoring(true);
      logger.info('Nova monitoring enabled', {}, 'nova');
    }
  };

  const getStatusColor = () => {
    if (!isMonitoring) return 'bg-gray-500';
    if (systemStatus.healthy) return 'bg-green-500';
    if (systemStatus.errors > 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (!isMonitoring) return 'DISABLED';
    if (systemStatus.healthy) return 'HEALTHY';
    if (systemStatus.errors > 0) return 'ISSUES DETECTED';
    return 'CRITICAL';
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Nova AI System Monitor
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMonitoring}
            className="text-slate-300 hover:text-white"
          >
            {isMonitoring ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">System Status</span>
            <Badge className={`${getStatusColor()} text-white animate-pulse`}>
              {getStatusText()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{systemStatus.errors}</div>
              <div className="text-xs text-slate-400">Active Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{systemStatus.activeRetries}</div>
              <div className="text-xs text-slate-400">Retries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {systemStatus.healthy ? <CheckCircle className="h-6 w-6 mx-auto" /> : <AlertTriangle className="h-6 w-6 mx-auto" />}
              </div>
              <div className="text-xs text-slate-400">Health</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-600">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Last Update: {lastUpdate.toLocaleTimeString()}</span>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>Auto-Monitoring</span>
              </div>
            </div>
          </div>

          {systemStatus.errors > 0 && (
            <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Nova detected {systemStatus.errors} system issues</span>
              </div>
              <p className="text-xs text-yellow-300 mt-1">
                Auto-repair attempts: {systemStatus.activeRetries}
              </p>
            </div>
          )}

          {!isMonitoring && (
            <div className="p-3 bg-gray-900/30 border border-gray-600 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <EyeOff className="h-4 w-4" />
                <span>System monitoring is disabled</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click the eye icon to enable real-time monitoring
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NovaSystemStatus;
