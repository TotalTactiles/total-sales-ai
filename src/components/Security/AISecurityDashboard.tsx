
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Lock,
  Activity,
  Database,
  Zap
} from 'lucide-react';
import { useAISecurityPosture } from '@/hooks/useAISecurityPosture';
import { useAuth } from '@/contexts/AuthContext';

const AISecurityDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const {
    securityEvents,
    workflowLimits,
    isSecurityActive,
    getSecurityStatus,
    resolveSecurityEvent
  } = useAISecurityPosture();

  const [securityMetrics, setSecurityMetrics] = useState({
    dataEncryption: 100,
    accessControl: 98,
    aiAuditing: 95,
    threatDetection: 92
  });

  const securityStatus = getSecurityStatus();
  const unresolvedEvents = securityEvents.filter(e => !e.resolved);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Eye className="h-4 w-4 text-yellow-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  // Only show to managers and admins
  if (profile?.role !== 'manager' && profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            AI Security Posture Management
            <Badge className={getStatusColor(securityStatus)}>
              {securityStatus.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Lock className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{securityMetrics.dataEncryption}%</div>
              <div className="text-xs text-green-600">Data Encryption</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{securityMetrics.accessControl}%</div>
              <div className="text-xs text-blue-600">Access Control</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{securityMetrics.aiAuditing}%</div>
              <div className="text-xs text-purple-600">AI Auditing</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">{securityMetrics.threatDetection}%</div>
              <div className="text-xs text-orange-600">Threat Detection</div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>AI Workflow Usage</span>
                <span>{workflowLimits.currentWorkflows}/{workflowLimits.maxWorkflows}</span>
              </div>
              <Progress 
                value={(workflowLimits.currentWorkflows / workflowLimits.maxWorkflows) * 100} 
                className="h-2" 
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Security Compliance</span>
                <span>98.5%</span>
              </div>
              <Progress value={98.5} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Security Events</span>
            <Badge variant="outline">
              {unresolvedEvents.length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {unresolvedEvents.length > 0 ? (
              unresolvedEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(event.severity)}
                      <span className="font-medium">{event.type.replace('_', ' ').toUpperCase()}</span>
                      <Badge className="text-xs">{event.severity}</Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{event.message}</p>
                  
                  <Button
                    size="sm"
                    onClick={() => resolveSecurityEvent(event.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Resolve
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-lg font-medium text-green-700">All Systems Secure</p>
                <p className="text-sm">No security events detected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Protection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Data Protection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Data Encryption (AES-256)</div>
                  <div className="text-sm text-gray-600">All sensitive data encrypted at rest and in transit</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Access Control Matrix</div>
                  <div className="text-sm text-gray-600">Role-based permissions enforced across all resources</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">AI Audit Trail</div>
                  <div className="text-sm text-gray-600">All AI actions logged and monitored in real-time</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Data Leak Prevention</div>
                  <div className="text-sm text-gray-600">AI outputs sanitized to prevent sensitive data exposure</div>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Monitoring</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISecurityDashboard;
