
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DemoActionButton from './DemoActionButton';
import { Users, BarChart3, MessageSquare, Calendar } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';

const ManagerDemoActions: React.FC = () => {
  const { isDemoUser, demoRole } = useDemoMode();

  if (!isDemoUser || demoRole !== 'manager') {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Demo Manager Actions
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            Demo Mode
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DemoActionButton
            action="generate-report"
            payload={{ type: 'team-performance', period: 'monthly' }}
            variant="outline"
            className="flex items-center gap-2"
            successMessage="Team performance report generated"
          >
            <BarChart3 className="h-4 w-4" />
            Generate Team Report
          </DemoActionButton>

          <DemoActionButton
            action="schedule-meeting"
            payload={{ type: '1:1', repId: 'rep-3', topic: 'performance-improvement' }}
            variant="outline"
            className="flex items-center gap-2"
            successMessage="1:1 meeting scheduled with James Wilson"
          >
            <Calendar className="h-4 w-4" />
            Schedule 1:1
          </DemoActionButton>
        </div>

        <div className="space-y-2">
          <DemoActionButton
            action="run-automation"
            payload={{ automationId: 'feedback-generator', repId: 'rep-1' }}
            variant="default"
            className="w-full flex items-center gap-2"
            successMessage="AI feedback generated for Alex Thompson"
          >
            <MessageSquare className="h-4 w-4" />
            Generate AI Feedback for Top Performer
          </DemoActionButton>

          <DemoActionButton
            action="run-automation"
            payload={{ automationId: 'burnout-analysis', teamId: 'sales-team' }}
            variant="outline"
            className="w-full"
            successMessage="Burnout risk analysis completed for team"
          >
            🧠 Run Burnout Risk Analysis
          </DemoActionButton>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            🎭 <strong>Demo Mode:</strong> Management actions are simulated with realistic delays and responses.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerDemoActions;
