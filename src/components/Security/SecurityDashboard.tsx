
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Lock } from 'lucide-react';
import { useAISecurityPosture } from '@/hooks/useAISecurityPosture';
import { SecurityStatus } from '@/types/security';

const SecurityDashboard: React.FC = () => {
  const {
    securityPosture,
    securityIssues,
    securityEvents,
    workflowLimits,
    refreshSecurityScore,
    getSecurityStatus,
    resolveSecurityEvent,
    validateWorkflowLimits,
  } = useAISecurityPosture();

  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [workflowViolations, setWorkflowViolations] = useState<string[]>([]);

  useEffect(() => {
    loadSecurityStatus();
    checkWorkflowLimits();
  }, []);

  const loadSecurityStatus = async () => {
    try {
      const status = await getSecurityStatus();
      setSecurityStatus(status);
    } catch (error) {
      console.error('Failed to load security status:', error);
    }
  };

  const checkWorkflowLimits = async () => {
    try {
      const violations = await validateWorkflowLimits();
      setWorkflowViolations(violations);
    } catch (error) {
      console.error('Failed to check workflow limits:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSecurityScore();
      await loadSecurityStatus();
      await checkWorkflowLimits();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityPosture.overallScore}/100</div>
            <Badge variant={securityStatus?.status === 'healthy' ? 'default' : 'destructive'}>
              {securityStatus?.status?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColor(securityPosture.riskLevel)}`}>
              {securityPosture.riskLevel.toUpperCase()}
            </div>
            <p className="text-xs text-muted-foreground">Current risk</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityIssues.filter(issue => !issue.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">Unresolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityPosture.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">Compliance rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Limits */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Workflow Limits
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Concurrent Tasks</p>
              <p className="text-2xl font-bold">
                {workflowLimits.currentTaskCount}/{workflowLimits.maxConcurrentTasks}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">API Calls/Min</p>
              <p className="text-2xl font-bold">
                {workflowLimits.currentApiCalls}/{workflowLimits.maxApiCallsPerMinute}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Data Processing</p>
              <p className="text-2xl font-bold">
                {Math.round(workflowLimits.currentDataSize / 1000000)}MB/
                {Math.round(workflowLimits.maxDataProcessingSize / 1000000)}MB
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">User Sessions</p>
              <p className="text-2xl font-bold">
                {workflowLimits.currentSessions}/{workflowLimits.maxUserSessions}
              </p>
            </div>
          </div>
          
          {workflowViolations.length > 0 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Workflow Limit Violations:</strong>
                <ul className="mt-1 list-disc list-inside">
                  {workflowViolations.map((violation, index) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {securityEvents.slice(0, 5).map((event) => (
              <Alert key={event.id}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{event.description}</span>
                    <Badge variant={getSeverityColor(event.severity)} className="ml-2">
                      {event.severity}
                    </Badge>
                  </div>
                  {!event.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveSecurityEvent(event.id, 'Manual resolution')}
                    >
                      Resolve
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
