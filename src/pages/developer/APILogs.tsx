
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Search, 
  RefreshCw, 
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter
} from 'lucide-react';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface APILog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: number;
  responseTime: number;
  timestamp: Date;
  userAgent: string;
  ip: string;
  requestSize: number;
  responseSize: number;
  error?: string;
}

const APILogs: React.FC = () => {
  const { execute, isLoading } = useAsyncOperation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [logs, setLogs] = useState<APILog[]>([
    {
      id: '1',
      method: 'POST',
      endpoint: '/api/auth/login',
      status: 200,
      responseTime: 145,
      timestamp: new Date(Date.now() - 1000 * 30),
      userAgent: 'Mozilla/5.0 (Chrome)',
      ip: '192.168.1.100',
      requestSize: 256,
      responseSize: 512
    },
    {
      id: '2',
      method: 'GET',
      endpoint: '/api/leads',
      status: 200,
      responseTime: 89,
      timestamp: new Date(Date.now() - 1000 * 60),
      userAgent: 'Mozilla/5.0 (Chrome)',
      ip: '192.168.1.101',
      requestSize: 0,
      responseSize: 2048
    },
    {
      id: '3',
      method: 'POST',
      endpoint: '/api/leads/create',
      status: 500,
      responseTime: 2340,
      timestamp: new Date(Date.now() - 1000 * 90),
      userAgent: 'Mozilla/5.0 (Firefox)',
      ip: '192.168.1.102',
      requestSize: 1024,
      responseSize: 256,
      error: 'Database connection timeout'
    },
    {
      id: '4',
      method: 'PUT',
      endpoint: '/api/users/profile',
      status: 401,
      responseTime: 45,
      timestamp: new Date(Date.now() - 1000 * 120),
      userAgent: 'Mozilla/5.0 (Safari)',
      ip: '192.168.1.103',
      requestSize: 512,
      responseSize: 128,
      error: 'Unauthorized access'
    },
    {
      id: '5',
      method: 'GET',
      endpoint: '/api/dashboard/stats',
      status: 200,
      responseTime: 234,
      timestamp: new Date(Date.now() - 1000 * 150),
      userAgent: 'Mozilla/5.0 (Chrome)',
      ip: '192.168.1.104',
      requestSize: 0,
      responseSize: 4096
    },
    {
      id: '6',
      method: 'DELETE',
      endpoint: '/api/leads/123',
      status: 404,
      responseTime: 67,
      timestamp: new Date(Date.now() - 1000 * 180),
      userAgent: 'Mozilla/5.0 (Edge)',
      ip: '192.168.1.105',
      requestSize: 0,
      responseSize: 256,
      error: 'Lead not found'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: APILog = {
        id: Date.now().toString(),
        method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)] as any,
        endpoint: ['/api/leads', '/api/auth/check', '/api/dashboard/stats', '/api/users'][Math.floor(Math.random() * 4)],
        status: [200, 201, 400, 401, 404, 500][Math.floor(Math.random() * 6)],
        responseTime: Math.floor(Math.random() * 1000) + 50,
        timestamp: new Date(),
        userAgent: 'Mozilla/5.0 (Chrome)',
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        requestSize: Math.floor(Math.random() * 2048),
        responseSize: Math.floor(Math.random() * 4096)
      };
      
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ip.includes(searchTerm);
    
    let matchesFilter = true;
    if (filterStatus === '2xx') matchesFilter = log.status >= 200 && log.status < 300;
    else if (filterStatus === '4xx') matchesFilter = log.status >= 400 && log.status < 500;
    else if (filterStatus === '5xx') matchesFilter = log.status >= 500;
    
    return matchesSearch && matchesFilter;
  });

  const refreshLogs = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Generate some new logs
      const newLogs = Array.from({ length: 5 }, (_, i) => ({
        id: (Date.now() + i).toString(),
        method: ['GET', 'POST', 'PUT'][Math.floor(Math.random() * 3)] as any,
        endpoint: `/api/endpoint${i}`,
        status: [200, 201, 400][Math.floor(Math.random() * 3)],
        responseTime: Math.floor(Math.random() * 500) + 50,
        timestamp: new Date(),
        userAgent: 'Mozilla/5.0 (Chrome)',
        ip: `192.168.1.${100 + i}`,
        requestSize: Math.floor(Math.random() * 1024),
        responseSize: Math.floor(Math.random() * 2048)
      }));
      setLogs(prev => [...newLogs, ...prev.slice(0, 45)]);
    }, 'sync');
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status >= 400 && status < 500) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (status >= 500) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="h-4 w-4" />;
    if (status >= 400 && status < 500) return <AlertTriangle className="h-4 w-4" />;
    if (status >= 500) return <XCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'POST': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DELETE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const stats = {
    total: logs.length,
    success: logs.filter(log => log.status >= 200 && log.status < 300).length,
    errors: logs.filter(log => log.status >= 400).length,
    avgResponseTime: Math.round(logs.reduce((sum, log) => sum + log.responseTime, 0) / logs.length)
  };

  if (isLoading) {
    return <LoadingManager type="sync" message="Refreshing API logs..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Request Logs</h1>
          <p className="text-gray-400 mt-2">Monitor API requests, responses, and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={refreshLogs}
            disabled={isLoading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Successful</p>
                <p className="text-2xl font-bold text-green-400">{stats.success}</p>
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
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Response</p>
                <p className="text-2xl font-bold text-white">{stats.avgResponseTime}ms</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by endpoint, method, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="2xx">2xx Success</option>
              <option value="4xx">4xx Client Error</option>
              <option value="5xx">5xx Server Error</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* API Logs */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Request Logs ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className={getMethodColor(log.method)}>
                      {log.method}
                    </Badge>
                    <span className="text-white font-mono text-sm">{log.endpoint}</span>
                    <Badge className={getStatusColor(log.status)}>
                      {getStatusIcon(log.status)}
                      {log.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">{log.responseTime}ms</span>
                    <span className="text-gray-400">{log.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                  <div>
                    <span className="text-gray-500">IP:</span> {log.ip}
                  </div>
                  <div>
                    <span className="text-gray-500">Request:</span> {log.requestSize}b
                  </div>
                  <div>
                    <span className="text-gray-500">Response:</span> {log.responseSize}b
                  </div>
                  <div>
                    <span className="text-gray-500">Agent:</span> {log.userAgent.substring(0, 20)}...
                  </div>
                </div>
                
                {log.error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="text-red-400 text-sm">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      {log.error}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <Globe className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Logs Found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No logs match your current filters.' 
                    : 'API logs will appear here as requests are made.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APILogs;
