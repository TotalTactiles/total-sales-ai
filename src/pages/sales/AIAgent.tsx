
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, Zap, TrendingUp, Users, Target } from 'lucide-react';

const AIAgent: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Hello! I\'m your AI Sales Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      type: 'user',
      message: message,
      timestamp: new Date()
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        message: 'I understand you\'re asking about lead prioritization. Based on your current pipeline, I recommend focusing on Sarah Johnson and Emily Rodriguez as they show the highest conversion probability.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Sales Agent</h1>
          <p className="text-gray-600">Your intelligent sales assistant</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <Brain className="h-3 w-3 mr-1" />
          Active
        </Badge>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Today's Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Focus on Sarah Johnson - 85% conversion probability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Hot Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">3 leads showing strong buying signals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-500" />
              Next Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Schedule demo call with Emily Rodriguez</p>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              AI Chat Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chat History */}
              <div className="h-96 border rounded-lg p-4 overflow-y-auto bg-gray-50">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`mb-4 ${chat.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-xs ${
                      chat.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-900 border'
                    }`}>
                      <p className="text-sm">{chat.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {chat.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask your AI assistant..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Zap className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAgent;
