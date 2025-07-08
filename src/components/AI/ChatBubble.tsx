
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';
import { assistantVoiceService } from '@/services/ai/assistantVoiceService';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'voice';
  message: string;
  timestamp: string;
}

const ChatBubble: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: 'Hi! I\'m TSAM, your AI assistant. I can help you with lead management, tasks, and answer questions. You can type or speak to me - just say "Hey TSAM" to activate voice mode!',
      timestamp: 'now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isWakeWordMode, setIsWakeWordMode] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    // Set up voice callbacks
    assistantVoiceService.setCommandCallback(handleVoiceCommand);
    assistantVoiceService.setWakeWordCallback(() => {
      toast.success('Wake word detected! Listening for command...');
      setIsListening(true);
    });
  }, []);

  const handleVoiceCommand = (command: string) => {
    const voiceMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'voice',
      message: command,
      timestamp: 'now'
    };

    setChatHistory(prev => [...prev, voiceMessage]);
    handleSendMessage(command, true);
  };

  const handleSendMessage = async (messageText?: string, isVoiceCommand = false) => {
    const textToSend = messageText || chatMessage;
    if (!textToSend.trim()) return;

    if (!isVoiceCommand) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        message: textToSend,
        timestamp: 'now'
      };
      setChatHistory(prev => [...prev, userMessage]);
      setChatMessage('');
    }
    
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateAIResponse(textToSend),
        timestamp: 'now'
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('update') && message.includes('status')) {
      return 'I\'ve updated the lead status as requested. The change has been saved to your CRM.';
    }
    
    if (message.includes('call') || message.includes('phone')) {
      return 'I\'m initiating the call now. The dialer should open shortly.';
    }
    
    if (message.includes('email')) {
      return 'Opening the email composer with the lead\'s information pre-filled.';
    }
    
    if (message.includes('remind') || message.includes('follow up')) {
      return 'I\'ve created a reminder for you. You\'ll be notified at the scheduled time.';
    }
    
    return 'I understand your request. How else can I help you with your sales activities today?';
  };

  const toggleVoice = async () => {
    if (isListening) {
      await assistantVoiceService.stopListening();
      setIsListening(false);
      setIsWakeWordMode(false);
    } else {
      const started = await assistantVoiceService.startListening(isWakeWordMode);
      if (started) {
        setIsListening(true);
        toast.success(isWakeWordMode ? 'Say "Hey TSAM" to activate' : 'Listening for command...');
      }
    }
  };

  const toggleWakeWordMode = () => {
    setIsWakeWordMode(!isWakeWordMode);
    if (!isWakeWordMode) {
      toast.info('Wake word mode enabled. Say "Hey TSAM" anytime!');
    } else {
      toast.info('Wake word mode disabled.');
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
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
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`shadow-2xl border-blue-200 transition-all duration-300 ${
        isExpanded ? 'w-96 h-[600px]' : 'w-80 h-[450px]'
      }`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="relative">
                <Brain className="h-5 w-5" />
                <div className="w-2 h-2 rounded-full bg-green-400 absolute -top-0.5 -right-0.5 animate-pulse"></div>
              </div>
              TSAM Assistant
              <Badge className="bg-white/20 text-white text-xs">
                AI Chat
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
          
          <div className="text-xs text-blue-100 mt-1">
            Type or speak your requests - I'm here to help!
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          {/* Voice Controls */}
          <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                onClick={toggleVoice}
                className="h-8 px-2"
              >
                {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                <span className="ml-1 text-xs">
                  {isListening ? 'Stop' : 'Voice'}
                </span>
              </Button>
              
              <Button
                variant={isWakeWordMode ? "default" : "outline"}
                size="sm"
                onClick={toggleWakeWordMode}
                className="h-8 px-2"
              >
                {isWakeWordMode ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                <span className="ml-1 text-xs">
                  Wake Word
                </span>
              </Button>
            </div>
            
            {isListening && (
              <Badge variant="outline" className="text-xs animate-pulse">
                {isWakeWordMode ? 'Say "Hey TSAM"' : 'Listening...'}
              </Badge>
            )}
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
          
          {/* Chat Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message or use voice..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="text-sm"
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={!chatMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBubble;
