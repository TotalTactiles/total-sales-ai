
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  X, 
  Minimize2, 
  Maximize2,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import VoiceInput from './VoiceInput';
import AIChartRenderer from './AIChartRenderer';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'voice';
  message: string;
  timestamp: string;
  chartData?: any;
  assistantType?: string;
}

interface ChatBubbleProps {
  assistantType: 'dashboard' | 'business-ops' | 'team' | 'leads' | 'company-brain';
  enabled: boolean;
  className?: string;
  context?: any;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  assistantType, 
  enabled, 
  className = '',
  context = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Don't render if not enabled
  if (!enabled) return null;

  useEffect(() => {
    // Add initial greeting when component mounts
    if (chatHistory.length === 0) {
      const greeting = getGreeting();
      setChatHistory([{
        id: '1',
        type: 'ai',
        message: greeting,
        timestamp: 'now',
        assistantType
      }]);
    }
  }, [assistantType]);

  const getGreeting = (): string => {
    const greetings = {
      dashboard: "Hi! I'm your CEO EA AI assistant. I can help with pulse checks, alerts, and executive summaries. What can I help you with?",
      'business-ops': "Hello! I'm your Business Operations AI. I can run scenario simulations, analyze KPIs, and provide operational insights. How can I assist?",
      team: "Hi there! I'm your Team AI assistant. I can analyze team performance, suggest rewards, and provide coaching insights. What would you like to explore?",
      leads: "Hello! I'm your Leads AI assistant. I can help with lead scoring, reassignment recommendations, and conversion predictions. What can I help with?",
      'company-brain': "I'm the Company Brain AI, your data orchestration hub. How can I help with your data needs?"
    };
    
    return greetings[assistantType] || "Hello! I'm your AI assistant. How can I help?";
  };

  const getAssistantName = (): string => {
    const names = {
      dashboard: "CEO EA AI",
      'business-ops': "Business Ops AI",
      team: "Team AI",
      leads: "Leads AI",
      'company-brain': "Company Brain AI"
    };
    
    return names[assistantType] || "AI Assistant";
  };

  const handleVoiceTranscript = (transcript: string) => {
    const voiceMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'voice',
      message: transcript,
      timestamp: 'now',
      assistantType
    };

    setChatHistory(prev => [...prev, voiceMessage]);
    handleSendMessage(transcript, true);
  };

  const handleSendMessage = async (messageText?: string, isVoiceCommand = false) => {
    const textToSend = messageText || chatMessage;
    if (!textToSend.trim()) return;

    if (!isVoiceCommand) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        message: textToSend,
        timestamp: 'now',
        assistantType
      };
      setChatHistory(prev => [...prev, userMessage]);
      setChatMessage('');
    }
    
    setIsTyping(true);

    try {
      // Call the appropriate AI endpoint
      const response = await fetch(`/functions/v1/ai-manager-${assistantType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: textToSend,
          context: {
            ...context,
            assistantType,
            timestamp: new Date().toISOString()
          }
        }),
      });

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: data.response || 'I understand your request.',
        timestamp: 'now',
        chartData: data.chartData,
        assistantType
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI request failed:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: 'I apologize, but I encountered an error. Please try again.',
        timestamp: 'now',
        assistantType
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg border-2 border-white"
        >
          <Brain className="h-7 w-7 text-white" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`shadow-2xl border-blue-200 transition-all duration-300 ${
        isExpanded ? 'w-96 h-[700px]' : 'w-80 h-[500px]'
      }`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="relative">
                <Brain className="h-5 w-5" />
                <div className="w-2 h-2 rounded-full bg-green-400 absolute -top-0.5 -right-0.5 animate-pulse"></div>
              </div>
              {getAssistantName()}
              <Badge className="bg-white/20 text-white text-xs capitalize">
                {assistantType.replace('-', ' ')}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white p-1 h-auto hover:bg-white/10"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMinimized(true)}
                className="text-white p-1 h-auto hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          {/* Voice Controls */}
          <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
            <VoiceInput 
              onTranscript={handleVoiceTranscript}
              enabled={voiceEnabled}
              onToggle={setVoiceEnabled}
            />
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' || message.type === 'voice' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2 rounded text-xs ${
                      message.type === 'user' ? 'bg-blue-600 text-white' :
                      message.type === 'voice' ? 'bg-purple-600 text-white' :
                      'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {message.type === 'voice' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Mic className="h-2 w-2" />
                        <span className="text-xs opacity-75">Voice Command</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{message.message}</p>
                    
                    {/* Render chart if available */}
                    {message.chartData && (
                      <div className="mt-2">
                        <AIChartRenderer 
                          chartData={message.chartData.data} 
                          chartType={message.chartData.type}
                          config={message.chartData.config}
                        />
                      </div>
                    )}
                    
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' || message.type === 'voice' ? 
                      (message.type === 'voice' ? 'text-purple-200' : 'text-blue-200') : 
                      'text-slate-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-800 p-2 rounded">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Chat Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={`Ask ${getAssistantName()}...`}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="text-sm"
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={!chatMessage.trim() || isTyping}
                size="sm"
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBubble;
