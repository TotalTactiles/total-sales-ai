
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ManagerEscalationCenterProps {
  demoMode: boolean;
}

const ManagerEscalationCenter: React.FC<ManagerEscalationCenterProps> = ({ demoMode }) => {
  return (
    <Card className="border border-salesRed-light rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-salesRed">
          <AlertCircle className="h-5 w-5" />
          Escalation Center
        </CardTitle>
        <CardDescription>
          Critical issues requiring leadership intervention
        </CardDescription>
      </CardHeader>
      <CardContent>
        {demoMode ? (
          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <h4 className="font-medium flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                High Priority Alert
              </h4>
              <p className="text-sm text-red-600 mt-1">
                Michael Chen has missed 5 consecutive quota periods and shows signs of burnout
              </p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">Create PIP</Button>
                <Button size="sm" variant="outline" className="text-xs">Schedule Review</Button>
              </div>
            </div>
            
            <p className="text-sm text-slate-500">
              Escalations are triggered when performance impacts company objectives or requires executive intervention.
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-salesGreen mx-auto mb-2" />
            <p className="font-medium text-salesGreen">No escalations needed</p>
            <p className="text-sm text-slate-500 mt-1">All team metrics within expected ranges</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManagerEscalationCenter;
