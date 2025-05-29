
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, MessageSquare, X, Send, Minimize2 } from 'lucide-react';
import AIMessageList from './AIMessageList';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  suggestedActions?: string[];
}

const FloatingAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. I can help with lead analysis, call preparation, email drafting, and sales strategy. What would you like to work on?",
      sender: 'ai',
      timestamp: new Date(),
      suggestedActions: [
        'Analyze lead behavior',
        'Draft follow-up email',
        'Prepare for call',
        'Show objection handling'
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: generateAIResponse(message),
        sender: 'ai',
        timestamp: new Date(),
        suggestedActions: [
          'Get more details',
          'Draft email',
          'Set reminder',
          'View lead profile'
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('lead') || msg.includes('prospect')) {
      return "I can help analyze your leads! I see you have several high-priority prospects. Would you like me to prioritize them based on engagement or help draft personalized outreach messages?";
    }
    
    if (msg.includes('email') || msg.includes('message')) {
      return "I'll help you craft an effective email. Based on your lead's behavior, I recommend focusing on value proposition and including a clear call-to-action. What's the main goal of this email?";
    }
    
    if (msg.includes('call') || msg.includes('phone')) {
      return "Great! Let me help you prepare for the call. I'll analyze the lead's background, previous interactions, and suggest talking points. Do you have a specific lead in mind?";
    }
    
    return "I understand. Let me help you with that. Based on your current sales activity, I can assist with lead prioritization, content creation, or call preparation. What would be most helpful right now?";
  };

  const handleSuggestedAction = (action: string) => {
    setMessage(action);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 p-0 shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <Brain className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
        <CardHeader className="pb-3 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-700"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-700"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <AIMessageList
                messages={messages}
                onSuggestedActionClick={handleSuggestedAction}
                isLoading={isLoading}
              />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your AI assistant..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!message.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FloatingAIChat;
