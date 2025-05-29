
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Mic, MicOff, Send, Phone, Mail, FileText, Zap } from 'lucide-react';

const SalesAIAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const sendMessage = () => {
    if (message.trim()) {
      setIsTyping(true);
      // Simulate AI response
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      setMessage('');
    }
  };

  const suggestedActions = [
    { icon: Phone, label: 'Start Call Session', color: 'bg-green-100 text-green-800' },
    { icon: Mail, label: 'Draft Follow-up Email', color: 'bg-blue-100 text-blue-800' },
    { icon: FileText, label: 'Create Proposal', color: 'bg-purple-100 text-purple-800' },
    { icon: Zap, label: 'Optimize Script', color: 'bg-orange-100 text-orange-800' },
  ];

  const recentConversations = [
    {
      id: 1,
      question: "Help me prepare for a call with ABC Corp",
      response: "Based on ABC Corp's profile, focus on their cost reduction goals. Mention our 30% efficiency improvement...",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      question: "Draft an email to follow up on yesterday's demo",
      response: "I've drafted a personalized follow-up email highlighting the key features they showed interest in...",
      timestamp: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales AI Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Your intelligent sales companion for calls, emails, and strategy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`transition-all duration-300 ${isListening ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className={`h-5 w-5 ${isListening ? 'text-blue-500 animate-pulse' : 'text-muted-foreground'}`} />
                  <CardTitle>AI Assistant</CardTitle>
                  {isListening && <Badge className="bg-blue-100 text-blue-800">Listening...</Badge>}
                  {isTyping && <Badge className="bg-green-100 text-green-800">Thinking...</Badge>}
                </div>
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                  onClick={toggleListening}
                  className={isListening ? 'bg-blue-500 hover:bg-blue-600' : ''}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything about sales, leads, or strategy..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 min-h-[200px]">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">AI Assistant</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hello! I'm your sales AI assistant. I can help you with call preparation, email drafting, 
                    lead analysis, and sales strategy. What would you like to work on today?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Your latest AI interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conv) => (
                  <div key={conv.id} className="border rounded-lg p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{conv.question}</p>
                      <p className="text-sm text-muted-foreground">{conv.response}</p>
                      <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>AI-powered sales tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestedActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <span>{action.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Call Timing</p>
                  <p className="text-blue-600">Your best call times are 2-4 PM based on conversion data.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">Script Optimization</p>
                  <p className="text-green-600">Adding case studies increases your close rate by 15%.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="font-medium text-orange-800">Follow-up Strategy</p>
                  <p className="text-orange-600">Leads respond better to morning emails (9-11 AM).</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesAIAssistant;
