
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { Bot, Lightbulb, TrendingUp } from 'lucide-react';

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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Insights</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This lead shows high engagement with email content. Consider sending a product demo video.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Recommendations</span>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                Schedule follow-up call
              </Badge>
              <Badge variant="outline" className="text-xs">
                Send pricing information
              </Badge>
            </div>
          </div>
          
          <Button className="w-full" size="sm">
            Get AI Suggestions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantTab;
