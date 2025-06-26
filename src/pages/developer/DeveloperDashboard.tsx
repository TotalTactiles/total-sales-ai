
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Brain,
  Zap,
  Code,
  Server,
  Database
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

const DeveloperDashboard = () => {
  const { profile } = useAuth();
  const [systemHealth, setSystemHealth] = useState(98);

  // Mock system stats
  const systemStats = {
    uptime: '99.8%',
    activeUsers: 156,
    apiCalls: 12420,
    errorRate: 0.02
  };

  const recentLogs = [
    { id: 1, type: 'info', message: 'User authentication successful', timestamp: '2 minutes ago', component: 'auth' },
    { id: 2, type: 'warning', message: 'High memory usage detected', timestamp: '5 minutes ago', component: 'api' },
    { id: 3, type: 'error', message: 'Database connection timeout', timestamp: '12 minutes ago', component: 'database' },
    { id: 4, type: 'success', message: 'Auto-scaling event completed', timestamp: '18 minutes ago', component: 'infrastructure' }
  ];

  const jarvisInsights = [
    { type: 'optimization', message: 'API response time improved by 15% after last deployment' },
    { type: 'alert', message: 'Memory usage trending upward - consider scaling' },
    { type: 'success', message: 'Zero critical errors in the last 24 hours' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DeveloperNavigation />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
            <p className="text-gray-400">System monitoring and control, {profile?.full_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700">
              <Brain className="h-3 w-3 mr-1" />
              JARVIS Online
            </Badge>
            <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-700">
              System Health: {systemHealth}%
            </Badge>
          </div>
        </div>

        {/* System Health Bar */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              TSAM System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${systemHealth}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Uptime</p>
                <p className="text-green-400 font-semibold">{systemStats.uptime}</p>
              </div>
              <div>
                <p className="text-gray-400">Active Users</p>
                <p className="text-blue-400 font-semibold">{systemStats.activeUsers}</p>
              </div>
              <div>
                <p className="text-gray-400">API Calls/hr</p>
                <p className="text-purple-400 font-semibold">{systemStats.apiCalls}</p>
              </div>
              <div>
                <p className="text-gray-400">Error Rate</p>
                <p className="text-yellow-400 font-semibold">{systemStats.errorRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* JARVIS AI Brain */}
        <Card className="mb-6 bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 animate-pulse" />
              JARVIS AI Brain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jarvisInsights.map((insight, index) => (
                <div key={index} className={`p-3 rounded-lg border border-opacity-50 ${
                  insight.type === 'success' ? 'bg-green-900 bg-opacity-50 border-green-600' :
                  insight.type === 'alert' ? 'bg-yellow-900 bg-opacity-50 border-yellow-600' :
                  'bg-blue-900 bg-opacity-50 border-blue-600'
                }`}>
                  <div className="flex items-start gap-2">
                    {insight.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" /> :
                     insight.type === 'alert' ? <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" /> :
                     <Zap className="h-4 w-4 text-blue-400 mt-0.5" />}
                    <p className="text-sm text-gray-200">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent System Logs */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="h-5 w-5" />
              Recent System Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    {log.type === 'error' ? <AlertTriangle className="h-4 w-4 text-red-400" /> :
                     log.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-yellow-400" /> :
                     log.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-400" /> :
                     <Activity className="h-4 w-4 text-blue-400" />}
                    <div>
                      <p className="text-sm text-gray-200">{log.message}</p>
                      <p className="text-xs text-gray-500">{log.component} • {log.timestamp}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      log.type === 'error' ? 'border-red-500 text-red-400' :
                      log.type === 'warning' ? 'border-yellow-500 text-yellow-400' :
                      log.type === 'success' ? 'border-green-500 text-green-400' :
                      'border-blue-500 text-blue-400'
                    }
                  >
                    {log.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
