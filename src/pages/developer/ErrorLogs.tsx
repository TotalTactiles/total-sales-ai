
import React, { useState, useEffect } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertTriangle, 
  Bug, 
  Search,
  RefreshCw,
  ExternalLink,
  Clock,
  User,
  Code
} from 'lucide-react';

interface ErrorLog {
  id: string;
  title: string;
  message: string;
  stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  userId?: string;
  timestamp: Date;
  resolved: boolean;
  reproSteps?: string[];
  aiSuggestion?: string;
}

const ErrorLogsPage: React.FC = () => {
  const { profile } = useAuth();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [filteredErrors, setFilteredErrors] = useState<ErrorLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const isDeveloper = profile?.role === 'developer';

  useEffect(() => {
    if (!isDeveloper) return;

    // Generate mock error logs
    const mockErrors: ErrorLog[] = [
      {
        id: '1',
        title: 'Lead Assignment API Timeout',
        message: 'Failed to assign lead to sales rep due to API timeout',
        severity: 'high',
        component: 'LeadManager.tsx',
        userId: 'user123',
        timestamp: new Date(Date.now() - 3600000),
        resolved: false,
        reproSteps: [
          'Navigate to lead management',
          'Select multiple leads',
          'Click assign to rep'
        ],
        aiSuggestion: 'Implement retry logic with exponential backoff. Consider adding lead assignment queue.'
      },
      {
        id: '2',
        title: 'Dashboard Widget Crash',
        message: 'Uncaught TypeError: Cannot read property of undefined',
        stack: 'Error at KPIWidget.tsx:45\n  at Dashboard.tsx:120',
        severity: 'medium',
        component: 'KPIWidget.tsx',
        timestamp: new Date(Date.now() - 7200000),
        resolved: true,
        aiSuggestion: 'Add null checks and loading states for async data.'
      },
      {
        id: '3',
        title: 'Authentication State Mismatch',
        message: 'User session expired but UI still shows authenticated state',
        severity: 'critical',
        component: 'AuthProvider.tsx',
        userId: 'user456',
        timestamp: new Date(Date.now() - 1800000),
        resolved: false,
        reproSteps: [
          'Login to application',
          'Leave tab idle for 1 hour',
          'Try to perform authenticated action'
        ],
        aiSuggestion: 'Implement proper session monitoring and automatic logout on token expiry.'
      }
    ];

    setErrors(mockErrors);
    setFilteredErrors(mockErrors);
    setLoading(false);
  }, [isDeveloper]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = errors.filter(error =>
        error.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.component.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredErrors(filtered);
    } else {
      setFilteredErrors(errors);
    }
  }, [searchTerm, errors]);

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50/10 text-red-400';
      case 'high':
        return 'border-orange-500 bg-orange-50/10 text-orange-400';
      case 'medium':
        return 'border-blue-500 bg-blue-50/10 text-blue-400';
      case 'low':
        return 'border-green-500 bg-green-50/10 text-green-400';
      default:
        return 'border-gray-500 bg-gray-50/10 text-gray-400';
    }
  };

  const handleResolve = (errorId: string) => {
    setErrors(prev => prev.map(error => 
      error.id === errorId ? { ...error, resolved: true } : error
    ));
  };

  if (loading) {
    return (
      <TSAMLayout title="Error Insights">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="Aggregated Error Insights">
      <div className="space-y-6">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-6 w-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">
              Error Analysis ({filteredErrors.length})
            </h2>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search errors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-gray-600 text-white"
              />
            </div>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['critical', 'high', 'medium', 'low'] as const).map(severity => {
            const count = errors.filter(e => e.severity === severity && !e.resolved).length;
            return (
              <TSAMCard 
                key={severity} 
                title={`${severity.charAt(0).toUpperCase() + severity.slice(1)} Priority`}
                icon={<AlertTriangle className="h-4 w-4" />}
                priority={severity === 'critical' ? 'critical' : severity === 'high' ? 'high' : 'medium'}
              >
                <div className="text-2xl font-bold text-white">{count}</div>
              </TSAMCard>
            );
          })}
        </div>

        {/* Error List */}
        <div className="space-y-4">
          {filteredErrors.map((error) => (
            <div 
              key={error.id}
              className={`p-6 rounded-lg border-l-4 ${getSeverityColor(error.severity)} backdrop-blur-sm`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{error.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${error.severity === 'critical' ? 'red' : error.severity === 'high' ? 'orange' : error.severity === 'medium' ? 'blue' : 'green'}-500/20`}>
                      {error.severity}
                    </span>
                    {error.resolved && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                        Resolved
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 mb-3">{error.message}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      {error.component}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {error.timestamp.toLocaleString()}
                    </div>
                    {error.userId && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {error.userId}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!error.resolved && (
                    <Button
                      size="sm"
                      onClick={() => handleResolve(error.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Resolved
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Stack Trace */}
              {error.stack && (
                <details className="mb-3">
                  <summary className="text-sm text-purple-400 cursor-pointer hover:text-purple-300">
                    View Stack Trace
                  </summary>
                  <pre className="text-xs text-gray-400 bg-black/20 p-3 rounded mt-2 overflow-x-auto">
                    {error.stack}
                  </pre>
                </details>
              )}

              {/* Reproduction Steps */}
              {error.reproSteps && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-white mb-2">Reproduction Steps:</h4>
                  <ol className="text-sm text-gray-300 list-decimal list-inside space-y-1">
                    {error.reproSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* AI Suggestion */}
              {error.aiSuggestion && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                  <h4 className="text-sm font-medium text-purple-400 mb-1">🤖 AI Recommendation:</h4>
                  <p className="text-sm text-gray-300">{error.aiSuggestion}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredErrors.length === 0 && (
          <TSAMCard title="No Errors Found" icon={<Bug className="h-5 w-5" />}>
            <div className="text-center py-8 text-gray-400">
              {searchTerm ? 'No errors match your search criteria.' : 'No errors detected in the system.'}
            </div>
          </TSAMCard>
        )}
      </div>
    </TSAMLayout>
  );
};

export default ErrorLogsPage;
