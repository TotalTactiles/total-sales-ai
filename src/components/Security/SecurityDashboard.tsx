
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, Settings, RefreshCw, Lock } from 'lucide-react';
import { useAISecurityPosture } from '@/hooks/useAISecurityPosture';

const SecurityDashboard: React.FC = () => {
  const {
    securityPosture,
    securityIssues,
    securityEvents,
    workflowLimits,
    refreshSecurityScore,
    getSecurityStatus,
    resolveSecurityEvent,
    validateWorkflowLimits
  } = useAISecurityPosture();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Security Dashboard</h1>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              Real-time Monitoring
            </Badge>
          </div>
          <p className="text-slate-600">
            Monitor and manage your platform's security posture
          </p>
        </div>

        <div className="space-y-6">
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                {getStatusIcon(getSecurityStatus())}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityPosture.score}/100</div>
                <Progress value={securityPosture.score} className="mt-2" />
                <p className={`text-xs mt-2 ${getStatusColor(getSecurityStatus())}`}>
                  {getSecurityStatus().toUpperCase()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securityEvents.filter(e => !e.resolved).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {securityEvents.filter(e => e.severity === 'critical' && !e.resolved).length} critical
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workflow Limits</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workflowLimits.currentWorkflows}/{workflowLimits.maxWorkflows}
                </div>
                <Progress 
                  value={(workflowLimits.currentWorkflows / workflowLimits.maxWorkflows) * 100} 
                  className="mt-2" 
                />
                <p className="text-xs text-muted-foreground">
                  {validateWorkflowLimits() ? 'Within limits' : 'Approaching limit'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {securityPosture.lastScan 
                    ? securityPosture.lastScan.toLocaleTimeString()
                    : 'Never'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {securityPosture.isScanning ? 'Scanning...' : 'Idle'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Security Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Security Events</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshSecurityScore}
                disabled={securityPosture.isScanning}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${securityPosture.isScanning ? 'animate-spin' : ''}`} />
                {securityPosture.isScanning ? 'Scanning...' : 'Refresh'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No security events detected
                  </p>
                ) : (
                  securityEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                          {event.resolved && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.message}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{event.timestamp.toLocaleString()}</span>
                            {event.source && <span>• Source: {event.source}</span>}
                          </div>
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Issues */}
          {securityIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Security Issues Requiring Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityIssues.map((issue, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{issue.message}</h4>
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {issue.description}
                      </p>
                      <p className="text-sm font-medium text-blue-600">
                        Recommendation: {issue.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
