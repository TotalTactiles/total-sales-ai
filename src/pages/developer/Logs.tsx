
import React, { useState, useEffect } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { useTSAM } from '@/hooks/useTSAM';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Monitor, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';

const LogsPage: React.FC = () => {
  const { isDeveloper, logs, loading, refreshData } = useTSAM();
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.metadata).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(log => log.priority === priorityFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === typeFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, priorityFilter, typeFilter]);

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const getLogIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-400" />;
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

  const uniqueTypes = [...new Set(logs.map(log => log.type))];

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
    <TSAMLayout title="Real-time System Logs">
      <div className="space-y-6">
        {/* Filters and Controls */}
        <TSAMCard title="Log Controls" icon={<Filter className="h-5 w-5" />}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] bg-white/10 border-gray-600 text-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] bg-white/10 border-gray-600 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={refreshData}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </TSAMCard>

        {/* Log Feed */}
        <TSAMCard title={`System Logs (${filteredLogs.length})`} icon={<Monitor className="h-5 w-5" />}>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No logs found matching your criteria.
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={log.id} className="p-4 bg-white/5 rounded-lg border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getLogIcon(log.priority)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{log.type}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            log.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                            log.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            log.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {log.priority}
                          </span>
                          {log.resolved && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                              Resolved
                            </span>
                          )}
                        </div>
                        
                        {Object.keys(log.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-sm text-purple-400 cursor-pointer hover:text-purple-300">
                              View Details
                            </summary>
                            <pre className="text-xs text-gray-400 bg-black/20 p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      {log.user_id && (
                        <p className="text-xs text-gray-500 mt-1">
                          User: {log.user_id.substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TSAMCard>
      </div>
    </TSAMLayout>
  );
};

export default LogsPage;
