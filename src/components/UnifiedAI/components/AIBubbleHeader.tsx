
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Minimize2, Maximize2, X, Volume2, MicOff } from 'lucide-react';
import { Lead } from '@/types/lead';

interface AIBubbleHeaderProps {
  workspace: string;
  currentLead?: Lead;
  isCallActive?: boolean;
  callDuration?: number;
  isExpanded: boolean;
  voiceEnabled: boolean;
  onToggleExpanded: () => void;
  onToggleVoice: () => void;
  onMinimize: () => void;
}

const AIBubbleHeader: React.FC<AIBubbleHeaderProps> = ({
  workspace,
  currentLead,
  isCallActive,
  callDuration,
  isExpanded,
  voiceEnabled,
  onToggleExpanded,
  onToggleVoice,
  onMinimize
}) => {
  const getContextualGreeting = () => {
    const greetings = {
      dashboard: 'Ready to boost your sales today?',
      dialer: 'Let\'s make some calls and close deals!',
      leads: 'How can I help you with your leads?',
      lead_details: 'How can I help you with this lead?',
      email: 'Need help crafting the perfect email?',
      sms: 'Let\'s send some engaging messages!',
      notes: 'Ready to capture important insights?',
      meetings: 'Let\'s schedule some productive meetings!',
      company_brain: 'Your AI-powered learning companion',
      agent_missions: 'Time to level up your sales skills!'
    };
    
    return greetings[workspace as keyof typeof greetings] || 'How can I assist you today?';
  };

  return (
    <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className="relative">
            <Brain className="h-5 w-5" />
            <div className="w-2 h-2 rounded-full bg-green-400 absolute -top-0.5 -right-0.5 animate-pulse"></div>
          </div>
          AI Assistant
          <Badge className="bg-white/20 text-white text-xs">
            {workspace === 'company_brain' ? 'Academy' : workspace.replace('_', ' ')}
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-1">
          {voiceEnabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVoice}
              className="text-white p-1 h-auto hover:bg-white/10"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleExpanded}
            className="text-white p-1 h-auto hover:bg-white/10"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMinimize}
            className="text-white p-1 h-auto hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-blue-100 mt-1">
        {getContextualGreeting()}
      </div>
      
      {currentLead && (
        <div className="text-xs text-blue-100 mt-1">
          Context: {currentLead.name} • {currentLead.conversionLikelihood}% likely
          {isCallActive && ` • Call: ${Math.floor((callDuration || 0) / 60)}m`}
        </div>
      )}
    </CardHeader>
  );
};

export default AIBubbleHeader;
