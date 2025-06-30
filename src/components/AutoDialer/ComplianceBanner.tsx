
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
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-orange-600" />
          <span className="font-medium text-orange-800">Legal Compliance - Australia</span>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
          <ExternalLink className="h-3 w-3 mr-1" />
          View Guidelines
        </Button>
      </div>

      {/* Compliance Items - Horizontal Layout */}
      <div className="flex items-center gap-6 mb-4">
        {/* DNC Register */}
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${status.dncChecked ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">DNC Register</span>
          {status.dncChecked ? (
            <Badge variant="default" className="bg-blue-600 text-white">Checked</Badge>
          ) : (
            <Button size="sm" onClick={handleDNCCheck} className="bg-blue-600 hover:bg-blue-700 text-white">
              Check Now
            </Button>
          )}
        </div>

        {/* Time Window */}
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Time Window</span>
          <Badge variant={status.timeCompliant ? "default" : "destructive"} 
                 className={status.timeCompliant ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
            {status.timeCompliant ? "9AM-8PM" : "Outside Hours"}
          </Badge>
        </div>

        {/* Audit Trail */}
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium">Audit Trail</span>
          <Switch
            checked={status.auditEnabled}
            onCheckedChange={(enabled) => 
              onStatusChange({ ...status, auditEnabled: enabled })
            }
          />
          <span className="text-sm text-gray-600">
            {status.auditEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {/* Compliance Issues Alert */}
      {(!status.dncChecked || !status.timeCompliant) && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800 font-medium">Compliance Issues</span>
          <span className="text-sm text-yellow-700">Must be resolved before dialing</span>
        </div>
      )}

      {/* B2B Override */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-yellow-800">B2B Override Available</span>
            <p className="text-xs text-yellow-700">For business-to-business calls where applicable</p>
          </div>
          <Badge variant="outline" className="bg-gray-100 text-gray-600">
            Admin Only
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ComplianceBanner;
