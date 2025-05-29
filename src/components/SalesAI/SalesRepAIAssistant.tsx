import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  Send,
  Mic,
  MicOff,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { unifiedAIService, AIResponse } from '@/services/ai/unifiedAIService';
import { logger } from '@/utils/logger';

interface SalesRepAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  leadData?: any;
}

const SalesRepAIAssistant: React.FC<SalesRepAIAssistantProps> = ({
  isOpen,
  onClose,
  context,
  leadData
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    source?: string;
  }>>([]);

  // Initialize with a welcome message
  useEffect(() => {
    if (isOpen && conversation.length === 0) {
      setConversation([{
        role: 'assistant',
        content: `Hi! I'm your personal sales AI assistant. I'm here to help you with lead insights, talk tracks, objection handling, and sales strategy. What can I help you with today?`,
        timestamp: new Date(),
        source: 'system'
      }]);
    }
  }, [isOpen, conversation.length]);

  const handleSendQuery = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage = query.trim();
    setQuery('');
    setIsLoading(true);

    // Add user message to conversation
    setConversation(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const systemMessage = `You are a personal AI sales assistant for a sales representative. 
      Your role is to be friendly, helpful, and focused on practical sales advice. 
      Provide specific, actionable recommendations for sales activities, lead management, and closing deals.
      Keep responses conversational and encouraging.
      
      ${leadData ? `Current lead context: ${JSON.stringify(leadData)}` : ''}
      ${context ? `Current context: ${context}` : ''}`;

      const response: AIResponse = await unifiedAIService.generateResponse(
        userMessage,
        systemMessage,
        context,
        'openai',
        'lead_management'
      );

      // Add AI response to conversation
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        source: response.source
      }]);

      logger.info('Sales AI response generated', { 
        source: response.source, 
        confidence: response.confidence 
      }, 'ai_brain');

    } catch (error) {
      logger.error('Failed to get AI response', error, 'ai_brain');
      
      // Add error message to conversation
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Let me give you some quick sales tips: Focus on understanding your lead's pain points, ask open-ended questions, and always follow up promptly!",
        timestamp: new Date(),
        source: 'fallback'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Mock voice input - in real implementation, this would use speech recognition
      setTimeout(() => {
        setQuery("How do I handle price objections?");
        setIsListening(false);
        toast.success('Voice command captured');
      }, 2000);
    }
  };

  const quickActions = [
    {
      label: "Objection Handling",
      icon: <MessageSquare className="h-4 w-4" />,
      query: "Give me scripts for handling common sales objections"
    },
    {
      label: "Closing Techniques",
      icon: <Target className="h-4 w-4" />,
      query: "What are the best closing techniques for this type of lead?"
    },
    {
      label: "Follow-up Strategy",
      icon: <TrendingUp className="h-4 w-4" />,
      query: "Create a follow-up sequence for this lead"
    },
    {
      label: "Industry Insights",
      icon: <Lightbulb className="h-4 w-4" />,
      query: "Give me insights about this industry and how to sell to them"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Sales AI Assistant
            <Badge variant="outline" className="text-xs">Personal</Badge>
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col overflow-hidden">
          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.source && message.source !== 'system' && (
                      <Badge variant="outline" className="text-xs">
                        {message.source}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-xs h-auto py-2"
                onClick={() => {
                  setQuery(action.query);
                  handleSendQuery();
                }}
                disabled={isLoading}
              >
                {action.icon}
                <span className="ml-2 truncate">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything about sales, leads, or strategy..."
              className="flex-1 min-h-[60px] text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendQuery();
                }
              }}
              disabled={isLoading}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSendQuery}
                disabled={!query.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleVoiceToggle}
                variant={isListening ? "destructive" : "outline"}
                size="sm"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {isListening && (
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Listening for voice command...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesRepAIAssistant;
