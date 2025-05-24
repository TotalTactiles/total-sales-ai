
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User, 
  Phone,
  Mail,
  Calendar,
  FileText,
  Zap,
  CheckCircle,
  Clock,
  MessageSquare,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useAIAgent } from '@/hooks/useAIAgent';
import { Lead } from '@/types/lead';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: Suggestion[];
}

interface Suggestion {
  id: string;
  type: 'action' | 'question' | 'task';
  text: string;
  icon?: React.ComponentType<any>;
  action: string;
  priority?: 'high' | 'medium' | 'low';
}

interface ConversationInterfaceProps {
  currentLead?: Lead;
  workspace: string;
  onActionClick: (action: string, data?: any) => void;
  isExpanded: boolean;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({
  currentLead,
  workspace,
  onActionClick,
  isExpanded
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const { callAIAgent, isLoading } = useAIAgent();

  // Initialize with welcome message and suggestions
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: `Hi! I'm your AI assistant. ${currentLead ? `I can help you with ${currentLead.name} from ${currentLead.company}.` : 'How can I help you today?'}`,
      timestamp: new Date(),
      suggestions: generateContextualSuggestions()
    };
    setMessages([welcomeMessage]);
  }, [currentLead, workspace]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const generateContextualSuggestions = (): Suggestion[] => {
    const baseSuggestions: Suggestion[] = [
      {
        id: 'daily-insights',
        type: 'question',
        text: 'Show my daily insights',
        action: 'show_daily_insights',
        icon: TrendingUp
      },
      {
        id: 'next-action',
        type: 'task',
        text: 'What should I do next?',
        action: 'suggest_next_action',
        icon: Target
      }
    ];

    if (currentLead) {
      return [
        {
          id: 'call-lead',
          type: 'action',
          text: `Call ${currentLead.name}`,
          icon: Phone,
          action: 'initiate_call',
          priority: 'high'
        },
        {
          id: 'draft-email',
          type: 'action',
          text: 'Draft follow-up email',
          icon: Mail,
          action: 'draft_email',
          priority: 'medium'
        },
        {
          id: 'schedule-meeting',
          type: 'action',
          text: 'Schedule meeting',
          icon: Calendar,
          action: 'schedule_meeting',
          priority: 'medium'
        },
        {
          id: 'add-note',
          type: 'task',
          text: 'Add conversation note',
          icon: FileText,
          action: 'add_note',
          priority: 'low'
        },
        ...baseSuggestions
      ];
    }

    return baseSuggestions;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');

    try {
      // Call AI agent
      const response = await callAIAgent({
        prompt: `Context: ${workspace}. Lead: ${currentLead?.name || 'None'}. User message: ${currentInput}`
      });

      if (response) {
        // Generate new suggestions based on the conversation
        const newSuggestions = generateResponseSuggestions(currentInput, response.response);
        
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          content: response.response,
          timestamp: new Date(),
          suggestions: newSuggestions
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        type: 'ai',
        content: "I'm having trouble processing that request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const generateResponseSuggestions = (userInput: string, aiResponse: string): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    // Context-aware suggestions based on user input
    if (userInput.toLowerCase().includes('email')) {
      suggestions.push({
        id: 'send-email',
        type: 'action',
        text: 'Send this email',
        icon: Send,
        action: 'send_email',
        priority: 'high'
      });
    }
    
    if (userInput.toLowerCase().includes('call') || userInput.toLowerCase().includes('phone')) {
      suggestions.push({
        id: 'start-call',
        type: 'action',
        text: 'Start the call now',
        icon: Phone,
        action: 'initiate_call',
        priority: 'high'
      });
    }
    
    // Always include these follow-up suggestions
    suggestions.push(
      {
        id: 'clarify',
        type: 'question',
        text: 'Can you clarify this?',
        action: 'request_clarification'
      },
      {
        id: 'next-steps',
        type: 'task',
        text: 'What are my next steps?',
        action: 'show_next_steps'
      }
    );

    return suggestions;
  };

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    // Add suggestion as user message
    const userMessage: Message = {
      id: `user-suggestion-${Date.now()}`,
      type: 'user',
      content: suggestion.text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Execute the action
    onActionClick(suggestion.action, { suggestion, currentLead });

    // Generate AI response for the suggestion
    try {
      const response = await callAIAgent({
        prompt: `Execute action: ${suggestion.action}. Context: ${workspace}. Lead: ${currentLead?.name || 'None'}.`
      });

      if (response) {
        const aiMessage: Message = {
          id: `ai-suggestion-${Date.now()}`,
          type: 'ai',
          content: response.response,
          timestamp: new Date(),
          suggestions: generateContextualSuggestions()
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      toast.error('Failed to process suggestion');
    }
  };

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info('Listening... Speak now');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Conversation History */}
      <ScrollArea className={`flex-1 p-4 ${isExpanded ? 'h-96' : 'h-32'}`}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                <div className="flex items-start gap-2 mb-2">
                  {message.type === 'ai' ? <Bot className="h-4 w-4 mt-0.5" /> : <User className="h-4 w-4 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <span className="text-xs opacity-70">Quick actions:</span>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion) => (
                        <Button
                          key={suggestion.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`text-xs h-auto py-1 px-2 ${
                            message.type === 'user' 
                              ? 'border-white/20 text-white hover:bg-white/10' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {suggestion.icon && <suggestion.icon className="h-3 w-3 mr-1" />}
                          {suggestion.text}
                          {suggestion.priority === 'high' && (
                            <Badge className="ml-1 text-xs bg-red-500">!</Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message or click the mic to speak..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleVoiceToggle}
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            disabled={isLoading}
            className="px-3"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {isListening && (
          <div className="mt-2 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Listening... Speak now
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationInterface;
