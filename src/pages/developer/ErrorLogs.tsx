
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Clock,
  Code,
  Bug,
  Zap
} from 'lucide-react';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface ErrorLog {
  id: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  stack: string;
  component: string;
  timestamp: Date;
  resolved: boolean;
  userId?: string;
}

const ErrorLogs: React.FC = () => {
  const { execute, isLoading } = useAsyncOperation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [errors, setErrors] = useState<ErrorLog[]>([
    {
      id: '1',
      level: 'critical',
      message: 'Database connection timeout',
      stack: 'Error: Connection timeout\n  at DatabaseService.connect (db.ts:45)\n  at AuthService.validateUser (auth.ts:23)',
      component: 'AuthService',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      resolved: false,
      userId: 'user_123'
    },
    {
      id: '2',
      level: 'high',
      message: 'API rate limit exceeded',
      stack: 'Error: Rate limit exceeded\n  at APIClient.request (api.ts:67)\n  at LeadService.fetchLeads (leads.ts:34)',
      component: 'APIClient',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      resolved: true
    },
    {
      id: '3',
      level: 'medium',
      message: 'Component render error',
      stack: 'TypeError: Cannot read property of undefined\n  at LeadCard.render (LeadCard.tsx:89)\n  at React.Component.render',
      component: 'LeadCard',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      resolved: false
    },
    {
      id: '4',
      level: 'low',
      message: 'Warning: Deprecated API usage',
      stack: 'Warning: Using deprecated API endpoint\n  at ReportService.generate (reports.ts:112)',
      component: 'ReportService',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      resolved: false
    }
  ]);

  const filteredErrors = errors.filter(error => {
    const matchesSearch = error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.component.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'all' || error.level === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const refreshLogs = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate new error
      const newError: ErrorLog = {
        id: Date.now().toString(),
        level: 'medium',
        message: 'Memory usage spike detected',
        stack: 'Warning: High memory usage\n  at MemoryMonitor.check (monitor.ts:45)',
        component: 'MemoryMonitor',
        timestamp: new Date(),
        resolved: false
      };
      setErrors(prev => [newError, ...prev.slice(0, 9)]);
    }, 'sync');
  };

  const resolveError = (errorId: string) => {
    setErrors(prev => prev.map(error => 
      error.id === errorId ? { ...error, resolved: true } : error
    ));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'high': return <Zap className="h-4 w-4 text-orange-400" />;
      case 'medium': return <Bug className="h-4 w-4 text-yellow-400" />;
      case 'low': return <Code className="h-4 w-4 text-blue-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return <LoadingManager type="sync" message="Refreshing error logs..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Error Debug Console</h1>
          <p className="text-gray-400 mt-2">Monitor and resolve system errors and exceptions</p>
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
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Errors</p>
                <p className="text-2xl font-bold text-white">{errors.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">
                  {errors.filter(e => e.level === 'critical').length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-green-400">
                  {errors.filter(e => e.resolved).length}
                </p>
              </div>
              <Bug className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {errors.filter(e => !e.resolved).length}
                </p>
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
                placeholder="Search errors, components, or stack traces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Error List */}
      <div className="space-y-4">
        {filteredErrors.map((error) => (
          <Card key={error.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getLevelIcon(error.level)}
                  <div>
                    <CardTitle className="text-white text-lg">{error.message}</CardTitle>
                    <p className="text-gray-400 text-sm">
                      {error.component} • {error.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getLevelColor(error.level)}>
                    {error.level.toUpperCase()}
                  </Badge>
                  {error.resolved ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      RESOLVED
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => resolveError(error.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="text-gray-300 text-sm font-medium mb-2">Stack Trace:</h4>
                <pre className="text-gray-400 text-xs whitespace-pre-wrap font-mono overflow-x-auto">
                  {error.stack}
                </pre>
              </div>
              {error.userId && (
                <div className="mt-4 text-sm">
                  <span className="text-gray-400">Affected User: </span>
                  <span className="text-blue-400">{error.userId}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredErrors.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <Bug className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Errors Found</h3>
              <p className="text-gray-500">
                {searchTerm || filterLevel !== 'all' 
                  ? 'No errors match your current filters.' 
                  : 'All systems are running smoothly!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ErrorLogs;
