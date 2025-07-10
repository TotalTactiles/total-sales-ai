
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Activity, Download } from 'lucide-react';
import { useAISecurityPosture } from '@/hooks/useAISecurityPosture';
import { useAIAuditTrail } from '@/hooks/useAIAuditTrail';
import { aiHealthMonitor } from '@/services/monitoring/aiHealthMonitor';
import { toast } from 'sonner';

const SecurityDashboard: React.FC = () => {
  const {
    securityEvents,
    workflowLimits,
    getSecurityStatus,
    resolveSecurityEvent,
    validateWorkflowLimits
  } = useAISecurityPosture();

  const {
    exportAuditTrail,
    isLoading: auditLoading
  } = useAIAuditTrail();

  const [healthStatus, setHealthStatus] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadHealthStatus();
    const interval = setInterval(loadHealthStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadHealthStatus = async () => {
    try {
      const status = await aiHealthMonitor.getHealthStatus();
      setHealthStatus(status);
    } catch (error) {
      console.error('Failed to load health status:', error);
    }
  };

  const handleExportAudit = async (format: 'json' | 'csv') => {
    setIsExporting(true);
    try {
      await exportAuditTrail(format);
      toast.success(`Audit trail exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export audit trail');
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
      case 'online':
        return 'bg-green-500';
      case 'warning':
      case 'degraded':
        return 'bg-yellow-500';
      case 'critical':
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const securityStatus = getSecurityStatus();
  const unresolvedEvents = securityEvents.filter(e => !e.resolved);

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(securityStatus)}`} />
              <span className="text-2xl font-bold capitalize">{securityStatus}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {unresolvedEvents.length} unresolved events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflow Limits</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflowLimits.currentWorkflows}/{workflowLimits.maxWorkflows}
            </div>
            <p className="text-xs text-muted-foreground">
              Active workflows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Modules</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthStatus.filter(h => h.status === 'online').length}/{healthStatus.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Modules online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Monitor and resolve security events in your AI system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={event.severity === 'critical' ? 'destructive' : 
                                 event.severity === 'high' ? 'destructive' : 
                                 event.severity === 'medium' ? 'default' : 'secondary'}>
                    {event.severity}
                  </Badge>
                  <div>
                    <p className="font-medium">{event.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                {!event.resolved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveSecurityEvent(event.id)}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            ))}
            {securityEvents.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No security events recorded
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Module Health */}
      <Card>
        <CardHeader>
          <CardTitle>AI Module Health Status</CardTitle>
          <CardDescription>
            Real-time health monitoring of AI modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthStatus.map((module) => (
              <div key={module.moduleId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{module.moduleId}</span>
                  <Badge variant={module.status === 'online' ? 'default' : 'destructive'}>
                    {module.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Health Score:</span>
                    <span>{module.healthScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span>{module.avgResponseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span>
                      {module.successCount + module.errorCount > 0
                        ? Math.round((module.successCount / (module.successCount + module.errorCount)) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Audit Trail Export
          </CardTitle>
          <CardDescription>
            Export security and audit logs for compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={() => handleExportAudit('json')}
              disabled={isExporting || auditLoading}
              variant="outline"
            >
              Export JSON
            </Button>
            <Button
              onClick={() => handleExportAudit('csv')}
              disabled={isExporting || auditLoading}
              variant="outline"
            >
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
