
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp,
  Users,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Activity,
  CheckCircle
} from 'lucide-react';

const ManagerAI = () => {
  const aiMetrics = {
    totalInteractions: 1247,
    automatedTasks: 89,
    efficiencyGain: 34,
    accuracy: 96.5
  };

  const aiRecommendations = [
    {
      id: '1',
      type: 'team_optimization',
      title: 'Team Performance Alert',
      description: 'Michael Chen showing signs of burnout - recommend 1-on-1 session',
      urgency: 'high',
      action: 'Schedule Meeting',
      impact: 'Prevent 15% productivity drop'
    },
    {
      id: '2',
      type: 'lead_prioritization',
      title: 'High-Value Lead Alert',
      description: 'Enterprise Corp ($200K) has been uncontacted for 3 days',
      urgency: 'high',
      action: 'Assign to Top Rep',
      impact: 'Increase close probability by 23%'
    },
    {
      id: '3',
      type: 'process_improvement',
      title: 'Workflow Optimization',
      description: 'Email templates can be AI-optimized for 18% better response rates',
      urgency: 'medium',
      action: 'Update Templates',
      impact: 'Boost team performance'
    }
  ];

  const aiAutomations = [
    {
      name: 'Lead Scoring',
      status: 'active',
      performance: 94,
      description: 'Automatically scores and prioritizes incoming leads'
    },
    {
      name: 'Email Automation',
      status: 'active',
      performance: 87,
      description: 'Sends personalized follow-up sequences'
    },
    {
      name: 'Call Scheduling',
      status: 'active',
      performance: 91,
      description: 'Optimizes call timing based on prospect behavior'
    },
    {
      name: 'Performance Analytics',
      status: 'active',
      performance: 96,
      description: 'Real-time team performance insights'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Management</h1>
          <p className="text-muted-foreground">AI-powered insights and automation controls</p>
        </div>
        <Badge className="bg-purple-500 text-white flex items-center gap-1">
          <Brain className="h-4 w-4" />
          AI Active
        </Badge>
      </div>

      {/* AI Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.totalInteractions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automated Tasks</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.automatedTasks}</div>
            <p className="text-xs text-muted-foreground">This hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Gain</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{aiMetrics.efficiencyGain}%</div>
            <p className="text-xs text-muted-foreground">vs manual processes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.accuracy}%</div>
            <p className="text-xs text-muted-foreground">Prediction accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Smart insights and suggested actions for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiRecommendations.map((rec) => (
              <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getUrgencyColor(rec.urgency)} text-white`}>
                      {rec.urgency.toUpperCase()}
                    </Badge>
                    <h3 className="font-medium">{rec.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{rec.description}</p>
                  <p className="text-xs text-green-600">Expected Impact: {rec.impact}</p>
                </div>
                <Button size="sm" variant="outline">
                  {rec.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Automations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Active Automations
            </CardTitle>
            <CardDescription>AI systems currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiAutomations.map((automation, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{automation.name}</span>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      {automation.performance}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{automation.description}</p>
                  <Progress value={automation.performance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              AI Impact Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Time Saved Daily</span>
                <span className="font-medium">4.2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conversion Rate Improvement</span>
                <span className="font-medium text-green-600">+23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lead Response Time</span>
                <span className="font-medium text-blue-600">-67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Manual Task Reduction</span>
                <span className="font-medium text-purple-600">-45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Revenue Attribution</span>
                <span className="font-medium text-green-600">$147K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerAI;
