
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Send, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  Users,
  Target,
  MessageCircle
} from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistantPanel: React.FC = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: `Good morning! I've analyzed your team's performance overnight. Here are my key insights:\n\n• Michael Chen's call volume dropped 40% - recommend scheduling a 1-on-1\n• LinkedIn campaigns are converting 3x better than other sources\n• Sarah Johnson is on track for her best month yet`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const assistantResponse: Message = {
      id: messages.length + 2,
      type: 'assistant',
      content: `I understand you're asking about "${inputValue}". Let me analyze the current data and provide strategic recommendations based on your team's performance and business goals.`,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage, assistantResponse]);
    setInputValue('');
  };

  const quickActions = [
    { icon: TrendingUp, label: 'Performance Review', color: 'bg-green-600' },
    { icon: Users, label: 'Team Analysis', color: 'bg-blue-600' },
    { icon: Target, label: 'Goal Tracking', color: 'bg-purple-600' },
    { icon: AlertTriangle, label: 'Risk Assessment', color: 'bg-orange-600' }
  ];

  return (
    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>{profile?.assistant_name}</span>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            COO Mode
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col h-[calc(100%-5rem)]">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-auto p-3"
            >
              <div className={`p-1 ${action.color} rounded`}>
                <action.icon className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'assistant' && (
                    <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your team's performance..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistantPanel;
