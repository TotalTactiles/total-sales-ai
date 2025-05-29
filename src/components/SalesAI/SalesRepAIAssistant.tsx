import React, { useState, useEffect } from 'react';
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
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { unifiedAIService } from '@/services/ai/unifiedAIService';
import { safeActionHandler } from '@/utils/actionHandler';
import { ActionTypes, validateStringParam } from '@/types/actions';

const SalesRepAIAssistant: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<Array<{id: string, type: 'user' | 'ai', message: string, timestamp: Date}>>([]);

  const {
    isListening,
    isProcessing: isVoiceProcessing,
    lastTranscription,
    startListening,
    stopListening,
    speakResponse
  } = useVoiceCommands({
    onCommand: (command) => {
      const validCommand = validateStringParam(command, 'help');
      setInputMessage(validCommand);
      handleAICommand(validCommand);
    },
    onError: (error) => {
      const errorMessage = validateStringParam(error, 'Voice command failed');
      toast.error(errorMessage);
    },
    context: 'sales_assistant'
  });

  const handleAICommand = async (command: any) => {
    const validCommand = validateStringParam(command, 'help');
    
    if (!validCommand.trim()) {
      toast.warning('Please enter a command');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Add user message to conversation
      const userMessage = {
        id: crypto.randomUUID(),
        type: 'user' as const,
        message: validCommand,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, userMessage]);

      console.log('Processing AI command:', validCommand);

      // Execute action through safe handler first
      const actionResult = await safeActionHandler.executeAction(
        ActionTypes.AI_COMMAND,
        { command: validCommand },
        'sales_assistant'
      );

      // Generate AI response using unified service
      const aiResponse = await unifiedAIService.generateResponse(
        validCommand,
        'You are a helpful sales AI assistant. Provide practical, actionable advice for sales representatives. Keep responses professional and helpful.',
        'sales_assistant'
      );

      console.log('AI response received:', aiResponse);

      if (!aiResponse.response || typeof aiResponse.response !== 'string') {
        throw new Error('Invalid response received from AI service');
      }

      const safeResponse = validateStringParam(aiResponse.response, 'I apologize, but I could not generate a response. Please try again.');

      // Add AI response to conversation with dummy indicator
      const aiMessage = {
        id: crypto.randomUUID(),
        type: 'ai' as const,
        message: `${safeResponse}\n\n${aiResponse.source === 'dummy' ? '🧪 *This is a dummy response for testing purposes*' : ''}`,
        timestamp: new Date(),
        confidence: aiResponse.confidence,
        suggestedActions: aiResponse.suggestedActions
      };
      setConversation(prev => [...prev, aiMessage]);

      // Generate voice response
      try {
        const voiceText = await unifiedAIService.generateVoiceResponse(safeResponse);
        await speakResponse(voiceText);
      } catch (voiceError) {
        console.warn('Voice response failed:', voiceError);
        // Continue without voice - response is still shown in chat
      }

      toast.success(`AI response generated successfully ${aiResponse.source === 'dummy' ? '(Test Mode)' : ''}`);
    } catch (error) {
      console.error('Error processing AI command:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process AI command';
      const safeErrorMessage = validateStringParam(errorMessage, 'An error occurred while processing your request');
      
      toast.error(safeErrorMessage);
      
      // Add error message to conversation
      const errorAiMessage = {
        id: crypto.randomUUID(),
        type: 'ai' as const,
        message: `I apologize, but I encountered an error: ${safeErrorMessage}. Please try again.\n\n🧪 *Test mode active - using dummy responses*`,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorAiMessage]);
    } finally {
      setIsProcessing(false);
      setInputMessage('');
    }
  };

  const handleQuickAction = (action: any) => {
    const validAction = validateStringParam(action, 'help');
    let command = '';
    
    switch (validAction) {
      case 'draft_email':
        command = 'Help me draft a follow-up email for my current lead';
        break;
      case 'summarize':
        command = 'Summarize my recent interactions and suggest next steps';
        break;
      case 'next_action':
        command = 'What should be my next best action to close more deals today?';
        break;
      default:
        command = 'How can I help you today?';
    }
    
    setInputMessage(command);
    handleAICommand(command);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg relative"
        >
          <Brain className="h-6 w-6" />
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
          )}
          {conversation.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs p-0">
              {conversation.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`shadow-2xl border-blue-200 transition-all duration-300 ${
        isExpanded ? 'w-96 h-[500px]' : 'w-80 h-auto'
      }`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="relative">
                <Brain className="h-5 w-5" />
                <div className="w-2 h-2 rounded-full bg-green-400 absolute -top-0.5 -right-0.5 animate-pulse"></div>
              </div>
              Sales AI Assistant
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

        <CardContent className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickAction('draft_email')}
              disabled={isProcessing}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Email
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickAction('summarize')}
              disabled={isProcessing}
            >
              <Target className="h-3 w-3 mr-1" />
              Summary
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickAction('next_action')}
              disabled={isProcessing}
            >
              <Zap className="h-3 w-3 mr-1" />
              Next
            </Button>
          </div>

          {/* Conversation History */}
          {isExpanded && conversation.length > 0 && (
            <div className="max-h-32 overflow-y-auto space-y-2 border rounded p-2">
              {conversation.slice(-3).map((msg) => (
                <div key={msg.id} className={`text-xs ${msg.type === 'user' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                  <strong>{msg.type === 'user' ? 'You:' : 'AI:'}</strong> {validateStringParam(msg.message, 'No message').substring(0, 80)}
                  {validateStringParam(msg.message, '').length > 80 ? '...' : ''}
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(validateStringParam(e.target.value, ''))}
                placeholder="Ask anything... (e.g., 'Draft follow-up email', 'Suggest objection handling')"
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
                <Button
                  onClick={isListening ? stopListening : startListening}
                  variant={isListening ? "destructive" : "outline"}
                  size="sm"
                  disabled={isVoiceProcessing}
                >
                  {isVoiceProcessing ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : isListening ? (
                    <MicOff className="h-3 w-3" />
                  ) : (
                    <Mic className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Voice Status */}
            {(isListening || isVoiceProcessing || lastTranscription) && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                {isListening && (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Listening...
                  </>
                )}
                {isVoiceProcessing && (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing...
                  </>
                )}
                {lastTranscription && !isListening && !isVoiceProcessing && (
                  <>
                    <Volume2 className="w-3 h-3" />
                    Last: {validateStringParam(lastTranscription, 'No transcription').substring(0, 30)}...
                  </>
                )}
              </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="text-xs text-blue-600 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                AI is thinking...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesRepAIAssistant;
