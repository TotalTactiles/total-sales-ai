import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X } from 'lucide-react';
import { useRelevanceAI } from '@/hooks/useRelevanceAI';
import { toast } from 'sonner';
import AgentFeedbackButton from '@/components/AI/AgentFeedbackButton';

interface AIAssistantPanelProps {
  currentLead: any;
  isCallActive: boolean;
  callDuration: number;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  metadata?: {
    taskId?: string;
  };
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ 
  currentLead, 
  isCallActive,
  callDuration 
}) => {
  const { executeWorkflow, isLoading } = useRelevanceAI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (!isCallActive) {
      setMessages([]);
    }
  }, [isCallActive]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const result = await executeWorkflow('sales-agent-v1', {
        message: inputMessage.trim(),
        lead: currentLead,
        callDuration,
        context: 'dialer_chat'
      });

      if (result.success) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          content: result.output.response || 'AI response received',
          sender: 'ai',
          timestamp: new Date(),
          metadata: { taskId: result.output.taskId || crypto.randomUUID() }
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to get AI response');
    }
  };

  const handleAIAssist = async (assistType: string) => {
    if (!currentLead) return;

    try {
      const result = await executeWorkflow('sales-agent-v1', {
        type: assistType,
        lead: currentLead,
        callDuration,
        context: 'dialer_assist'
      });

      if (result.success) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          content: result.output.response || `AI assistance for ${assistType} completed`,
          sender: 'ai',
          timestamp: new Date(),
          metadata: { taskId: result.output.taskId || crypto.randomUUID() }
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('AI assistance failed:', error);
      toast.error('AI assistance temporarily unavailable');
    }
  };

  return (
    <Card className={`w-80 transition-all duration-300 ${isMinimized ? 'h-12' : 'h-96'}`}>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>AI Assistant</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex-grow overflow-y-auto">
            {messages.map(message => (
              <div key={message.id} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow mr-2"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Send
            </Button>
          </div>
          
          {messages.filter(m => m.sender === 'ai' && m.metadata?.taskId).map(message => (
            <div key={message.id} className="mt-2">
              <AgentFeedbackButton 
                taskId={message.metadata.taskId}
                variant="outline"
              />
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default AIAssistantPanel;
