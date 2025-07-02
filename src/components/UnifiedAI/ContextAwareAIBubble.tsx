
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  MessageSquare,
  Lightbulb,
  Target,
  Phone,
  Mail,
  User
} from 'lucide-react';
// import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

const ContextAwareAIBubble: React.FC<ContextAwareAIBubbleProps> = ({ context, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    source?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { profile } = useAuth();
  // const { executeAgentTask, isAIActive } = useUnifiedAI();
  const isAIActive = false;

  const getContextualGreeting = () => {
    const role = profile?.role || 'user';
    const workspace = context.workspace;
    
    if (workspace === 'dialer' && context.isCallActive) {
      return "I'm here to help during your call. Need talking points or objection handling?";
    }
    
    if (workspace === 'lead_details' && context.currentLead) {
      return `I can help you with ${context.currentLead.name}. What would you like to know?`;
    }
    
    if (role === 'manager') {
      return "Hello! I'm your AI management assistant. I can help with team insights, performance analysis, and strategic decisions.";
    }
    
    return "Hi! I'm your personal AI assistant. How can I help you today?";
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (context.workspace === 'dialer' || context.isCallActive) {
      actions.push(
        { label: 'Call script suggestions', icon: <Phone className="h-3 w-3" />, query: 'Give me talking points for this call' },
        { label: 'Handle objections', icon: <MessageSquare className="h-3 w-3" />, query: 'How do I handle price objections?' }
      );
    }
    
    if (context.currentLead) {
      actions.push(
        { label: 'Lead insights', icon: <User className="h-3 w-3" />, query: 'Analyze this lead for me' },
        { label: 'Follow-up suggestions', icon: <Mail className="h-3 w-3" />, query: 'What should my next follow-up be?' }
      );
    }
    
    if (profile?.role === 'manager') {
      actions.push(
        { label: 'Team performance', icon: <Target className="h-3 w-3" />, query: 'Show me team performance insights' },
        { label: 'Strategy recommendations', icon: <Lightbulb className="h-3 w-3" />, query: 'What strategic improvements can we make?' }
      );
    } else {
      actions.push(
        { label: 'Sales tips', icon: <Lightbulb className="h-3 w-3" />, query: 'Give me sales tips for today' },
        { label: 'Goal tracking', icon: <Target className="h-3 w-3" />, query: 'How am I doing on my goals?' }
      );
    }
    
    return actions;
  };

  useEffect(() => {
    if (isExpanded && conversation.length === 0) {
      setConversation([{
        role: 'assistant',
        content: getContextualGreeting(),
        timestamp: new Date(),
        source: 'system'
      }]);
    }
  }, [isExpanded, context]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Add user message to conversation
    setConversation(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      // const agentType = profile?.role === 'manager' ? 'managerAgent_v1' : 'salesAgent_v1';

      // const result = await executeAgentTask(agentType, 'contextual_assistance', {
      //   message: userMessage,
      //   workspace: context.workspace,
      //   leadContext: context.currentLead,
      //   callContext: context.isCallActive ? { duration: context.callDuration } : null,
      //   emailContext: context.emailContext,
      //   smsContext: context.smsContext
      // });

      // if (result && result.status === 'completed') {
      //   const aiResponse = result.output?.response || "I'm here to help! Could you be more specific about what you need?";

      //   setConversation(prev => [...prev, {
      //     role: 'assistant',
      //     content: aiResponse,
      //     timestamp: new Date(),
      //     source: result.agentType
      //   }]);
      // } else {
      //   throw new Error('Agent response failed');
      // }

      setConversation(prev => [...prev, {
        role: 'assistant',
        content: "AI assistance disabled in safe mode.",
        timestamp: new Date(),
        source: 'disabled'
      }]);
    } catch (error) {
      // Fallback response
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now, but I'm still here to help! Can you try rephrasing your question?",
        timestamp: new Date(),
        source: 'fallback'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query: string) => {
    setMessage(query);
    handleSendMessage();
  };

  if (!isAIActive) return null;

  if (!isExpanded) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          <Button
            onClick={() => setIsExpanded(true)}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg border-2 border-white/20"
          >
            <Bot className="h-5 w-5 text-white" />
          </Button>
          
          {/* Context indicator */}
          {(context.isCallActive || context.currentLead) && (
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-80 h-96 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
                {context.workspace && (
                  <p className="text-xs text-gray-500 capitalize">{context.workspace.replace('_', ' ')}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-80 p-3">
          {/* Conversation */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2 rounded-lg text-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className="flex items-center justify-between mt-1 text-xs opacity-70">
                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.source && msg.source !== 'system' && (
                      <Badge variant="outline" className="text-xs py-0 px-1 h-4">
                        {msg.source.replace('Agent_v1', '')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-1 mb-3">
            {getQuickActions().slice(0, 4).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7 p-1 border-gray-200 hover:bg-gray-50"
                onClick={() => handleQuickAction(action.query)}
                disabled={isLoading}
              >
                {action.icon}
                <span className="ml-1 truncate">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 min-h-[32px] max-h-[60px] resize-none text-xs border-gray-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextAwareAIBubble;
