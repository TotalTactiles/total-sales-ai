
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [contextualPrompt, setContextualPrompt] = useState('');
  const location = useLocation();

  // Update contextual prompts based on current location and context
  useEffect(() => {
    const updateContextualPrompt = () => {
      const currentPath = location.pathname;
      const searchParams = new URLSearchParams(location.search);
      const activeTab = searchParams.get('tab');

      if (context.isCallActive) {
        setContextualPrompt('🎯 Call in progress - I can help with talk tracks, objection handling, and next steps.');
      } else if (activeTab === 'email' || currentPath.includes('email')) {
        setContextualPrompt('✉️ Email mode - I can draft personalized messages, suggest templates, and optimize timing.');
      } else if (activeTab === 'call' || currentPath.includes('call')) {
        setContextualPrompt('📞 Call prep - I can provide talk tracks, recent activity summary, and conversation starters.');
      } else if (activeTab === 'meetings' || currentPath.includes('meetings')) {
        setContextualPrompt('📅 Meeting mode - I can suggest optimal times, prepare agendas, and follow-up actions.');
      } else if (currentPath.includes('lead-workspace')) {
        setContextualPrompt('👤 Lead focus - I can analyze engagement patterns, suggest next actions, and prioritize tasks.');
      } else if (currentPath.includes('lead-management')) {
        setContextualPrompt('📊 Pipeline view - I can help prioritize leads, identify opportunities, and suggest workflows.');
      } else if (currentPath.includes('dashboard') || currentPath === '/') {
        setContextualPrompt('🏠 Dashboard active - I can explain metrics, suggest daily priorities, and optimize your schedule.');
      } else {
        setContextualPrompt('🤖 AI Assistant ready - Ask me anything about your leads, strategies, or workflows.');
      }
    };

    updateContextualPrompt();
  }, [location, context]);

  const getContextualActions = () => {
    const currentPath = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab');

    if (context.isCallActive) {
      return [
        'Handle price objection',
        'Suggest closing technique',
        'Schedule follow-up'
      ];
    } else if (activeTab === 'email') {
      return [
        'Draft follow-up email',
        'Suggest subject line',
        'Best send time'
      ];
    } else if (currentPath.includes('dashboard')) {
      return [
        'Prioritize my day',
        'Show top opportunities',
        'Schedule optimization'
      ];
    } else {
      return [
        'Analyze this lead',
        'Suggest next action',
        'Create task'
      ];
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <Brain className="h-6 w-6 text-white" />
        </Button>
        <Badge className="absolute -top-2 -left-2 bg-green-500 text-white text-xs animate-bounce">
          AI
        </Badge>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`w-80 shadow-xl border-0 bg-gradient-to-br from-purple-50 to-blue-50 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-96'
      }`}>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <span className="font-semibold">AI Assistant</span>
            <Badge className="bg-white/20 text-white text-xs animate-pulse">
              Live
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <CardContent className="p-4 space-y-4 h-80 overflow-y-auto">
            {/* Contextual Prompt */}
            <div className="bg-white/60 rounded-lg p-3 border-l-4 border-purple-500">
              <p className="text-sm text-gray-700 font-medium">
                {contextualPrompt}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Quick Actions</h4>
              {getContextualActions().map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => console.log(`AI Action: ${action}`)}
                >
                  <MessageSquare className="h-3 w-3 mr-2" />
                  {action}
                </Button>
              ))}
            </div>

            {/* AI Status */}
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">
                  AI is monitoring this workspace
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Ready to help with insights, suggestions, and automation
              </p>
            </div>

            {/* Current Context Info */}
            {context.currentLead && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <h5 className="text-sm font-semibold text-blue-800 mb-1">
                  Current Lead Context
                </h5>
                <p className="text-xs text-blue-600">
                  {context.currentLead.name} from {context.currentLead.company}
                </p>
                <p className="text-xs text-blue-600">
                  Score: {context.currentLead.score}% | 
                  Priority: {context.currentLead.aiPriority}
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ContextAwareAIBubble;
