
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface AIAutopilotToggleProps {
  lead: Lead;
  onAutopilotChange: (enabled: boolean) => void;
}

const AIAutopilotToggle: React.FC<AIAutopilotToggleProps> = ({
  lead,
  onAutopilotChange
}) => {
  const [isAutopilotEnabled, setIsAutopilotEnabled] = useState(lead.autopilotEnabled || false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleToggleAutopilot = (enabled: boolean) => {
    if (enabled && !isAutopilotEnabled) {
      setShowConfirmation(true);
    } else {
      setIsAutopilotEnabled(enabled);
      onAutopilotChange(enabled);
      toast.success(enabled ? 'AI Autopilot activated' : 'AI Autopilot deactivated');
    }
  };

  const confirmAutopilot = () => {
    setIsAutopilotEnabled(true);
    onAutopilotChange(true);
    setShowConfirmation(false);
    toast.success('AI Autopilot activated - AI will now manage this lead');
  };

  if (showConfirmation) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Brain className="h-5 w-5" />
            Enable AI Autopilot?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-3 rounded border">
            <h4 className="font-medium mb-2">AI Autopilot will:</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Send follow-up emails automatically
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Schedule calls and meetings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Send SMS reminders and updates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Track engagement and optimize timing
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Important:</p>
                <p className="text-yellow-700">You can disable Autopilot anytime. AI will notify you of major decisions.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={confirmAutopilot} className="flex-1">
              <Zap className="h-4 w-4 mr-2" />
              Enable Autopilot
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isAutopilotEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isAutopilotEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              {isAutopilotEnabled ? (
                <Zap className="h-4 w-4 text-green-600" />
              ) : (
                <Brain className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <div>
              <h4 className="font-medium">AI Autopilot</h4>
              <p className="text-sm text-gray-600">
                {isAutopilotEnabled 
                  ? 'AI is managing this lead automatically' 
                  : 'Let AI handle follow-ups and scheduling'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isAutopilotEnabled && (
              <Badge className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
            <Switch
              checked={isAutopilotEnabled}
              onCheckedChange={handleToggleAutopilot}
            />
          </div>
        </div>

        {isAutopilotEnabled && (
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">Next AI action: Follow-up email in 2 hours</span>
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3 mr-1" />
                Configure
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAutopilotToggle;
