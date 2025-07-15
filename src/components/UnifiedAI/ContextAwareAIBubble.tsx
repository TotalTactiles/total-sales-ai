
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, X, Minimize2 } from 'lucide-react';
import { aiConfig } from '@/config/ai';

interface AIContext {
  workspace: 'dashboard' | 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'company_brain' | 'agent_missions' | 'leads';
  currentLead?: any;
  isCallActive?: boolean;
  callDuration?: number;
  emailContext?: {
    to?: string;
    subject?: string;
    thread?: any[];
  };
  smsContext?: {
    phoneNumber?: string;
    conversation?: any[];
  };
}

interface ContextAwareAIBubbleProps {
  context: AIContext;
  className?: string;
}

const ContextAwareAIBubble: React.FC<ContextAwareAIBubbleProps> = ({ 
  context, 
  className = '' 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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
    
    return greetings[context.workspace] || 'How can I assist you today?';
  };

  if (!isVisible) return null;

  return (
    <Card className={`fixed bottom-4 right-4 w-80 shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-5 w-5" />
            <div className="w-2 h-2 rounded-full bg-gray-400 absolute -top-0.5 -right-0.5"></div>
          </div>
          <span className="text-sm font-medium">AI Assistant</span>
          <Badge className="bg-white/20 text-white text-xs">
            {context.workspace === 'company_brain' ? 'Academy' : context.workspace.replace('_', ' ')}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white p-1 h-auto hover:bg-white/10"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsVisible(false)}
            className="text-white p-1 h-auto hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <CardContent className="p-4">
          {!aiConfig.enabled && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-yellow-700 text-sm font-medium">Demo Mode</div>
              <div className="text-yellow-600 text-xs mt-1">
                AI features are disabled. Architecture is ready for activation.
              </div>
            </div>
          )}

          <div className="text-xs text-blue-100 mb-3">
            {getContextualGreeting()}
          </div>
          
          {context.currentLead && (
            <div className="text-xs text-blue-100 mb-3">
              Context: {context.currentLead.name} • {context.currentLead.conversionLikelihood}% likely
              {context.isCallActive && ` • Call: ${Math.floor((context.callDuration || 0) / 60)}m`}
            </div>
          )}

          <div className="text-center text-gray-600">
            <Brain className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">AI Assistant Ready</p>
            <p className="text-xs text-gray-500 mt-1">
              {aiConfig.enabled ? 
                'Click to interact with AI' :
                'AI features will be available when enabled'
              }
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ContextAwareAIBubble;
