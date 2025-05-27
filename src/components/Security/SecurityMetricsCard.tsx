
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, Eye, Activity } from 'lucide-react';

interface SecurityMetrics {
  dataEncryption: number;
  accessControl: number;
  aiAuditing: number;
  threatDetection: number;
}

interface WorkflowLimits {
  currentWorkflows: number;
  maxWorkflows: number;
}

interface SecurityMetricsCardProps {
  metrics: SecurityMetrics;
  workflowLimits: WorkflowLimits;
  securityStatus: string;
}

const SecurityMetricsCard: React.FC<SecurityMetricsCardProps> = ({
  metrics,
  workflowLimits,
  securityStatus
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
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
            <div className="text-2xl font-bold text-green-800">{metrics.dataEncryption}%</div>
            <div className="text-xs text-green-600">Data Encryption</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{metrics.accessControl}%</div>
            <div className="text-xs text-blue-600">Access Control</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Eye className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{metrics.aiAuditing}%</div>
            <div className="text-xs text-purple-600">AI Auditing</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Activity className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-800">{metrics.threatDetection}%</div>
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
  );
};

export default SecurityMetricsCard;
