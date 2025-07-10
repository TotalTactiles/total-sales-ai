
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Mic, MicOff, MessageSquare, Minimize2, Maximize2 } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { isAIEnabled } from '@/ai/config/AIConfig';
import AIDisabledState from '@/components/ai/AIDisabledState';
import { toast } from 'sonner';

interface ManagerAIBubbleProps {
  workspace: string;
  context?: any;
}

const ManagerAIBubble: React.FC<ManagerAIBubbleProps> = ({ workspace, context }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);

  const {
    isListening,
    isProcessing,
    transcript,
    response,
    error,
    startListening,
    stopListening,
    clearError
  } = useVoiceInteraction({
    context: workspace,
    workspaceData: context,
    wakeWords: ['hey tsam', 'hey assistant']
  });

  useEffect(() => {
    if (transcript) {
      setConversation(prev => [...prev, {
        role: 'user',
        content: transcript,
        timestamp: new Date()
      }]);
    }
  }, [transcript]);

  useEffect(() => {
    if (response) {
      setConversation(prev => [...prev, {
        role: 'ai',
        content: response,
        timestamp: new Date()
      }]);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleToggleListening = async () => {
    if (!isAIEnabled('VOICE_ASSISTANT')) {
      toast.info('AI Voice Assistant temporarily paused');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  const quickActions = [
    { label: 'Team Summary', icon: <MessageSquare className="h-3 w-3" /> },
    { label: 'Performance Insights', icon: <Brain className="h-3 w-3" /> },
    { label: 'Risk Analysis', icon: <Brain className="h-3 w-3" /> },
    { label: 'Goal Progress', icon: <Brain className="h-3 w-3" /> }
  ];

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsExpanded(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            disabled={!isAIEnabled()}
          >
            {isAIEnabled() ? (
              <Brain className="h-6 w-6 text-white" />
            ) : (
              <Brain className="h-6 w-6 text-white opacity-50" />
            )}
          </Button>
          
          {!isAIEnabled() && (
            <div className="absolute -top-8 right-0 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs border">
              AI Paused
            </div>
          )}

          {isAIEnabled() && (
            <div className="absolute bottom-16 right-0 space-y-2 opacity-0 hover:opacity-100 transition-opacity">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm border-gray-200 text-xs whitespace-nowrap"
                  disabled={!isAIEnabled()}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-96 shadow-xl">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Manager AI Assistant</span>
              {!isAIEnabled() && (
                <span className="text-xs text-red-500">(Paused)</span>
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

          {!isAIEnabled('VOICE_ASSISTANT') ? (
            <AIDisabledState 
              feature="Manager AI Assistant" 
              message="AI temporarily paused"
              size="lg"
            />
          ) : (
            <>
              {/* Voice Controls */}
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={handleToggleListening}
                  variant={isListening ? "destructive" : "default"}
                  size="sm"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isListening ? 'Stop' : 'Listen'}
                </Button>
              </div>

              {/* Conversation */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {conversation.length === 0 && (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>Say "Hey TSAM" to activate</p>
                    <p className="text-xs mt-1">Your AI Manager Assistant</p>
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
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
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

              {/* Status */}
              {transcript && (
                <div className="text-xs text-gray-600 p-2 bg-blue-50 rounded">
                  Heard: "{transcript}"
                </div>
              )}
              
              {error && (
                <div className="text-xs text-red-600 p-2 bg-red-50 rounded flex justify-between items-center">
                  {error}
                  <Button onClick={clearError} variant="ghost" size="sm">
                    Clear
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerAIBubble;
