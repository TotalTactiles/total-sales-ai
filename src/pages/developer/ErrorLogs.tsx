
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Download, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ErrorLog {
  id: string;
  timestamp: Date;
  error_type: string;
  error_message: string;
  provider: string;
  context?: string;
  error_code?: string;
  user_id?: string;
  resolved: boolean;
}

const ErrorLogs: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [filteredErrors, setFilteredErrors] = useState<ErrorLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadErrorLogs();
  }, []);

  useEffect(() => {
    filterErrors();
  }, [searchTerm, selectedProvider, showResolved, errors]);

  const loadErrorLogs = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error loading logs:', error);
        // Fallback to mock data
        setErrors(getMockErrorLogs());
      } else {
        const formattedErrors = data.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp),
          resolved: false // Add resolved field if not in schema
        }));
        setErrors(formattedErrors);
      }
    } catch (error) {
      console.error('Failed to load error logs:', error);
      setErrors(getMockErrorLogs());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockErrorLogs = (): ErrorLog[] => [
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000),
      error_type: 'API_TIMEOUT',
      error_message: 'Relevance AI request timed out after 30 seconds',
      provider: 'relevance_ai',
      context: 'Lead analysis task',
      error_code: 'TIMEOUT_001',
      resolved: false
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 600000),
      error_type: 'AUTH_ERROR',
      error_message: 'Invalid API key for OpenAI service',
      provider: 'openai',
      context: 'Chat completion request',
      error_code: 'AUTH_401',
      resolved: true
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 900000),
      error_type: 'RATE_LIMIT',
      error_message: 'Claude API rate limit exceeded',
      provider: 'anthropic',
      context: 'Text generation',
      error_code: 'RATE_429',
      resolved: false
    }
  ];

  const filterErrors = () => {
    let filtered = errors;

    if (!showResolved) {
      filtered = filtered.filter(error => !error.resolved);
    }

    if (searchTerm) {
      filtered = filtered.filter(error => 
        error.error_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.error_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (error.context && error.context.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedProvider !== 'all') {
      filtered = filtered.filter(error => error.provider === selectedProvider);
    }

    setFilteredErrors(filtered);
  };

  const markAsResolved = async (errorId: string) => {
    try {
      setErrors(prev => prev.map(error => 
        error.id === errorId ? { ...error, resolved: true } : error
      ));
      
      // In real implementation, update the database
      // await supabase
      //   .from('error_logs')
      //   .update({ resolved: true })
      //   .eq('id', errorId);
    } catch (error) {
      console.error('Failed to mark error as resolved:', error);
    }
  };

  const getSeverityColor = (errorType: string) => {
    switch (errorType.toLowerCase()) {
      case 'api_timeout':
      case 'rate_limit':
        return 'text-yellow-600';
      case 'auth_error':
      case 'system_error':
        return 'text-red-600';
      default:
        return 'text-orange-600';
    }
  };

  const getSeverityIcon = (errorType: string) => {
    switch (errorType.toLowerCase()) {
      case 'api_timeout':
        return <Clock className="h-4 w-4" />;
      case 'auth_error':
      case 'system_error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const exportErrors = () => {
    const csv = [
      ['Timestamp', 'Type', 'Message', 'Provider', 'Context', 'Error Code', 'Resolved'],
      ...filteredErrors.map(error => [
        error.timestamp.toISOString(),
        error.error_type,
        error.error_message,
        error.provider,
        error.context || '',
        error.error_code || '',
        error.resolved.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Error Logs</h1>
          <p className="text-muted-foreground">Monitor and resolve system errors</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadErrorLogs} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportErrors}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
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
                placeholder="Search errors by message, type, or context..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Providers</option>
              <option value="relevance_ai">Relevance AI</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="retell">Retell AI</option>
              <option value="supabase">Supabase</option>
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
              />
              Show Resolved
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Error Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {errors.filter(e => !e.resolved).length}
                </div>
                <div className="text-sm text-muted-foreground">Unresolved Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {errors.filter(e => e.resolved).length}
                </div>
                <div className="text-sm text-muted-foreground">Resolved Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {errors.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error List */}
      <Card>
        <CardHeader>
          <CardTitle>Error Details</CardTitle>
          <CardDescription>
            Showing {filteredErrors.length} of {errors.length} errors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading error logs...</div>
          ) : (
            <div className="space-y-4">
              {filteredErrors.map((error) => (
                <div key={error.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={getSeverityColor(error.error_type)}>
                        {getSeverityIcon(error.error_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{error.error_type}</Badge>
                          <Badge variant="secondary">{error.provider}</Badge>
                          {error.resolved && (
                            <Badge variant="default" className="bg-green-600">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <div className="font-medium mb-1">{error.error_message}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {error.timestamp.toLocaleString()}
                        </div>
                        {error.context && (
                          <div className="text-sm">
                            <strong>Context:</strong> {error.context}
                          </div>
                        )}
                        {error.error_code && (
                          <div className="text-sm">
                            <strong>Error Code:</strong> {error.error_code}
                          </div>
                        )}
                      </div>
                    </div>
                    {!error.resolved && (
                      <Button
                        size="sm"
                        onClick={() => markAsResolved(error.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {filteredErrors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No errors found matching your criteria
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorLogs;
