
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Target,
  Mic,
  MicOff,
  Send,
  Star,
  Clock
} from 'lucide-react';

const ManagerAI = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Hello! I\'m your AI Assistant CEO. I can help you analyze team performance, strategize growth, and optimize operations. What would you like to discuss today?',
      time: '9:00 AM'
    },
    {
      type: 'user',
      message: 'Show me our team performance summary for this week',
      time: '9:01 AM'
    },
    {
      type: 'ai',
      message: 'This week your team has shown excellent performance:\n\n• 23% increase in deal closure rate\n• Sarah Chen leading with 8 deals closed\n• Pipeline value up to $1.2M\n• Average deal size increased by 15%\n\nWould you like me to dive deeper into any specific metric?',
      time: '9:01 AM'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, {
        type: 'user',
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          type: 'ai',
          message: 'I understand your request. Let me analyze that for you and provide recommendations based on your team\'s current performance data.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop speech recognition
  };

  const quickActions = [
    'Analyze team performance',
    'Review pipeline health',
    'Generate strategy recommendations',
    'Check goal progress',
    'Identify bottlenecks',
    'Forecast next quarter'
  ];

  const aiInsights = [
    {
      type: 'performance',
      title: 'Team Performance Alert',
      message: 'Your team is 15% ahead of monthly targets. Consider setting stretch goals for Q4.',
      priority: 'high',
      time: '2 hours ago'
    },
    {
      type: 'strategy',
      title: 'Market Opportunity',
      message: 'AI detected increased demand in the healthcare sector. Recommend focusing 30% more effort here.',
      priority: 'medium',
      time: '4 hours ago'
    },
    {
      type: 'operations',
      title: 'Process Optimization',
      message: 'Email sequences are outperforming calls by 23%. Consider reallocating resources.',
      priority: 'medium',
      time: '6 hours ago'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant CEO</h1>
          <p className="text-gray-600">Your strategic AI partner for management decisions</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Brain className="h-3 w-3 mr-1" />
          AI Assistant Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chat Interface */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Strategy Session
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      chat.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{chat.message}</p>
                      <p className={`text-xs mt-1 ${
                        chat.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {chat.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Ask your AI Assistant CEO anything..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "outline"}
                      size="sm"
                      className="h-9 w-9 p-0"
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button onClick={handleSendMessage} size="sm" className="h-9 w-9 p-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {isListening && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    Listening...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick AI Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 text-left justify-start"
                    onClick={() => setMessage(action)}
                  >
                    <span className="text-sm">{action}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Live Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Team Performance</span>
                <Badge variant="default">115% of target</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pipeline Health</span>
                <Badge variant="secondary">Strong</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Deal Velocity</span>
                <Badge variant="outline">18 days avg</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Win Rate</span>
                <Badge variant="default">24.3%</Badge>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`p-3 border-l-4 rounded-lg ${
                    insight.priority === 'high' ? 'bg-red-50 border-red-400' :
                    insight.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{insight.time}</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${
                          insight.priority === 'high' ? 'text-red-700 border-red-200' :
                          insight.priority === 'medium' ? 'text-yellow-700 border-yellow-200' :
                          'text-blue-700 border-blue-200'
                        }`}
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Strategic Planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Performance Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Market Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Team Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Predictive Forecasting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Voice Commands</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerAI;
