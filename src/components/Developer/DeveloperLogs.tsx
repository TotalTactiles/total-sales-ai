import { logger } from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: string;
  event_summary: string;
  payload: any;
  visibility: string;
  agent_id?: string | null;
  ai_type?: string | null;
  error_type?: string | null;
}

const DeveloperLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [contextFilter, setContextFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [errorCounts, setErrorCounts] = useState<Record<string, number>>({});
  const { user, profile } = useAuth();

  useEffect(() => {
    if (profile?.role === 'admin' || process.env.NODE_ENV === 'development') {
      fetchLogs();
    }
  }, [profile]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, levelFilter, contextFilter, agentFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_brain_logs')
        .select('*')
        .eq('type', 'system_log')
        .order('timestamp', { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs(data || []);
      const counts: Record<string, number> = {};
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      for (const log of data || []) {
        if (log.agent_id && log.error_type && new Date(log.timestamp).getTime() > dayAgo) {
          counts[log.agent_id] = (counts[log.agent_id] || 0) + 1;
        }
      }
      setErrorCounts(counts);
    } catch (error) {
      logger.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.event_summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.payload).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.payload?.level === levelFilter);
    }

    if (contextFilter !== 'all') {
      filtered = filtered.filter(log => log.payload?.context === contextFilter);
    }

    if (agentFilter !== 'all') {
      filtered = filtered.filter(log => log.agent_id === agentFilter);
    }

    setFilteredLogs(filtered);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'debug': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salesos-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Only show to admins or in development
  if (profile?.role !== 'admin' && process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Developer Logs
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportLogs}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warn">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={contextFilter} onValueChange={setContextFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contexts</SelectItem>
              <SelectItem value="ai_system">AI System</SelectItem>
              <SelectItem value="voice_system">Voice System</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>

          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {Array.from(new Set(logs.map(l => l.agent_id).filter(Boolean))).map(id => (
                <SelectItem key={id as string} value={id as string}>{id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredLogs.map((log) => {
              const highlight = log.agent_id && errorCounts[log.agent_id] > 3;
              return (
                <div
                  key={log.id}
                  className={`p-3 border rounded-lg hover:bg-gray-50 ${highlight ? 'border-red-400' : ''}`}
                >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getLevelColor(log.payload?.level || 'info')}>
                      {log.payload?.level || 'info'}
                    </Badge>
                    {log.payload?.context && (
                      <Badge variant="outline">
                        {log.payload.context}
                      </Badge>
                    )}
                    {log.agent_id && (
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800">
                        {log.agent_id}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm font-medium mb-1">
                  {log.event_summary}
                </p>
                
                {log.payload?.data && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600">
                      View Details
                    </summary>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(log.payload.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
              );
            })}
            
            {filteredLogs.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No logs found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DeveloperLogs;
