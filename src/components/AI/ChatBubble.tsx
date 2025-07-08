
import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  Settings,
  Zap,
  Move,
  Plus,
  Target,
  TrendingUp,
  Phone,
  Users,
  BarChart3,
  BookOpen,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { assistantVoiceService } from '@/services/ai/assistantVoiceService';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'voice' | 'system';
  message: string;
  timestamp: string;
  workspace?: string;
  confidence?: number;
}

const ChatBubble: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [workspaceContext, setWorkspaceContext] = useState<string>('dashboard');
  const [isWakeWordActive, setIsWakeWordActive] = useState(true);
  const [alwaysListening, setAlwaysListening] = useState(true);
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [showWakeWordOverlay, setShowWakeWordOverlay] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [showGreeting, setShowGreeting] = useState(false);

  const { user } = useAuth();
  const location = useLocation();
  const dragRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Detect workspace context from URL
  useEffect(() => {
    const path = location.pathname;
    let context = 'dashboard';
    
    if (path.includes('/dialer') || path.includes('/sales/dialer')) {
      context = 'dialer';
    } else if (path.includes('/analytics') || path.includes('/sales/analytics')) {
      context = 'analytics';
    } else if (path.includes('/leads') || path.includes('/sales/leads')) {
      context = 'leads';
    } else if (path.includes('/ai-agent')) {
      context = 'ai_agent';
    } else if (path.includes('/tasks') || path.includes('/sales/tasks')) {
      context = 'tasks';
    } else if (path.includes('/academy') || path.includes('/sales/academy')) {
      context = 'academy';
    }
    
    setWorkspaceContext(context);
    
    // Add contextual greeting when workspace changes
    if (chatHistory.length === 0) {
      const greeting = getContextualGreeting(context);
      setChatHistory([{
        id: '1',
        type: 'ai',
        message: greeting,
        timestamp: new Date().toLocaleTimeString(),
        workspace: context
      }]);
    }
  }, [location.pathname]);

  // Auto-greeting after 2 minutes of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastInteraction = Date.now() - lastInteractionTime;
      if (timeSinceLastInteraction > 120000 && !showGreeting && chatHistory.length > 0) {
        setShowGreeting(true);
        const contextualPrompt = getContextualPrompt(workspaceContext);
        const greetingMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'system',
          message: `👋 Hey there! ${contextualPrompt} Need any help?`,
          timestamp: new Date().toLocaleTimeString(),
          workspace: workspaceContext
        };
        setChatHistory(prev => [...prev, greetingMessage]);
        setTimeout(() => setShowGreeting(false), 10000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [lastInteractionTime, showGreeting, chatHistory.length, workspaceContext]);

  // Initialize wake word detection and voice callbacks
  useEffect(() => {
    const initializeVoice = async () => {
      try {
        assistantVoiceService.setCommandCallback(handleVoiceCommand);
        assistantVoiceService.setWakeWordCallback(() => {
          console.log('Hey TSAM detected!');
          setShowWakeWordOverlay(true);
          
          if (isMinimized) {
            setIsMinimized(false);
            setIsExpanded(true);
          }
          
          toast.success('Hey TSAM detected! Processing your command...');
          
          const systemMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'system',
            message: '🎙️ Wake word detected - listening for command...',
            timestamp: new Date().toLocaleTimeString(),
            workspace: workspaceContext
          };
          setChatHistory(prev => [...prev, systemMessage]);
          
          setTimeout(() => setShowWakeWordOverlay(false), 3000);
        });

        if (alwaysListening) {
          const started = await assistantVoiceService.startWakeWordDetection();
          if (started) {
            setIsWakeWordActive(true);
            console.log('Always listening mode activated');
          }
        }
      } catch (error) {
        console.error('Failed to initialize voice services:', error);
        toast.error('Voice services unavailable. Please check microphone permissions.');
      }
    };

    initializeVoice();
  }, [alwaysListening, workspaceContext, isMinimized]);

  const getContextualGreeting = (context: string): string => {
    const greetings = {
      dialer: "Hi! I'm TSAM, your AI assistant. I'm monitoring your dialing activity and ready to help with call prep, lead updates, and follow-ups. Say 'Hey TSAM' anytime!",
      analytics: "Hi! I'm TSAM, your AI assistant. I'm analyzing your performance data in real-time. Ask me about metrics, trends, or insights. Say 'Hey TSAM' anytime!",
      leads: "Hi! I'm TSAM, your AI assistant. I'm observing your lead management and ready to help with updates, notes, and tasks. Say 'Hey TSAM' anytime!",
      tasks: "Hi! I'm TSAM, your AI assistant. I'm tracking your task management and ready to help with reminders and priorities. Say 'Hey TSAM' anytime!",
      academy: "Hi! I'm TSAM, your AI assistant. I'm here to help with training, answer questions, and create study plans. Say 'Hey TSAM' anytime!",
      dashboard: "Hi! I'm TSAM, your always-listening AI assistant. I'm learning from your activities to provide better support. Say 'Hey TSAM' anytime!"
    };
    
    return greetings[context as keyof typeof greetings] || greetings.dashboard;
  };

  const getContextualPrompt = (context: string): string => {
    const prompts = {
      dialer: "I noticed you're in the dialer workspace.",
      analytics: "I see you're reviewing your analytics.",  
      leads: "I see you're working on lead management.",
      tasks: "I notice you're managing your tasks.",
      academy: "I see you're in the academy workspace.",
      dashboard: "I see you're on your dashboard."
    };
    
    return prompts[context as keyof typeof prompts] || prompts.dashboard;
  };

  const getContextualSuggestions = (context: string): string[] => {
    const suggestions = {
      dialer: [
        "Hey TSAM, prep me for this call",
        "Hey TSAM, log my call summary", 
        "Hey TSAM, schedule follow-up call",
        "Hey TSAM, show me objection scripts"
      ],
      analytics: [
        "Hey TSAM, explain my conversion rates",
        "Hey TSAM, show top activities",
        "Hey TSAM, compare this vs last month", 
        "Hey TSAM, what should I improve?"
      ],
      leads: [
        "Hey TSAM, show high-priority leads",
        "Hey TSAM, update lead score",
        "Hey TSAM, add follow-up task",
        "Hey TSAM, analyze engagement patterns"
      ],
      tasks: [
        "Hey TSAM, remind me in 2 hours",
        "Hey TSAM, show today's tasks",
        "Hey TSAM, schedule meeting",
        "Hey TSAM, what's my priority?"
      ],
      academy: [
        "Hey TSAM, create study plan",
        "Hey TSAM, quiz me on objections",
        "Hey TSAM, show progress report",
        "Hey TSAM, practice scenarios"
      ]
    };
    
    return suggestions[context as keyof typeof suggestions] || [];
  };

  const getWorkspaceIcon = (context: string) => {
    const icons = {
      dialer: Phone,
      analytics: BarChart3,
      leads: Users,
      tasks: Target,
      academy: BookOpen,
      dashboard: TrendingUp
    };
    
    const IconComponent = icons[context as keyof typeof icons] || TrendingUp;
    return <IconComponent className="h-3 w-3" />;
  };

  const handleVoiceCommand = (command: string) => {
    setLastInteractionTime(Date.now());
    
    const voiceMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'voice',
      message: command,
      timestamp: new Date().toLocaleTimeString(),
      workspace: workspaceContext,
      confidence: 0.9
    };

    setChatHistory(prev => [...prev, voiceMessage]);
    handleSendMessage(command, true);
  };

  const handleSendMessage = async (messageText?: string, isVoiceCommand = false) => {
    const textToSend = messageText || chatMessage;
    if (!textToSend.trim()) return;

    setLastInteractionTime(Date.now());

    if (!isVoiceCommand) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        message: textToSend,
        timestamp: new Date().toLocaleTimeString(),
        workspace: workspaceContext
      };
      setChatHistory(prev => [...prev, userMessage]);
      setChatMessage('');
    }
    
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateContextualResponse(textToSend, workspaceContext, isVoiceCommand),
        timestamp: new Date().toLocaleTimeString(),
        workspace: workspaceContext
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateContextualResponse = (userMessage: string, context: string, isVoice: boolean): string => {
    const message = userMessage.toLowerCase();
    const prefix = isVoice ? "Voice command processed: " : "";
    
    if (context === 'analytics') {
      if (message.includes('performance') || message.includes('metrics')) {
        return `${prefix}I'm analyzing your performance data. Your call-to-meeting conversion is strong at 18%. I'll delegate to the Analytics Agent for deeper insights.`;
      }
      if (message.includes('compare') || message.includes('trend')) {
        return `${prefix}I'm delegating to the Analytics Agent for trend analysis. Based on patterns, you're up 15% in calls and 22% in meetings this month!`;
      }
    } else if (context === 'dialer') {
      if (message.includes('call') || message.includes('dial')) {
        return `${prefix}I'm delegating to the Dialer Agent to initiate the call. The dialer should open shortly. Need any talk tracks?`;
      }
      if (message.includes('prep') || message.includes('prepare')) {
        return `${prefix}I'm preparing your call materials. Based on the lead's profile, I recommend focusing on ROI and implementation timeline.`;
      }
    } else if (context === 'academy') {
      if (message.includes('study') || message.includes('learn')) {
        return `${prefix}I'm creating a personalized study plan based on your skill gaps. Focus areas: objection handling and closing techniques.`;
      }
    }
    
    const learningNote = learningEnabled ? " (Learning from this interaction)" : "";
    return `${prefix}I understand your request in the ${context} workspace and I'm processing it through the appropriate AI agents${learningNote}.`;
  };

  const toggleVoice = async () => {
    if (isListening) {
      setIsProcessingVoice(true);
      await assistantVoiceService.stopListening();
      setIsListening(false);
      setIsProcessingVoice(false);
    } else {
      const started = await assistantVoiceService.startListening(false);
      if (started) {
        setIsListening(true);
        toast.success('Listening for voice command...');
      }
    }
  };

  const toggleAlwaysListening = () => {
    setAlwaysListening(!alwaysListening);
    assistantVoiceService.setAlwaysListening(!alwaysListening);
    toast.success(`Always listening ${!alwaysListening ? 'enabled' : 'disabled'}`);
  };

  const clearHistory = () => {
    setChatHistory([]);
    toast.success('Chat history cleared');
  };

  // Wake word overlay component
  const WakeWordOverlay = () => {
    if (!showWakeWordOverlay) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
          <Brain className="h-6 w-6" />
          <div>
            <div className="font-semibold">Hey TSAM Activated</div>
            <div className="text-sm opacity-90">Listening for your command...</div>
          </div>
        </div>
      </div>
    );
  };

  // Minimized bubble view
  if (isMinimized) {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <Button
              onClick={() => {
                setIsMinimized(false);
                setIsExpanded(true);
              }}
              className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg border-2 border-white"
            >
              <Brain className="h-7 w-7 text-white" />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isWakeWordActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
            </Button>
            
            {isWakeWordActive && (
              <div className="absolute -top-8 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Hey TSAM
              </div>
            )}
          </div>
        </div>
        <WakeWordOverlay />
      </>
    );
  }

  // Expanded chat interface
  return (
    <>
      <div 
        ref={dragRef}
        className={`fixed z-50 transition-all duration-300 ${
          isFullScreen 
            ? 'inset-4' 
            : 'bottom-6 right-6'
        }`}
      >
        <Card className={`shadow-2xl border-blue-200 transition-all duration-300 ${
          isFullScreen 
            ? 'w-full h-full' 
            : 'w-96 h-[600px]'
        }`}>
          <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="relative">
                  <Brain className="h-5 w-5" />
                  <div className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 ${
                    isWakeWordActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                </div>
                TSAM Assistant
                <Badge className="bg-white/20 text-white text-xs capitalize flex items-center gap-1">
                  {getWorkspaceIcon(workspaceContext)}
                  {workspaceContext.replace('_', ' ')}
                </Badge>
                {learningEnabled && (
                  <Badge className="bg-yellow-400/20 text-white text-xs">
                    Learning
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="text-white p-1 h-auto hover:bg-white/10"
                >
                  {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
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
            
            <div className="text-xs text-blue-100 mt-1 flex items-center justify-between">
              <span>
                {alwaysListening ? `Always listening for "Hey TSAM" - ${workspaceContext} mode` : 'Voice assistance available'}
              </span>
              {chatHistory.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-blue-100 hover:text-white p-0 h-auto text-xs"
                >
                  Clear
                </Button>
              )}
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
                    {isProcessingVoice ? 'Processing' : isListening ? 'Stop Voice' : 'Voice'}
                  </span>
                </Button>
                
                <Button
                  variant={alwaysListening ? "default" : "outline"}
                  size="sm"
                  onClick={toggleAlwaysListening}
                  className="h-8 px-2"
                >
                  <Zap className="h-3 w-3" />
                  <span className="ml-1 text-xs">
                    {alwaysListening ? 'Always On' : 'Manual'}
                  </span>
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {isWakeWordActive && (
                  <Badge variant="outline" className="text-xs animate-pulse">
                    Hey TSAM Active
                  </Badge>
                )}
              </div>
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
                      className={`max-w-[85%] p-3 rounded-lg ${
                        message.type === 'user' ? 'bg-blue-600 text-white' :
                        message.type === 'voice' ? 'bg-purple-600 text-white' :
                        message.type === 'system' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {(message.type === 'voice' || message.type === 'system') && (
                        <div className="flex items-center gap-1 mb-2">
                          {message.type === 'voice' ? (
                            <>
                              <Mic className="h-3 w-3" />
                              <span className="text-xs opacity-75">Voice Command</span>
                              {message.confidence && (
                                <span className="text-xs opacity-75">({Math.round(message.confidence * 100)}%)</span>
                              )}
                            </>
                          ) : (
                            <>
                              <Brain className="h-3 w-3" />
                              <span className="text-xs opacity-75">System</span>
                            </>
                          )}
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line">{message.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.type === 'user' || message.type === 'voice' ? 
                          (message.type === 'voice' ? 'text-purple-200' : 'text-blue-200') : 
                          message.type === 'system' ? 'text-yellow-600' :
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
                    <div className="bg-slate-100 text-slate-800 p-3 rounded-lg">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Suggestions */}
            {getContextualSuggestions(workspaceContext).length > 0 && (
              <div className="p-3 border-t bg-slate-50">
                <div className="text-xs font-medium text-slate-700 mb-2">Quick Commands:</div>
                <div className="flex flex-wrap gap-1">
                  {getContextualSuggestions(workspaceContext).slice(0, 2).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatMessage(suggestion);
                        handleSendMessage(suggestion);
                      }}
                      className="text-xs h-6 px-2"
                    >
                      {suggestion.replace('Hey TSAM, ', '')}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Text Input */}
            <div className="p-3 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={`Type or say "Hey TSAM" for ${workspaceContext} help...`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="text-sm"
                />
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={!chatMessage.trim()}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <WakeWordOverlay />
    </>
  );
};

export default ChatBubble;
