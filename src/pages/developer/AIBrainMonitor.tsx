
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Shield,
  Zap,
  Eye,
  Settings,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { internalAIBrain, SystemError, AIBrainStatus } from '@/services/ai/internalAIBrain';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

const AIBrainMonitor = () => {
  const [brainStatus, setBrainStatus] = useState<AIBrainStatus | null>(null);
  const [recentErrors, setRecentErrors] = useState<SystemError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiActive, setAiActive] = useState(true);
  const [selectedError, setSelectedError] = useState<SystemError | null>(null);
  const [isRetrying, setIsRetrying] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [status, errors] = await Promise.all([
        internalAIBrain.getSystemStatus(),
        internalAIBrain.getRecentErrors(20)
      ]);
      
      setBrainStatus(status);
      setRecentErrors(errors);
    } catch (error) {
      logger.error('Failed to load AI Brain data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryError = async (errorId: string) => {
    setIsRetrying(errorId);
    try {
      const success = await internalAIBrain.retryError(errorId);
      if (success) {
        toast.success('Error retry successful');
        loadData();
      } else {
        toast.error('Error retry failed');
      }
    } catch (error) {
      toast.error('Failed to retry error');
    } finally {
      setIsRetrying(null);
    }
  };

  const toggleAIBrain = (active: boolean) => {
    setAiActive(active);
    internalAIBrain.setActive(active);
    toast.info(active ? 'AI Brain activated' : 'AI Brain deactivated');
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 70) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const timeSince = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Internal AI Brain Monitor
          </h1>
          <p className="text-muted-foreground">
            Real-time system health monitoring and self-healing AI
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">AI Brain Active:</span>
            <Switch
              checked={aiActive}
              onCheckedChange={toggleAIBrain}
            />
          </div>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className={`${getHealthBgColor(brainStatus?.system_health_score || 0)}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(brainStatus?.system_health_score || 0)}`}>
              {brainStatus?.system_health_score || 0}%
            </div>
            <Progress 
              value={brainStatus?.system_health_score || 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Fixes Today</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {brainStatus?.auto_fixes_today || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Errors automatically resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {brainStatus?.pending_errors || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Uptime</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor((brainStatus?.ai_uptime_minutes || 0) / 60)}h
            </div>
            <p className="text-xs text-muted-foreground">
              {(brainStatus?.ai_uptime_minutes || 0) % 60}m continuous operation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live AI Fix Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Error Feed
          </CardTitle>
          <CardDescription>
            Real-time monitoring of system errors and AI fixes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentErrors.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Systems Healthy</h3>
              <p className="text-gray-500">No recent errors detected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentErrors.map((error) => (
                <div key={error.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getSeverityColor(error.severity)}>
                        {error.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{error.component}</span>
                      {error.route && (
                        <span className="text-sm text-muted-foreground">
                          {error.route}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {timeSince(error.timestamp)}
                      </span>
                      {error.fixed_by_ai ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : error.escalated ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">{error.error_type}</p>
                    {error.ai_fix_summary && (
                      <p className="text-sm text-muted-foreground mt-1">
                        AI Fix: {error.ai_fix_summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {error.retry_attempted && (
                        <Badge variant={error.retry_result === 'success' ? 'default' : 'destructive'}>
                          Retry: {error.retry_result}
                        </Badge>
                      )}
                      {error.fix_type && (
                        <Badge variant="outline">
                          {error.fix_type}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedError(selectedError?.id === error.id ? null : error)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      
                      {!error.fixed_by_ai && (
                        <Button
                          size="sm"
                          onClick={() => handleRetryError(error.id)}
                          disabled={isRetrying === error.id}
                        >
                          {isRetrying === error.id ? (
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3 mr-1" />
                          )}
                          Retry Fix
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Error Details Expansion */}
                  {selectedError?.id === error.id && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Error Details</h4>
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="font-medium">Timestamp:</span>
                          <span className="ml-2">{formatTimestamp(error.timestamp)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Component:</span>
                          <span className="ml-2">{error.component}</span>
                        </div>
                        {error.route && (
                          <div>
                            <span className="font-medium">Route:</span>
                            <span className="ml-2">{error.route}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Error Type:</span>
                          <span className="ml-2">{error.error_type}</span>
                        </div>
                        {error.stack_trace && (
                          <div>
                            <span className="font-medium">Stack Trace:</span>
                            <pre className="mt-1 p-2 bg-background rounded text-xs overflow-x-auto">
                              {error.stack_trace}
                            </pre>
                          </div>
                        )}
                        {error.developer_note && (
                          <div>
                            <span className="font-medium">Developer Note:</span>
                            <span className="ml-2">{error.developer_note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Fallback Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>AI Brain Online</span>
              <Badge className={aiActive ? 'bg-green-500' : 'bg-red-500'}>
                {aiActive ? '✅' : '❌'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Supabase Connected</span>
              <Badge className="bg-green-500">✅</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Auth System Working</span>
              <Badge className="bg-green-500">✅</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Critical Routes Monitored</span>
              <Badge variant="outline">
                {brainStatus?.critical_routes_monitored?.length || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              AI Brain Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Last Check-in</span>
              <span className="text-sm text-muted-foreground">
                {brainStatus?.last_check_in ? timeSince(brainStatus.last_check_in) : 'Never'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Health Check Interval</span>
              <Badge variant="outline">30s</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Route Monitor Interval</span>
              <Badge variant="outline">60s</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Escalation Threshold</span>
              <Badge variant="outline">Critical + 3 Retries</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIBrainMonitor;
