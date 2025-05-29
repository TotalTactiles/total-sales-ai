
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  Minimize2, 
  Maximize2,
  X,
  Volume2,
  Loader2,
  MessageSquare,
  Zap,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { unifiedAIService, WorkspaceContext } from '@/services/ai/unifiedAIService';

interface ContextAwareAIAssistantProps {
  workspaceContext: WorkspaceContext;
  isVoiceEnabled?: boolean;
  className?: string;
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  confidence?: number;
  suggestedActions?: string[];
}

const ContextAwareAIAssistant: React.FC<ContextAwareAIAssistantProps> = ({
  workspaceContext,
  isVoiceEnabled = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [glowingOrb, setGlowingOrb] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial context-aware greeting
    const greeting = getContextualGreeting(workspaceContext);
    const initialMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      type: 'ai',
      message: greeting,
      timestamp: new Date(),
      suggestedActions: getInitialSuggestedActions(workspaceContext)
    };
    setConversation([initialMessage]);
  }, [workspaceContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const getContextualGreeting = (context: WorkspaceContext): string => {
    const greetings = {
      lead_management: "👋 I'm your Lead Management AI. I can help you analyze leads, suggest follow-up strategies, and optimize your sales pipeline.",
      academy: "📚 Welcome to your Learning Assistant! I'm here to help with training content, skill development, and personalized coaching.",
      dashboard: "📊 Your Performance AI is ready! I can analyze your metrics, identify trends, and suggest improvements.",
      analytics: "🔍 Analytics AI at your service! I can dive deep into your data, create insights, and build predictive models.",
      general: "🤖 Hello! I'm your AI assistant, ready to help with any questions or tasks you have."
    };
    return greetings[context];
  };

  const getInitialSuggestedActions = (context: WorkspaceContext): string[] => {
    const actions = {
      lead_management: ['Analyze my top leads', 'Draft follow-up email', 'Suggest next actions'],
      academy: ['Create learning plan', 'Find training content', 'Assess my skills'],
      dashboard: ['Analyze performance', 'Compare metrics', 'Set goals'],
      analytics: ['Generate insights', 'Create forecast', 'Build dashboard'],
      general: ['Get help', 'Ask question', 'Start conversation']
    };
    return actions[context];
  };

  const handleAICommand = async (command: string) => {
    if (!command.trim()) {
      toast.warning('Please enter a message');
      return;
    }

    try {
      setIsProcessing(true);
      setGlowingOrb(true);
      
      // Add user message to conversation
      const userMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        type: 'user',
        message: command,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, userMessage]);

      // Generate AI response with workspace context
      const aiResponse = await unifiedAIService.generateResponse(
        command,
        undefined,
        workspaceContext,
        'openai',
        workspaceContext
      );

      // Add AI response to conversation
      const aiMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        type: 'ai',
        message: aiResponse.response,
        timestamp: new Date(),
        confidence: aiResponse.confidence,
        suggestedActions: aiResponse.suggestedActions
      };
      setConversation(prev => [...prev, aiMessage]);

      // Voice response if enabled
      if (isVoiceEnabled) {
        try {
          const voiceText = await unifiedAIService.generateVoiceResponse(aiResponse.response);
          // Use browser's speech synthesis
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(voiceText);
            window.speechSynthesis.speak(utterance);
          }
        } catch (voiceError) {
          console.warn('Voice response failed:', voiceError);
        }
      }

      toast.success(`AI response generated ${aiResponse.source ? `(${aiResponse.source})` : ''}`);
    } catch (error) {
      console.error('Error processing AI command:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process AI command';
      
      toast.error(errorMessage);
      
      // Add error message to conversation
      const errorAiMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        type: 'ai',
        message: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorAiMessage]);
    } finally {
      setIsProcessing(false);
      setGlowingOrb(false);
      setInputMessage('');
    }
  };

  const handleSuggestedAction = (action: string) => {
    setInputMessage(action);
    handleAICommand(action);
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Speak your command');
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      handleAICommand(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Speech recognition failed');
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg relative"
        >
          <Brain className="h-6 w-6" />
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
          )}
          {conversation.length > 1 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs p-0">
              {conversation.length - 1}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`shadow-2xl border-blue-200 transition-all duration-300 ${
        isExpanded ? 'w-96 h-[600px]' : 'w-80 h-auto'
      }`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="relative">
                <Brain className="h-5 w-5" />
                {glowingOrb && (
                  <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-pulse" />
                )}
              </div>
              {workspaceContext.replace('_', ' ').toUpperCase()} AI
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
            Context-aware AI for {workspaceContext.replace('_', ' ')}
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Conversation History */}
          {isExpanded && (
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded p-2">
              {conversation.map((msg) => (
                <div key={msg.id} className={`text-xs ${msg.type === 'user' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                  <strong>{msg.type === 'user' ? 'You:' : 'AI:'}</strong> 
                  <span className="ml-1">{msg.message}</span>
                  {msg.confidence && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {Math.round(msg.confidence * 100)}%
                    </Badge>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Suggested Actions */}
          {conversation.length > 0 && conversation[conversation.length - 1].suggestedActions && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">Suggested Actions:</p>
              <div className="flex flex-wrap gap-1">
                {conversation[conversation.length - 1].suggestedActions!.slice(0, 3).map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedAction(action)}
                    className="text-xs h-6"
                    disabled={isProcessing}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask me about ${workspaceContext.replace('_', ' ')}...`}
                className="text-sm resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAICommand(inputMessage);
                  }
                }}
              />
              <div className="flex flex-col gap-1">
                <Button
                  onClick={() => handleAICommand(inputMessage)}
                  disabled={!inputMessage.trim() || isProcessing}
                  size="sm"
                >
                  {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                </Button>
                {isVoiceEnabled && (
                  <Button
                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                    variant={isListening ? "destructive" : "outline"}
                    size="sm"
                  >
                    {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Processing Status */}
            {isProcessing && (
              <div className="text-xs text-blue-600 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                AI is analyzing your request...
              </div>
            )}

            {isListening && (
              <div className="text-xs text-red-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening for voice input...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextAwareAIAssistant;
