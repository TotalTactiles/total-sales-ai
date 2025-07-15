
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAISecurityPosture } from '@/hooks/useAISecurityPosture';
import { SecurityStatus } from '@/types/security';

const AISecurityDashboard: React.FC = () => {
  const {
    securityPosture,
    securityIssues,
    securityEvents,
    workflowLimits,
    refreshSecurityScore,
    getSecurityStatus,
    resolveSecurityEvent,
  } = useAISecurityPosture();

  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSecurityStatus();
  }, []);

  const loadSecurityStatus = async () => {
    try {
      const status = await getSecurityStatus();
      setSecurityStatus(status);
    } catch (error) {
      console.error('Failed to load security status:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSecurityScore();
      await loadSecurityStatus();
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
            <CardTitle className="text-sm">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStatus?.threatsDetected || 0}</div>
            <p className="text-xs text-muted-foreground">Detected threats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityPosture.vulnerabilities}</div>
            <p className="text-xs text-muted-foreground">Open issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityPosture.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">Compliance score</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Security Events</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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

      {/* Security Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Security Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {issue.resolved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                </div>
                <Badge variant={getSeverityColor(issue.severity)}>
                  {issue.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISecurityDashboard;
