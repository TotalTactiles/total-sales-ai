
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, AlertTriangle } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface AIAutopilotToggleProps {
  lead: Lead;
  isAutopilotEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const AIAutopilotToggle: React.FC<AIAutopilotToggleProps> = ({
  lead,
  isAutopilotEnabled,
  onToggle
}) => {
  const handleToggle = () => {
    if (!isAutopilotEnabled) {
      // Enabling autopilot
      toast.success(`AI Autopilot activated for ${lead.name}. AI will handle follow-ups, emails, and scheduling.`);
      onToggle(true);
    } else {
      // Disabling autopilot
      toast.info(`AI Autopilot deactivated for ${lead.name}. You have full control.`);
      onToggle(false);
    }
  };

  return (
    <Card className={`border-2 transition-all duration-300 ${
      isAutopilotEnabled 
        ? 'border-purple-300 bg-purple-50' 
        : 'border-gray-200 hover:border-blue-300'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className={`h-4 w-4 ${isAutopilotEnabled ? 'text-purple-600' : 'text-gray-600'}`} />
          AI Autopilot Mode
          {isAutopilotEnabled && (
            <Badge className="bg-purple-600 text-white">
              <Zap className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600">
          {isAutopilotEnabled ? (
            <div className="space-y-2">
              <p className="text-purple-700 font-medium">
                🤖 AI is managing {lead.name}
              </p>
              <div className="text-xs space-y-1">
                <p>✅ Auto follow-up emails</p>
                <p>✅ Smart scheduling</p>
                <p>✅ Objection handling</p>
                <p>✅ Pipeline progression</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <AlertTriangle className="h-3 w-3" />
                You'll be notified of major updates
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p>Let AI handle this lead end-to-end:</p>
              <div className="text-xs space-y-1">
                <p>• Automated follow-ups</p>
                <p>• Smart email sequences</p>
                <p>• Meeting scheduling</p>
                <p>• Objection responses</p>
              </div>
              <p className="text-xs text-green-600 font-medium">
                Frees you to focus on high-value activities
              </p>
            </div>
          )}
        </div>

        <Button 
          onClick={handleToggle}
          className={`w-full ${
            isAutopilotEnabled 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isAutopilotEnabled ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Take Back Control
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Enable AI Autopilot
            </>
          )}
        </Button>

        {isAutopilotEnabled && (
          <div className="text-xs text-center text-gray-500">
            AI confidence: {lead.conversionLikelihood}% • Next action in 2-4 hours
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAutopilotToggle;
