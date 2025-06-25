
import React, { useState } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { useTSAM } from '@/hooks/useTSAM';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Bug, Info, CheckCircle, Search } from 'lucide-react';

const LogsPage: React.FC = () => {
  const { logs, loading, isDeveloper, markLogResolved } = useTSAM();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.priority === filter;
    const matchesSearch = search === '' || 
      log.type.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(log.metadata).toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getLogIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Bug className="h-4 w-4 text-red-400" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'medium':
        return <Info className="h-4 w-4 text-blue-400" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <TSAMLayout title="System Logs">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="System Logs">
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/10 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48 bg-white/10 border-gray-600 text-white">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TSAMCard title={`System Logs (${filteredLogs.length})`}>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No logs found matching your criteria.
            </div>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  log.priority === 'critical' ? 'border-l-red-500 bg-red-50/5' :
                  log.priority === 'high' ? 'border-l-orange-500 bg-orange-50/5' :
                  log.priority === 'medium' ? 'border-l-blue-500 bg-blue-50/5' :
                  'border-l-green-500 bg-green-50/5'
                } ${log.resolved ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getLogIcon(log.priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{log.type}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          log.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                          log.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                          log.priority === 'medium' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {log.priority}
                        </span>
                        {log.resolved && (
                          <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      {Object.keys(log.metadata).length > 0 && (
                        <pre className="text-xs text-gray-400 bg-black/20 p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                  {!log.resolved && (
                    <Button
                      size="sm"
                      onClick={() => markLogResolved(log.id)}
                      className="bg-green-600 hover:bg-green-700 text-white ml-4"
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </TSAMCard>
    </TSAMLayout>
  );
};

export default LogsPage;
