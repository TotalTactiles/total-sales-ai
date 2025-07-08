
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
import { assistantVoiceService } from '@/services/ai/assistantVoiceService';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'voice';
  message: string;
  timestamp: string;
  workspace?: string;
}

const ChatBubble: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [workspaceContext, setWorkspaceContext] = useState<string>('dashboard');
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);

  const { user } = useAuth();
  const location = useLocation();

  // Detect workspace context from URL
  useEffect(() => {
    const path = location.pathname;
    let context = 'dashboard';
    
    if (path.includes('/dialer')) {
      context = 'dialer';
    } else if (path.includes('/analytics')) {
      context = 'analytics';
    } else if (path.includes('/leads')) {
      context = 'leads';
    } else if (path.includes('/ai-agent')) {
      context = 'ai_agent';
    }
    
    setWorkspaceContext(context);
    
    // Add contextual greeting when workspace changes
    if (chatHistory.length === 0) {
      const greeting = getContextualGreeting(context);
      setChatHistory([{
        id: '1',
        type: 'ai',
        message: greeting,
        timestamp: 'now',
        workspace: context
      }]);
    }
  }, [location.pathname]);

  // Set up voice callbacks for "Hey TSAM" activation
  useEffect(() => {
    assistantVoiceService.setCommandCallback(handleVoiceCommand);
    assistantVoiceService.setWakeWordCallback(() => {
      console.log('Hey TSAM detected!');
      if (!isExpanded) {
        setIsExpanded(true);
        setIsMinimized(false);
      }
      toast.success('Hey TSAM detected! Listening for command...');
      setIsListening(true);
    });

    // Start wake word detection when component mounts
    startWakeWordDetection();

    return () => {
      // Cleanup when component unmounts
      if (isListening) {
        assistantVoiceService.stopListening();
      }
    };
  }, [isExpanded]);

  const startWakeWordDetection = async () => {
    try {
      const started = await assistantVoiceService.startListening(true); // true for wake word mode
      if (started) {
        setIsWakeWordActive(true);
        console.log('Wake word detection started');
      }
    } catch (error) {
      console.error('Failed to start wake word detection:', error);
    }
  };

  const getContextualGreeting = (context: string): string => {
    const greetings = {
      dialer: "Hi! I'm TSAM, your AI assistant. I'm here to help with your calls - I can log call summaries, update lead statuses, schedule follow-ups, or provide talk tracks. What can I help you with?",
      analytics: "Hi! I'm TSAM, your AI assistant. I can help analyze your performance data, explain metrics, suggest improvements, or answer questions about your numbers. What would you like to explore?",
      leads: "Hi! I'm TSAM, your AI assistant. I can help manage your leads - update statuses, add notes, schedule tasks, or provide insights about specific prospects. How can I assist?",
      ai_agent: "Hi! I'm TSAM, your AI assistant. I can help configure your automation, review agent performance, or explain AI-driven insights. What do you need help with?",
      dashboard: "Hi! I'm TSAM, your AI assistant. I can help with lead management, tasks, analytics, and answer questions. You can type or speak to me - just say 'Hey TSAM' to activate voice mode!"
    };
    
    return greetings[context as keyof typeof greetings] || greetings.dashboard;
  };

  const getContextualSuggestions = (context: string): string[] => {
    const suggestions = {
      dialer: [
        "Log call summary for last prospect",
        "Update lead status to qualified",
        "Schedule follow-up call in 3 days",
        "Show me objection handling scripts"
      ],
      analytics: [
        "Explain my conversion rates",
        "Show top performing activities",
        "Compare this month vs last month",
        "What should I focus on improving?"
      ],
      leads: [
        "Show me high-priority leads",
        "Update lead score",
        "Add follow-up task",
        "Analyze lead engagement"
      ],
      ai_agent: [
        "Review agent performance",
        "Show automation metrics",
        "Configure agent settings",
        "Explain AI recommendations"
      ]
    };
    
    return suggestions[context as keyof typeof suggestions] || [];
  };

  const handleVoiceCommand = (command: string) => {
    const voiceMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'voice',
      message: command,
      timestamp: 'now',
      workspace: workspaceContext
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
        timestamp: 'now',
        workspace: workspaceContext
      };
      setChatHistory(prev => [...prev, userMessage]);
      setChatMessage('');
    }
    
    setIsTyping(true);

    // Generate contextual AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateContextualResponse(textToSend, workspaceContext),
        timestamp: 'now',
        workspace: workspaceContext
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateContextualResponse = (userMessage: string, context: string): string => {
    const message = userMessage.toLowerCase();
    
    // Context-specific responses
    if (context === 'dialer') {
      if (message.includes('call') || message.includes('dial')) {
        return "I'm initiating the call now. The dialer should open shortly. Need any talk tracks or objection handling scripts?";
      }
      if (message.includes('log') || message.includes('summary')) {
        return "I've logged the call summary. Would you like me to update the lead status or schedule a follow-up?";
      }
      if (message.includes('follow up')) {
        return "I've scheduled the follow-up task. You'll be reminded at the appropriate time. Anything else for this lead?";
      }
    } else if (context === 'analytics') {
      if (message.includes('performance') || message.includes('metrics')) {
        return "Based on your current metrics, your call-to-meeting conversion is strong at 18%. Consider focusing on email response rates to boost overall performance.";
      }
      if (message.includes('compare') || message.includes('last')) {
        return "This month you're up 15% in calls made and 22% in meetings booked compared to last month. Great momentum!";
      }
      if (message.includes('conversion')) {
        return "Your conversion rates are looking good! Your lead-to-qualified rate is 23%, and qualified-to-closed is 34%. The analytics show your best performing times are Tuesday-Thursday mornings.";
      }
    } else if (context === 'leads') {
      if (message.includes('priority') || message.includes('high')) {
        return "I've identified 5 high-priority leads that need immediate attention. Should I prioritize them in your queue?";
      }
      if (message.includes('update') && message.includes('status')) {
        return "I've updated the lead status as requested. The change has been saved to your CRM.";
      }
    }
    
    // General responses
    if (message.includes('update') && message.includes('status')) {
      return "I've updated the lead status as requested. The change has been saved to your CRM.";
    }
    
    if (message.includes('remind') || message.includes('follow up')) {
      return "I've created a reminder for you. You'll be notified at the scheduled time.";
    }
    
    return `I understand your request in the ${context} workspace. How else can I help you with your sales activities?`;
  };

  const toggleVoice = async () => {
    if (isListening) {
      setIsProcessingVoice(true);
      const command = await assistantVoiceService.stopListening();
      setIsListening(false);
      setIsProcessingVoice(false);
      
      if (command) {
        handleVoiceCommand(command.transcript);
      }
    } else {
      const started = await assistantVoiceService.startListening(false);
      if (started) {
        setIsListening(true);
        toast.success('Listening for voice command...');
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatMessage(suggestion);
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
        isExpanded ? 'w-96 h-[700px]' : 'w-80 h-[500px]'
      }`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="relative">
                <Brain className="h-5 w-5" />
                <div className="w-2 h-2 rounded-full bg-green-400 absolute -top-0.5 -right-0.5 animate-pulse"></div>
              </div>
              TSAM Assistant
              <Badge className="bg-white/20 text-white text-xs capitalize">
                {workspaceContext.replace('_', ' ')}
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
            {workspaceContext === 'dialer' && 'Ready to help with calls and lead management'}
            {workspaceContext === 'analytics' && 'Ready to analyze your performance data'}
            {workspaceContext === 'leads' && 'Ready to help manage your prospects'}
            {workspaceContext !== 'dialer' && workspaceContext !== 'analytics' && workspaceContext !== 'leads' && 'Type or speak your requests - I\'m here to help!'}
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
                disabled={isProcessingVoice}
                className="h-8 px-2"
              >
                {isProcessingVoice ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : isListening ? (
                  <MicOff className="h-3 w-3" />
                ) : (
                  <Mic className="h-3 w-3" />
                )}
                <span className="ml-1 text-xs">
                  {isProcessingVoice ? 'Processing' : isListening ? 'Stop' : 'Voice'}
                </span>
              </Button>
              
              <Badge variant={isWakeWordActive ? "default" : "outline"} className="text-xs">
                Wake Word {isWakeWordActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            {isListening && (
              <Badge variant="outline" className="text-xs animate-pulse">
                Listening... Say "Hey TSAM" anytime
              </Badge>
            )}
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
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${
                        message.type === 'user' || message.type === 'voice' ? 
                        (message.type === 'voice' ? 'text-purple-200' : 'text-blue-200') : 
                        'text-slate-500'
                      }`}>
                        {message.timestamp}
                      </p>
                      {message.workspace && (
                        <Badge variant="outline" className="text-xs ml-2 opacity-75">
                          {message.workspace}
                        </Badge>
                      )}
                    </div>
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

          {/* Quick Suggestions */}
          {getContextualSuggestions(workspaceContext).length > 0 && (
            <div className="p-3 border-t bg-slate-50">
              <div className="text-xs font-medium text-slate-700 mb-2">Quick actions:</div>
              <div className="flex flex-wrap gap-1">
                {getContextualSuggestions(workspaceContext).slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs h-6 px-2"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={`Ask about ${workspaceContext} or use voice...`}
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
