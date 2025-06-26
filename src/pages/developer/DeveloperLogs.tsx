
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  AlertCircle,
  Zap
} from 'lucide-react';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';

const DeveloperLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock TSAM logs data
  const tsamLogs = [
    { id: 1, type: 'auth_success', priority: 'low', message: 'User login successful for manager@tsam.com', timestamp: '2024-01-24T08:30:00Z', component: 'auth', resolved: true },
    { id: 2, type: 'lead_import', priority: 'medium', message: 'Bulk lead import completed: 25 leads processed', timestamp: '2024-01-24T09:15:00Z', component: 'crm', resolved: true },
    { id: 3, type: 'api_error', priority: 'high', message: 'External API rate limit exceeded for Salesforce integration', timestamp: '2024-01-24T10:45:00Z', component: 'integration', resolved: false },
    { id: 4, type: 'system_alert', priority: 'critical', message: 'Database connection timeout detected', timestamp: '2024-01-24T11:22:00Z', component: 'database', resolved: false },
    { id: 5, type: 'ai_optimization', priority: 'medium', message: 'Lead scoring algorithm updated with new parameters', timestamp: '2024-01-24T12:10:00Z', component: 'ai', resolved: true },
    { id: 6, type: 'user_activity', priority: 'low', message: 'Sales rep completed onboarding process', timestamp: '2024-01-24T13:05:00Z', component: 'onboarding', resolved: true },
    { id: 7, type: 'performance_warning', priority: 'high', message: 'Memory usage exceeding 85% threshold', timestamp: '2024-01-24T14:20:00Z', component: 'system', resolved: false },
    { id: 8, type: 'feature_flag', priority: 'low', message: 'Feature flag "advanced_analytics" enabled for beta users', timestamp: '2024-01-24T15:30:00Z', component: 'feature', resolved: true }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'auth_success':
      case 'user_activity':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'api_error':
      case 'system_alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'performance_warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'ai_optimization':
        return <Zap className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-900 text-red-300 border-red-700';
      case 'high': return 'bg-orange-900 text-orange-300 border-orange-700';
      case 'medium': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      case 'low': return 'bg-green-900 text-green-300 border-green-700';
      default: return 'bg-gray-900 text-gray-300 border-gray-700';
    }
  };

  const filteredLogs = tsamLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.component.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesPriority = filterPriority === 'all' || log.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DeveloperNavigation />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">TSAM System Logs</h1>
            <p className="text-gray-400">Monitor system events and troubleshoot issues</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-700">
              {filteredLogs.length} Logs
            </Badge>
            <Button variant="outline" className="border-green-600 text-green-400">
              Export Logs
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white"
              >
                <option value="all">All Types</option>
                <option value="auth_success">Auth Success</option>
                <option value="api_error">API Error</option>
                <option value="system_alert">System Alert</option>
                <option value="ai_optimization">AI Optimization</option>
                <option value="performance_warning">Performance Warning</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterPriority('all');
                }}
                className="border-gray-600 text-gray-300"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              System Logs ({filteredLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(log.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-200 mb-1">{log.message}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{log.component}</span>
                          <span>•</span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className={getPriorityColor(log.priority)}>
                          {log.priority}
                        </Badge>
                        {log.resolved ? (
                          <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700">
                            Resolved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-900 text-red-300 border-red-700">
                            Open
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperLogs;
