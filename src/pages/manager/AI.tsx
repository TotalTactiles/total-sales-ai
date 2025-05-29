
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Mic, MicOff, Send, Zap, Users, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerAI = () => {
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const shouldShowMockData = isDemoMode() || showDemo;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore AI management capabilities.');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const sendMessage = () => {
    if (message.trim()) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      setMessage('');
    }
  };

  const aiInsights = [
    {
      type: 'team',
      title: 'Team Performance Alert',
      message: 'Sarah Johnson is outperforming quota by 125%. Consider promoting to senior role.',
      priority: 'high'
    },
    {
      type: 'strategy',
      title: 'Market Opportunity',
      message: 'Enterprise segment showing 40% growth. Recommend increasing team allocation.',
      priority: 'medium'
    },
    {
      type: 'optimization',
      title: 'Process Improvement',
      message: 'Lead response time can be improved by 23% with workflow automation.',
      priority: 'low'
    }
  ];

  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Manager AI Command" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Manager AI Command & Strategic Intelligence" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Command Center</h1>
          <p className="text-muted-foreground mt-2">
            Strategic AI assistant for management decisions and team optimization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`transition-all duration-300 ${isListening ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className={`h-5 w-5 ${isListening ? 'text-blue-500 animate-pulse' : 'text-muted-foreground'}`} />
                  <CardTitle>Strategic AI Assistant</CardTitle>
                  {isListening && <Badge className="bg-blue-100 text-blue-800">Listening...</Badge>}
                  {isTyping && <Badge className="bg-green-100 text-green-800">Analyzing...</Badge>}
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
                    placeholder="Ask about team performance, strategy, or optimization..."
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
                    <span className="text-sm font-medium">Strategic AI</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hello! I'm your strategic AI assistant. I can help you with team management, 
                    performance analysis, resource allocation, and business strategy. What would you like to analyze today?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Real-time strategic recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}>
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.message}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
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
              <CardDescription>AI-powered management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-auto p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                      <Users className="h-4 w-4" />
                    </div>
                    <span>Analyze Team Performance</span>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-auto p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-100 text-green-800">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <span>Revenue Forecasting</span>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-auto p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                      <Target className="h-4 w-4" />
                    </div>
                    <span>Optimize Lead Distribution</span>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-auto p-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-800">
                      <Zap className="h-4 w-4" />
                    </div>
                    <span>Process Automation</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>AI system monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>AI Response Time</span>
                  <span className="text-green-600">0.8s</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Processing</span>
                  <span className="text-green-600">Optimal</span>
                </div>
                <div className="flex justify-between">
                  <span>Learning Rate</span>
                  <span className="text-blue-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Status</span>
                  <span className="text-green-600">Secure</span>
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
