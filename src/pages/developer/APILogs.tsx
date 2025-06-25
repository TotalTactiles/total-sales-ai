
import React, { useState, useEffect } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Code, 
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  Globe
} from 'lucide-react';

interface APILogEntry {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  status: number;
  responseTime: number;
  timestamp: Date;
  userId?: string;
  requestBody?: any;
  responseBody?: any;
  error?: string;
  service: 'supabase' | 'make' | 'external';
}

const APILogsPage: React.FC = () => {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<APILogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<APILogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const isDeveloper = profile?.role === 'developer';

  useEffect(() => {
    if (!isDeveloper) return;

    // Generate mock API logs
    const mockLogs: APILogEntry[] = [
      {
        id: '1',
        method: 'POST',
        endpoint: '/api/leads',
        status: 201,
        responseTime: 245,
        timestamp: new Date(Date.now() - 300000),
        userId: 'user123',
        service: 'supabase',
        requestBody: { name: 'John Doe', email: 'john@example.com' }
      },
      {
        id: '2',
        method: 'GET',
        endpoint: '/api/dashboard/stats',
        status: 200,
        responseTime: 123,
        timestamp: new Date(Date.now() - 600000),
        service: 'supabase'
      },
      {
        id: '3',
        method: 'POST',
        endpoint: '/webhook/lead-assignment',
        status: 500,
        responseTime: 5420,
        timestamp: new Date(Date.now() - 900000),
        service: 'make',
        error: 'Timeout connecting to external CRM'
      },
      {
        id: '4',
        method: 'PUT',
        endpoint: '/api/users/profile',
        status: 200,
        responseTime: 189,
        timestamp: new Date(Date.now() - 1200000),
        userId: 'user456',
        service: 'supabase'
      },
      {
        id: '5',
        method: 'GET',
        endpoint: '/api/ai/suggestions',
        status: 429,
        responseTime: 89,
        timestamp: new Date(Date.now() - 1500000),
        service: 'external',
        error: 'Rate limit exceeded'
      }
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    setLoading(false);
  }, [isDeveloper]);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.error && log.error.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'success') {
        filtered = filtered.filter(log => log.status >= 200 && log.status < 300);
      } else if (statusFilter === 'error') {
        filtered = filtered.filter(log => log.status >= 400);
      } else if (statusFilter === 'warning') {
        filtered = filtered.filter(log => log.status >= 300 && log.status < 400);
      }
    }

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(log => log.service === serviceFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, statusFilter, serviceFilter]);

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) {
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    } else if (status >= 400) {
      return <XCircle className="h-4 w-4 text-red-400" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return 'text-green-400';
    } else if (status >= 400) {
      return 'text-red-400';
    } else {
      return 'text-yellow-400';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500/20 text-blue-400';
      case 'POST':
        return 'bg-green-500/20 text-green-400';
      case 'PUT':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'DELETE':
        return 'bg-red-500/20 text-red-400';
      case 'PATCH':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'supabase':
        return <Database className="h-4 w-4 text-green-400" />;
      case 'make':
        return <Code className="h-4 w-4 text-blue-400" />;
      case 'external':
        return <Globe className="h-4 w-4 text-purple-400" />;
      default:
        return <Code className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <TSAMLayout title="API Logs">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="API & Integration Logs">
      <div className="space-y-6">
        {/* Filters */}
        <TSAMCard title="Log Filters" icon={<Search className="h-5 w-5" />}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search endpoints, methods, errors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white/10 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success (2xx)</SelectItem>
                <SelectItem value="warning">Warning (3xx)</SelectItem>
                <SelectItem value="error">Error (4xx/5xx)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[140px] bg-white/10 border-gray-600 text-white">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="supabase">Supabase</SelectItem>
                <SelectItem value="make">Make.com</SelectItem>
                <SelectItem value="external">External APIs</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </TSAMCard>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TSAMCard title="Total Requests" icon={<Code className="h-4 w-4" />}>
            <div className="text-2xl font-bold text-white">{logs.length}</div>
          </TSAMCard>
          
          <TSAMCard title="Success Rate" icon={<CheckCircle className="h-4 w-4" />}>
            <div className="text-2xl font-bold text-green-400">
              {Math.round((logs.filter(l => l.status >= 200 && l.status < 300).length / logs.length) * 100)}%
            </div>
          </TSAMCard>
          
          <TSAMCard title="Avg Response" icon={<Clock className="h-4 w-4" />}>
            <div className="text-2xl font-bold text-blue-400">
              {Math.round(logs.reduce((acc, log) => acc + log.responseTime, 0) / logs.length)}ms
            </div>
          </TSAMCard>
          
          <TSAMCard title="Error Count" icon={<XCircle className="h-4 w-4" />}>
            <div className="text-2xl font-bold text-red-400">
              {logs.filter(l => l.status >= 400).length}
            </div>
          </TSAMCard>
        </div>

        {/* API Logs */}
        <TSAMCard title={`API Request Logs (${filteredLogs.length})`} icon={<Database className="h-5 w-5" />}>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No API logs found matching your criteria.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      {getServiceIcon(log.service)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-mono ${getMethodColor(log.method)}`}>
                            {log.method}
                          </span>
                          <span className="text-white font-medium">{log.endpoint}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className={getStatusColor(log.status)}>
                            {log.status}
                          </span>
                          <span>{log.responseTime}ms</span>
                          <span className="capitalize">{log.service}</span>
                          {log.userId && <span>User: {log.userId.substring(0, 8)}...</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="h-3 w-3" />
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  {log.error && (
                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400 mb-2">
                      <strong>Error:</strong> {log.error}
                    </div>
                  )}

                  {(log.requestBody || log.responseBody) && (
                    <details className="mt-2">
                      <summary className="text-sm text-purple-400 cursor-pointer hover:text-purple-300">
                        View Request/Response Data
                      </summary>
                      <div className="mt-2 space-y-2">
                        {log.requestBody && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Request Body:</p>
                            <pre className="text-xs text-gray-300 bg-black/20 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.requestBody, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.responseBody && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Response Body:</p>
                            <pre className="text-xs text-gray-300 bg-black/20 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.responseBody, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </TSAMCard>
      </div>
    </TSAMLayout>
  );
};

export default APILogsPage;
