
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Minimize2, 
  Maximize2, 
  Zap, 
  MessageSquare,
  Lightbulb,
  Target
} from 'lucide-react';
import { useRelevanceAI } from '@/hooks/useRelevanceAI';
import { toast } from 'sonner';

interface RelevanceAIBubbleProps {
  context?: {
    workspace: string;
    currentLead?: any;
    isCallActive?: boolean;
  };
  className?: string;
}

const RelevanceAIBubble: React.FC<RelevanceAIBubbleProps> = ({ context, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const { generateResponse, usageStats } = useRelevanceAI();

  const quickActions = [
    { label: 'Summarise last 5 calls', icon: <MessageSquare className="h-3 w-3" /> },
    { label: 'Suggest best response to objection', icon: <Lightbulb className="h-3 w-3" /> },
    { label: 'Draft follow-up email', icon: <Send className="h-3 w-3" /> },
    { label: 'Analyze lead behavior', icon: <Target className="h-3 w-3" /> }
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Generate AI response with context
      const aiResponse = await generateResponse({
        message,
        context: {
          ...context,
          conversationHistory: conversation.slice(-5) // Last 5 messages for context
        }
      });

      if (aiResponse && aiResponse.output) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: aiResponse.output.response || 'No response available',
          timestamp: new Date()
        };
        
        setConversation(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setMessage(action);
    setIsExpanded(true);
  };

  if (!isExpanded) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          {/* Usage indicator */}
          {usageStats && (
            <div className="absolute -top-8 right-0 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs border">
              {usageStats.requestsToday}/100
            </div>
          )}
          
          <Button
            onClick={() => setIsExpanded(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>

          {/* Quick actions */}
          <div className="absolute bottom-16 right-0 space-y-2 opacity-0 hover:opacity-100 transition-opacity">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.label)}
                className="bg-white/90 backdrop-blur-sm border-gray-200 text-xs whitespace-nowrap"
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-96 h-96 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-sm">Relevance AI</CardTitle>
              {usageStats && (
                <Badge variant="outline" className="text-xs">
                  {usageStats.tier}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-80">
          {/* Conversation */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {conversation.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8">
                <Bot className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Hello! I'm your Relevance AI assistant.</p>
                <p className="text-xs mt-1">Ask me anything about your leads, workflows, or sales process.</p>
              </div>
            )}
            
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Relevance AI..."
              className="flex-1 min-h-[40px] max-h-[80px] resize-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Usage warning */}
          {usageStats && usageStats.requestsToday >= 90 && (
            <div className="text-xs text-orange-600 mt-1">
              ⚠️ {100 - usageStats.requestsToday} requests remaining
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RelevanceAIBubble;
