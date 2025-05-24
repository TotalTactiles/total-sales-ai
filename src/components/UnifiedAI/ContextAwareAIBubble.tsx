
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Brain, Send, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';
import { useEnhancedUsageTracking } from '@/hooks/useEnhancedUsageTracking';
import { useAuth } from '@/contexts/AuthContext';
import { useAISuggestions } from './hooks/useAISuggestions';
import AISuggestionCard from './components/AISuggestionCard';
import AIBubbleHeader from './components/AIBubbleHeader';

interface AIContext {
  workspace: 'dashboard' | 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'company_brain' | 'agent_missions' | 'leads';
  currentLead?: Lead;
  isCallActive?: boolean;
  callDuration?: number;
  callSentiment?: 'positive' | 'neutral' | 'negative';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const { trackEvent, trackAIQuestion } = useEnhancedUsageTracking();
  const { profile } = useAuth();
  const { suggestions, dismissSuggestion } = useAISuggestions(context);

  const getBubblePosition = () => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      return 'bottom-4 right-4';
    }
    
    switch (context.workspace) {
      case 'dialer':
        return context.isCallActive ? 'bottom-4 left-4' : 'bottom-4 right-4';
      case 'lead_details':
        return 'bottom-4 right-80';
      case 'email':
      case 'sms':
        return 'bottom-4 right-6';
      case 'company_brain':
        return 'bottom-4 right-6';
      default:
        return 'bottom-4 right-4';
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: chatInput,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    trackAIQuestion(chatInput, context.workspace);
    
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateContextualResponse(chatInput),
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
    
    setChatInput('');
  };

  const generateContextualResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (context.workspace === 'company_brain' && profile?.role === 'sales_rep') {
      if (lowerInput.includes('recommend') || lowerInput.includes('learn')) {
        return 'Based on your performance data, I recommend focusing on objection handling next. You\'ve completed 80% of discovery content but only 45% of objection content.';
      }
      if (lowerInput.includes('progress') || lowerInput.includes('streak')) {
        return 'You\'re doing great! 7-day learning streak, 57% overall completion. Your strongest area is cold calling (92% success rate).';
      }
    }
    
    return `I'm here to help with your ${context.workspace.replace('_', ' ')} workflow. What specific assistance do you need?`;
  };

  const handleSuggestionAction = (suggestion: any) => {
    trackEvent({
      feature: 'ai_suggestion',
      action: 'accept',
      context: suggestion.context,
      metadata: { suggestionType: suggestion.type, priority: suggestion.priority }
    });
    
    dismissSuggestion(suggestion.id);
    
    if (suggestion.action) {
      toast.success(`Executing: ${suggestion.action}`);
    }
  };

  if (isMinimized) {
    return (
      <div className={`fixed ${getBubblePosition()} z-50 ${className}`}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg border-2 border-white relative"
          >
            <Brain className="h-7 w-7 text-white" />
            {suggestions.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs p-0 text-white">
                {suggestions.length}
              </Badge>
            )}
            {context.isCallActive && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`fixed ${getBubblePosition()} z-50 ${className}`}>
      {/* Floating Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 space-y-2 max-w-sm"
          >
            {suggestions.slice(0, 2).map((suggestion) => (
              <AISuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onAction={handleSuggestionAction}
                onDismiss={dismissSuggestion}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main AI Assistant */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`shadow-2xl border-blue-200 transition-all duration-300 ${
          isExpanded ? 'w-96 h-[600px]' : 'w-80 h-[400px]'
        }`}>
          <AIBubbleHeader
            workspace={context.workspace}
            currentLead={context.currentLead}
            isCallActive={context.isCallActive}
            callDuration={context.callDuration}
            isExpanded={isExpanded}
            voiceEnabled={voiceEnabled}
            onToggleExpanded={() => setIsExpanded(!isExpanded)}
            onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
            onMinimize={() => setIsMinimized(true)}
          />

          <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {chatHistory.length === 0 && (
                <div className="text-center text-gray-500 text-sm mt-8">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  {context.workspace === 'company_brain' 
                    ? "I'm your learning companion! Ask about content, progress, or get personalized recommendations."
                    : `I'm here to help! Ask me anything about ${context.workspace === 'dialer' && context.currentLead ? context.currentLead.name : 'your current workflow'}.`
                  }
                </div>
              )}
              
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder={context.workspace === 'company_brain' 
                  ? "Ask about learning progress, content, or get recommendations..."
                  : `Ask about ${context.workspace === 'dialer' && context.currentLead ? context.currentLead.name : 'anything'}...`
                }
                className="flex-1"
              />
              <Button onClick={handleChatSubmit} size="sm">
                <Send className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                variant={voiceEnabled ? "destructive" : "outline"}
                size="sm"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContextAwareAIBubble;
