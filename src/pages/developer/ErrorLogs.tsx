import { logger } from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, RefreshCw, AlertTriangle, Bug, Zap } from 'lucide-react';

interface ErrorLogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'critical';
  source: 'frontend' | 'backend' | 'ai' | 'database';
  message: string;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
}

const ErrorLogs: React.FC = () => {
  const [logs, setLogs] = useState<ErrorLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ErrorLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  useEffect(() => {
    fetchErrorLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, levelFilter, sourceFilter]);

  const fetchErrorLogs = async () => {
    try {
      setLoading(true);
      // Mock error logs data
      const mockLogs: ErrorLogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'error',
          source: 'frontend',
          message: 'TypeError: Cannot read property "id" of undefined',
          stack: 'TypeError: Cannot read property "id" of undefined\n    at LeadCard.tsx:45:23',
          userAgent: 'Mozilla/5.0...',
          url: '/leads',
          userId: 'user-123'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'critical',
          source: 'database',
          message: 'infinite recursion detected in policy for relation "profiles"',
          stack: 'PostgreSQL Error: infinite recursion detected'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'warning',
          source: 'ai',
          message: 'OpenAI quota exceeded, falling back to Claude',
          userId: 'user-456'
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      logger.error('Error fetching error logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.stack && log.stack.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }

    setFilteredLogs(filtered);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-orange-100 text-orange-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'frontend': return 'bg-blue-100 text-blue-800';
      case 'backend': return 'bg-green-100 text-green-800';
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'database': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return AlertTriangle;
      case 'error': return Bug;
      case 'warning': return Zap;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Error Logs</h1>
          <p className="text-slate-400">Frontend/backend issues, AI errors, and system faults</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchErrorLogs}
            disabled={loading}
            className="border-slate-600 text-white"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-white"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm text-slate-400">Critical Errors</p>
                <p className="text-xl font-bold text-white">
                  {logs.filter(log => log.level === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-slate-400">Errors</p>
                <p className="text-xl font-bold text-white">
                  {logs.filter(log => log.level === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Warnings</p>
                <p className="text-xl font-bold text-white">
                  {logs.filter(log => log.level === 'warning').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Total Issues</p>
                <p className="text-xl font-bold text-white">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">System Error Monitor</CardTitle>
          <div className="flex gap-4 items-center mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search errors, stack traces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="ai">AI System</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredLogs.map((log) => {
                const LevelIcon = getLevelIcon(log.level);
                return (
                  <div
                    key={log.id}
                    className="p-4 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <LevelIcon className="h-4 w-4 text-red-400" />
                        <Badge className={getLevelColor(log.level)}>
                          {log.level}
                        </Badge>
                        <Badge className={getSourceColor(log.source)}>
                          {log.source}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white mb-2 font-mono">{log.message}</p>
                    
                    {log.url && (
                      <p className="text-xs text-slate-400 mb-1">URL: {log.url}</p>
                    )}
                    
                    {log.userId && (
                      <p className="text-xs text-slate-400 mb-1">User: {log.userId}</p>
                    )}
                    
                    {log.stack && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-slate-400 hover:text-white">
                          View Stack Trace
                        </summary>
                        <pre className="mt-2 p-2 bg-slate-800 rounded text-xs overflow-auto text-slate-300 font-mono">
                          {log.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                );
              })}
              
              {filteredLogs.length === 0 && !loading && (
                <div className="text-center py-8 text-slate-400">
                  No error logs found
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorLogs;
