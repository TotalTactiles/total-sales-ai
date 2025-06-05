import { logger } from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Download, RefreshCw, Brain, Zap, MessageSquare } from 'lucide-react';

interface AILogEntry {
  id: string;
  timestamp: string;
  type: 'insight' | 'action' | 'learning' | 'error';
  message: string;
  provider: 'claude' | 'openai' | 'hybrid';
  metadata: any;
}

const AIBrainLogs: React.FC = () => {
  const [logs, setLogs] = useState<AILogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AILogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');

  useEffect(() => {
    fetchAILogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, typeFilter, providerFilter]);

  const fetchAILogs = async () => {
    try {
      setLoading(true);
      // Mock AI logs data
      const mockLogs: AILogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          type: 'insight',
          message: 'Generated lead priority insights for manager dashboard',
          provider: 'claude',
          metadata: { leadCount: 45, confidence: 0.92 }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'action',
          message: 'Automated email sequence triggered for high-value leads',
          provider: 'hybrid',
          metadata: { emailsSent: 12, conversionRate: 0.23 }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          type: 'learning',
          message: 'Updated objection handling patterns based on sales call feedback',
          provider: 'openai',
          metadata: { patternsUpdated: 8, accuracy: 0.87 }
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      logger.error('Error fetching AI logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === typeFilter);
    }

    if (providerFilter !== 'all') {
      filtered = filtered.filter(log => log.provider === providerFilter);
    }

    setFilteredLogs(filtered);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'insight': return 'bg-blue-100 text-blue-800';
      case 'action': return 'bg-green-100 text-green-800';
      case 'learning': return 'bg-purple-100 text-purple-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'insight': return Brain;
      case 'action': return Zap;
      case 'learning': return MessageSquare;
      default: return Brain;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Brain Logs</h1>
          <p className="text-slate-400">Master AI insights, actions, and learning patterns</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAILogs}
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

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">AI Activity Monitor</CardTitle>
          <div className="flex gap-4 items-center mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search AI logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="insight">Insights</SelectItem>
                <SelectItem value="action">Actions</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredLogs.map((log) => {
                const TypeIcon = getTypeIcon(log.type);
                return (
                  <div
                    key={log.id}
                    className="p-4 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-cyan-400" />
                        <Badge className={getTypeColor(log.type)}>
                          {log.type}
                        </Badge>
                        <Badge variant="outline" className="text-slate-300 border-slate-600">
                          {log.provider}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white mb-2">{log.message}</p>
                    
                    {log.metadata && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-slate-400 hover:text-white">
                          View Metadata
                        </summary>
                        <pre className="mt-2 p-2 bg-slate-800 rounded text-xs overflow-auto text-slate-300">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                );
              })}
              
              {filteredLogs.length === 0 && !loading && (
                <div className="text-center py-8 text-slate-400">
                  No AI logs found
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainLogs;
