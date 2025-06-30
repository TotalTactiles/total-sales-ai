
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, Clock, FileText, AlertTriangle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ComplianceStatus {
  dncChecked: boolean;
  timeCompliant: boolean;
  auditEnabled: boolean;
}

interface ComplianceBannerProps {
  status: ComplianceStatus;
  onStatusChange: (status: ComplianceStatus) => void;
}

const ComplianceBanner: React.FC<ComplianceBannerProps> = ({ status, onStatusChange }) => {
  const handleDNCCheck = () => {
    toast.info('Checking DNC register...');
    setTimeout(() => {
      onStatusChange({ ...status, dncChecked: true });
      toast.success('DNC check completed');
    }, 1500);
  };

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-600" />
            <span className="font-medium text-orange-800">Legal Compliance - Australia</span>
          </div>
          <Button variant="ghost" size="sm" className="text-orange-700 hover:text-orange-800">
            <ExternalLink className="h-3 w-3 mr-1" />
            View Guidelines
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 items-center">
          {/* DNC Register */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.dncChecked ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">DNC Register</span>
            </div>
            {!status.dncChecked ? (
              <Button size="sm" onClick={handleDNCCheck} className="text-xs">
                Check Now
              </Button>
            ) : (
              <Badge variant="default" className="text-xs">Checked</Badge>
            )}
          </div>

          {/* Time Window */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-600" />
              <span className="text-sm">Time Window</span>
            </div>
            <Badge variant={status.timeCompliant ? "default" : "destructive"} className="text-xs">
              {status.timeCompliant ? "9AM-8PM ✓" : "Outside Hours"}
            </Badge>
          </div>

          {/* Audit Trail */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-purple-600" />
              <span className="text-sm">Audit Trail</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={status.auditEnabled}
                onCheckedChange={(enabled) => 
                  onStatusChange({ ...status, auditEnabled: enabled })
                }
                size="sm"
              />
              <Badge variant={status.auditEnabled ? "default" : "outline"} className="text-xs">
                {status.auditEnabled ? "Active" : "Off"}
              </Badge>
            </div>
          </div>

          {/* B2B Override */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-700">B2B Override</span>
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
              Admin Only
            </Badge>
          </div>
        </div>

        {(!status.dncChecked || !status.timeCompliant) && (
          <div className="mt-3 p-2 bg-yellow-100 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">Compliance issues must be resolved before dialing</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceBanner;
