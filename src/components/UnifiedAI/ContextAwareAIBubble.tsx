
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
  User,
  Mic,
  MicOff,
  Volume2,
  Settings,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { aiConfig, generateMockAIResponse } from '@/config/ai';
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
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { profile } = useAuth();

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

    // Simulate AI processing with realistic delay
    setTimeout(() => {
      const mockResponse = generateMockAIResponse('sales', context);
      
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: mockResponse,
        timestamp: new Date(),
        source: 'demo_ai'
      }]);
      
      setIsLoading(false);
      toast.success('AI Demo Response Generated');
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickAction = (query: string) => {
    setMessage(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.info('Voice input activated (Demo Mode)');
      // Simulate voice input
      setTimeout(() => {
        setMessage("What are my top priorities for today?");
        setIsListening(false);
        toast.success('Voice input captured');
      }, 2000);
    } else {
      toast.info('Voice input stopped');
    }
  };

  if (!isExpanded) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative group">
          <Button
            onClick={() => setIsExpanded(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg border-2 border-white/20 transition-all duration-300 hover:scale-105"
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>
          
          {/* Context indicator */}
          {(context.isCallActive || context.currentLead) && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          )}
          
          {/* Hover tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI Assistant Ready
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-80 h-[500px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
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
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Settings className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {!aiConfig.enabled && (
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 w-fit">
              <Zap className="h-3 w-3 mr-1" />
              Demo Mode
            </Badge>
          )}
        </CardHeader>

        <CardContent className="flex flex-col h-[420px] p-3">
          {/* Conversation */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800 border'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.source && msg.source !== 'system' && (
                      <Badge variant="outline" className="text-xs py-0 px-1 h-4">
                        {msg.source === 'demo_ai' ? 'Demo AI' : msg.source}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">AI thinking...</span>
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
                className="text-xs h-8 p-2 border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-200"
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
              className="flex-1 min-h-[36px] max-h-[72px] resize-none text-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <div className="flex flex-col gap-1">
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                size="sm"
                className="h-9 w-9 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleVoiceToggle}
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                className="h-9 w-9 p-0"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextAwareAIBubble;
