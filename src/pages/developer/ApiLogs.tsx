
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Download, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ApiLog {
  id: string;
  timestamp: Date;
  method: string;
  endpoint: string;
  status: number;
  responseTime: number;
  userAgent?: string;
  errorMessage?: string;
}

const ApiLogs: React.FC = () => {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ApiLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApiLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, selectedStatus, logs]);

  const loadApiLogs = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for now - in real implementation, this would come from your API logs table
      const mockLogs: ApiLog[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 300000),
          method: 'POST',
          endpoint: '/api/ai/chat',
          status: 200,
          responseTime: 1234,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 600000),
          method: 'GET',
          endpoint: '/api/leads',
          status: 200,
          responseTime: 456,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 900000),
          method: 'POST',
          endpoint: '/api/ai/agent-task',
          status: 500,
          responseTime: 5000,
          errorMessage: 'Relevance AI timeout',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 1200000),
          method: 'PUT',
          endpoint: '/api/leads/update',
          status: 429,
          responseTime: 234,
          errorMessage: 'Rate limit exceeded',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        }
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to load API logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.errorMessage && log.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatus !== 'all') {
      const statusCode = parseInt(selectedStatus);
      filtered = filtered.filter(log => Math.floor(log.status / 100) === Math.floor(statusCode / 100));
    }

    setFilteredLogs(filtered);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="h-4 w-4" />;
    if (status >= 400 && status < 500) return <AlertTriangle className="h-4 w-4" />;
    if (status >= 500) return <XCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Method', 'Endpoint', 'Status', 'Response Time (ms)', 'Error Message'],
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.method,
        log.endpoint,
        log.status.toString(),
        log.responseTime.toString(),
        log.errorMessage || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Logs</h1>
          <p className="text-muted-foreground">Monitor and analyze API request history</p>
        </div>
        <Button onClick={exportLogs}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search endpoints, methods, or errors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="200">2xx Success</option>
              <option value="400">4xx Client Error</option>
              <option value="500">5xx Server Error</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Requests</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logs.length} requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading logs...</div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={getStatusColor(log.status)}>
                        {getStatusIcon(log.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{log.method}</Badge>
                          <span className="font-mono text-sm">{log.endpoint}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className={getStatusColor(log.status)}>
                        Status: {log.status}
                      </div>
                      <div>
                        {log.responseTime}ms
                      </div>
                    </div>
                  </div>
                  {log.errorMessage && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      Error: {log.errorMessage}
                    </div>
                  )}
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No logs found matching your criteria
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiLogs;
