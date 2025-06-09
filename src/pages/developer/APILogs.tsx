import { logger } from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, RefreshCw, Globe, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface APILogEntry {
  id: string;
  timestamp: string | null;
  method: string;
  endpoint: string;
  status: number;
  response_time: number;
  user_id: string | null;
}

const APILogs: React.FC = () => {
  const [logs, setLogs] = useState<APILogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<APILogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { profile } = useAuth();

  useEffect(() => {
    fetchAPILogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, methodFilter, statusFilter]);

  const fetchAPILogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      logger.error('Error fetching API logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user_id && log.user_id.includes(searchTerm))
      );
    }

    if (methodFilter !== 'all') {
      filtered = filtered.filter(log => log.method === methodFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === '2xx') {
        filtered = filtered.filter(log => log.status >= 200 && log.status < 300);
      } else if (statusFilter === '4xx') {
        filtered = filtered.filter(log => log.status >= 400 && log.status < 500);
      } else if (statusFilter === '5xx') {
        filtered = filtered.filter(log => log.status >= 500);
      }
    }

    setFilteredLogs(filtered);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 300 && status < 400) return 'bg-blue-100 text-blue-800';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800';
    if (status >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportLogs = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(filteredLogs, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `api-logs-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['timestamp', 'method', 'endpoint', 'status', 'response_time', 'user_id'];
      const rows = filteredLogs.map(log => headers.map(h => `"${(log as any)[h] ?? ''}"`).join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `api-logs-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Logs</h1>
          <p className="text-slate-400">All API calls, endpoints, responses, and errors</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAPILogs}
            disabled={loading}
            className="border-slate-600 text-white"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportLogs('json')}
            className="border-slate-600 text-white"
          >
            <Download className="h-4 w-4" /> JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportLogs('csv')}
            className="border-slate-600 text-white"
          >
            <Download className="h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Total Requests</p>
                <p className="text-xl font-bold text-white">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Avg Response Time</p>
                <p className="text-xl font-bold text-white">
                  {logs.length > 0 ? Math.round(logs.reduce((acc, log) => acc + log.response_time, 0) / logs.length) : 0}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Error Rate</p>
                <p className="text-xl font-bold text-white">
                  {logs.length > 0 ? ((logs.filter(log => log.status >= 400).length / logs.length) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Unique Users</p>
                <p className="text-xl font-bold text-white">
                  {new Set(logs.map(log => log.user_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">API Request Logs</CardTitle>
          <div className="flex gap-4 items-center mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search endpoints, IPs, errors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="2xx">2xx Success</SelectItem>
                <SelectItem value="4xx">4xx Client Error</SelectItem>
                <SelectItem value="5xx">5xx Server Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getMethodColor(log.method)}>
                        {log.method}
                      </Badge>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                      <span className="text-sm font-mono text-white">{log.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{log.response_time}ms</span>
                      {log.timestamp && (
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    {log.user_id && <p>User: {log.user_id}</p>}
                  </div>
                </div>
              ))}
              
              {filteredLogs.length === 0 && !loading && (
                <div className="text-center py-8 text-slate-400">
                  No API logs found
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default APILogs;
