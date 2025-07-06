
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DemoActionButton from './DemoActionButton';
import { Phone, Mail, Calendar, TrendingUp } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';

const SalesDemoActions: React.FC = () => {
  const { isDemoUser, demoRole } = useDemoMode();

  if (!isDemoUser || demoRole !== 'sales_rep') {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Demo Sales Actions
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Demo Mode
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <DemoActionButton
            action="send-email"
            payload={{ recipient: 'Sarah Johnson', template: 'follow-up' }}
            variant="outline"
            className="flex items-center gap-2"
            successMessage="Demo follow-up email sent to Sarah Johnson"
          >
            <Mail className="h-4 w-4" />
            Send Follow-up
          </DemoActionButton>

          <DemoActionButton
            action="log-call"
            payload={{ leadId: 'demo-lead-4', duration: '22 minutes', outcome: 'positive' }}
            variant="outline"
            className="flex items-center gap-2"
            successMessage="Call with David Kim logged successfully"
          >
            <Phone className="h-4 w-4" />
            Log Call
          </DemoActionButton>

          <DemoActionButton
            action="schedule-meeting"
            payload={{ leadId: 'demo-lead-1', type: 'demo', duration: 60 }}
            variant="outline"
            className="flex items-center gap-2"
            successMessage="Demo meeting scheduled with Sarah Johnson"
          >
            <Calendar className="h-4 w-4" />
            Schedule Demo
          </DemoActionButton>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 mb-3">
            🎭 <strong>Demo Mode:</strong> All actions are simulated and won't affect real data.
          </p>
          
          <DemoActionButton
            action="update-lead-status"
            payload={{ leadId: 'demo-lead-4', status: 'closed_won', value: 125000 }}
            variant="default"
            className="w-full"
            successMessage="🎉 Deal closed! David Kim - $125,000 won!"
            onSuccess={() => {
              // Could trigger celebration animation
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('deal-celebration', { 
                  detail: { dealValue: 125000, clientName: 'David Kim' }
                }));
              }, 1000);
            }}
          >
            🚀 Close David Kim Deal - $125,000
          </DemoActionButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesDemoActions;
