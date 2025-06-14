
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  Target,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Calendar,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';

const SalesAI = () => {
  const [message, setMessage] = useState('');
  
  const aiInsights = [
    {
      type: 'opportunity',
      title: 'High-Value Lead Identified',
      description: 'Sarah Chen from TechStartup Inc shows strong buying signals based on email engagement',
      confidence: 92,
      action: 'Schedule call within 24 hours'
    },
    {
      type: 'performance',
      title: 'Call Success Rate Improving',
      description: 'Your call-to-meeting conversion rate has improved by 15% this week',
      confidence: 89,
      action: 'Continue current approach'
    },
    {
      type: 'risk',
      title: 'Deal at Risk',
      description: 'Global Solutions deal may be stalling - no response to last 3 emails',
      confidence: 78,
      action: 'Try different contact method'
    }
  ];

  const recommendations = [
    { 
      id: 1, 
      title: 'Call Maria Rodriguez at TechCorp',
      reason: 'Warm lead ready to close based on engagement patterns',
      priority: 'high',
      timeSlot: '2:30 PM',
      expectedOutcome: 'Demo scheduling'
    },
    { 
      id: 2, 
      title: 'Send follow-up to Enterprise Corp',
      reason: 'Decision maker viewed proposal 3 times yesterday',
      priority: 'high',
      timeSlot: '10:00 AM',
      expectedOutcome: 'Negotiation phase'
    },
    { 
      id: 3, 
      title: 'Update proposal for StartupXYZ',
      reason: 'Competitor analysis suggests price sensitivity',
      priority: 'medium',
      timeSlot: '3:15 PM',
      expectedOutcome: 'Competitive advantage'
    }
  ];

  const quickActions = [
    { 
      icon: Phone, 
      title: 'Smart Dialing',
      description: 'AI-optimized call sequence based on lead priority',
      action: 'Start Calling'
    },
    { 
      icon: Mail, 
      title: 'Email Assistant',
      description: 'Generate personalized emails with AI insights',
      action: 'Compose Email'
    },
    { 
      icon: Calendar, 
      title: 'Meeting Scheduler',
      description: 'AI-suggested optimal meeting times',
      action: 'Schedule Meeting'
    },
    { 
      icon: Target, 
      title: 'Lead Scoring',
      description: 'Re-score leads with latest behavioral data',
      action: 'Update Scores'
    }
  ];

  const recentInteractions = [
    { time: '2 min ago', message: 'What are the best objection responses for price concerns?' },
    { time: '15 min ago', message: 'Analyze engagement patterns for Enterprise Corp deal' },
    { time: '1 hour ago', message: 'Generate follow-up email for TechStartup meeting' },
    { time: '3 hours ago', message: 'Optimize my calling schedule for maximum conversions' }
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
          <p className="text-muted-foreground">Your intelligent sales companion</p>
        </div>
        <Badge className="bg-purple-500 text-white flex items-center gap-1">
          <Brain className="h-4 w-4" />
          AI Active
        </Badge>
      </div>

      {/* AI Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ask Your AI Assistant
          </CardTitle>
          <CardDescription>Get instant insights, suggestions, and support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about your sales process..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Brain className="h-4 w-4 mr-2" />
                Ask AI
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" size="sm">Best call times?</Button>
              <Button variant="outline" size="sm">Email templates</Button>
              <Button variant="outline" size="sm">Deal analysis</Button>
              <Button variant="outline" size="sm">Lead prioritization</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Insights
          </CardTitle>
          <CardDescription>Real-time analysis of your sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 border rounded-lg ${
                insight.type === 'opportunity' ? 'bg-green-50 border-green-200' :
                insight.type === 'performance' ? 'bg-blue-50 border-blue-200' :
                'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <p className="text-sm font-medium mt-2 text-purple-600">{insight.action}</p>
                  </div>
                  <Badge variant="secondary">{insight.confidence}% confident</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>Prioritized actions based on AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.reason}</p>
                    <p className="text-xs text-purple-600 mt-1">Expected: {rec.expectedOutcome}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{rec.timeSlot}</p>
                  <Button size="sm" className="mt-2">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>AI-powered tools at your fingertips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <action.icon className="h-8 w-8 text-purple-500" />
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-3">
                    {action.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Interactions
            </CardTitle>
            <CardDescription>Your recent AI conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInteractions.map((interaction, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{interaction.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{interaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAI;
