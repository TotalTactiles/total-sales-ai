
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface ComplianceStatus {
  dncChecked: boolean;
  timeCompliant: boolean;
  auditEnabled: boolean;
}

interface DialerComplianceProps {
  status: ComplianceStatus;
  onStatusChange: (status: ComplianceStatus) => void;
}

const DialerCompliance: React.FC<DialerComplianceProps> = ({ status, onStatusChange }) => {
  // Check time compliance (9AM-8PM)
  useEffect(() => {
    const checkTimeCompliance = () => {
      const now = new Date();
      const hour = now.getHours();
      const isCompliant = hour >= 9 && hour <= 20; // 9AM to 8PM
      
      onStatusChange({
        ...status,
        timeCompliant: isCompliant
      });
    };

    checkTimeCompliance();
    const interval = setInterval(checkTimeCompliance, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleDNCCheck = async () => {
    toast.info('Checking Do Not Call register...');
    
    // Simulate DNC check
    setTimeout(() => {
      onStatusChange({
        ...status,
        dncChecked: true
      });
      toast.success('DNC check completed - All numbers cleared');
    }, 2000);
  };

  const toggleAuditLogging = (enabled: boolean) => {
    onStatusChange({
      ...status,
      auditEnabled: enabled
    });
    toast.info(`Audit logging ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flat-heading-sm flex items-center gap-2 text-orange-800">
          <Shield className="h-4 w-4" />
          Legal Compliance - Australia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DNC Register Check */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.dncChecked ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">DNC Register</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={status.dncChecked ? "default" : "destructive"}>
                {status.dncChecked ? "Checked" : "Required"}
              </Badge>
              {!status.dncChecked && (
                <Button size="sm" onClick={handleDNCCheck}>
                  Check Now
                </Button>
              )}
            </div>
          </div>

          {/* Time Compliance */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Time Window</span>
            </div>
            <Badge variant={status.timeCompliant ? "default" : "destructive"}>
              {status.timeCompliant ? "9AM-8PM ✓" : "Outside Hours"}
            </Badge>
          </div>

          {/* Audit Logging */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Audit Trail</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={status.auditEnabled}
                onCheckedChange={toggleAuditLogging}
              />
              <Badge variant={status.auditEnabled ? "default" : "outline"}>
                {status.auditEnabled ? "Active" : "Disabled"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Compliance Summary */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            {status.dncChecked && status.timeCompliant && status.auditEnabled ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">
              {status.dncChecked && status.timeCompliant && status.auditEnabled 
                ? "Fully Compliant" 
                : "Compliance Issues"
              }
            </span>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-3 w-3 mr-1" />
            View Guidelines
          </Button>
        </div>

        {/* Admin Override */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-yellow-800">B2B Override Available</span>
              <p className="text-xs text-yellow-700">For business-to-business calls where applicable</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Admin Only
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DialerCompliance;
