
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';
import { Lead } from '@/types/lead';

interface AIAssistantTabProps {
  lead: Lead;
  voiceEnabled: boolean;
  rationaleMode: boolean;
  onRationaleModeChange: () => void;
  onLeadUpdate: (field: string, value: any) => void;
}

const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  lead,
  voiceEnabled,
  rationaleMode,
  onRationaleModeChange,
  onLeadUpdate
}) => {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rationale Mode</span>
            <Button
              variant={rationaleMode ? "default" : "outline"}
              size="sm"
              onClick={onRationaleModeChange}
            >
              {rationaleMode ? "On" : "Off"}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Insights
            </h4>
            <div className="space-y-2">
              <Badge variant="secondary" className="w-full justify-start">
                High conversion potential
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                Follow up recommended
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Suggested Actions
            </h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                Schedule follow-up call
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                Send personalized email
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                Update lead priority
              </Button>
            </div>
          </div>

          {voiceEnabled && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                Voice commands are active for {lead.name}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantTab;
