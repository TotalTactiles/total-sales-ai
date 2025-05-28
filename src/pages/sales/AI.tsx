
import React, { useState } from 'react';
import { Bot, Brain, MessageSquare, Mail, Phone, BarChart3, Lightbulb, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const SalesAI = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore AI-powered sales assistance with comprehensive features.');
  };

  // Mock AI data
  const mockAIData = {
    insights: [
      {
        id: '1',
        type: 'opportunity',
        title: 'High-Value Lead Ready for Demo',
        description: 'Sarah Chen from TechCorp shows 85% conversion likelihood. Budget approved, timeline confirmed. Recommend immediate demo scheduling.',
        confidence: 92,
        action: 'Schedule demo',
        timestamp: '2 hours ago',
        leadId: '1'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Lead Going Cold',
        description: 'David Thompson hasn\'t responded in 6 days. Consider different approach or re-engagement campaign.',
        confidence: 78,
        action: 'Send re-engagement sequence',
        timestamp: '4 hours ago',
        leadId: '4'
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Optimal Contact Time Detected',
        description: 'Jennifer Park opens emails consistently at 8:30 AM EST. Schedule follow-up accordingly.',
        confidence: 85,
        action: 'Schedule 8:30 AM follow-up',
        timestamp: '1 day ago',
        leadId: '3'
      }
    ],
    recentActions: [
      {
        type: 'email_draft',
        title: 'Generated follow-up email for TechCorp',
        timestamp: '30 minutes ago',
        status: 'sent'
      },
      {
        type: 'call_script',
        title: 'Created objection handling script',
        timestamp: '2 hours ago',
        status: 'pending'
      },
      {
        type: 'proposal',
        title: 'Drafted proposal for Manufacturing Co',
        timestamp: '5 hours ago',
        status: 'reviewed'
      }
    ],
    templates: [
      {
        id: '1',
        name: 'Cold Outreach - Enterprise',
        category: 'Email',
        usage: 23,
        effectiveness: 68
      },
      {
        id: '2',
        name: 'Follow-up After Demo',
        category: 'Email',
        usage: 45,
        effectiveness: 82
      },
      {
        id: '3',
        name: 'Discovery Call Script',
        category: 'Call',
        usage: 31,
        effectiveness: 75
      }
    ],
    automations: [
      {
        id: '1',
        name: 'New Lead Welcome Sequence',
        type: 'Email Sequence',
        status: 'active',
        triggered: 12,
        converted: 4
      },
      {
        id: '2',
        name: 'Demo Follow-up Automation',
        type: 'Multi-touch',
        status: 'active',
        triggered: 8,
        converted: 3
      },
      {
        id: '3',
        name: 'Re-engagement Campaign',
        type: 'Email + SMS',
        status: 'paused',
        triggered: 15,
        converted: 2
      }
    ]
  };

  const handleAIPrompt = () => {
    if (!aiPrompt.trim()) return;
    
    toast.success('AI is processing your request...');
    setAiPrompt('');
    
    // Simulate AI response
    setTimeout(() => {
      toast.info('AI response generated! Check the insights tab for recommendations.');
    }, 2000);
  };

  const handleUseTemplate = (templateId: string) => {
    toast.success('Template loaded into composer!');
  };

  const handleToggleAutomation = (automationId: string) => {
    toast.info('Automation settings updated!');
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="AI Sales Assistant" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Demo Mode Indicator */}
      {shouldShowMockData && (
        <DemoModeIndicator workspace="AI Sales Assistant & Automation" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Sales Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Intelligent automation and insights to supercharge your sales process
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Bot className="h-3 w-3 mr-1" />
          AI Active
        </Badge>
      </div>

      {/* AI Prompt Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Ask Your AI Assistant
          </CardTitle>
          <CardDescription>
            Get instant help with lead analysis, content creation, and sales strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ask me anything... 'Draft an email to Sarah Chen about our upcoming demo' or 'Analyze my pipeline for this week'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                <Mail className="h-3 w-3 mr-1" />
                Email Drafting
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Phone className="h-3 w-3 mr-1" />
                Call Scripts
              </Badge>
              <Badge variant="outline" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Lead Analysis
              </Badge>
            </div>
            <Button onClick={handleAIPrompt} disabled={!aiPrompt.trim()}>
              <Zap className="h-4 w-4 mr-2" />
              Get AI Help
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="templates">Smart Templates</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockAIData.insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        insight.type === 'opportunity' ? 'bg-green-500' :
                        insight.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                    <Button size="sm" variant="outline">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      {insight.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAIData.templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Used</span>
                      <div className="font-semibold">{template.usage} times</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Effectiveness</span>
                      <div className="font-semibold">{template.effectiveness}%</div>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Template</CardTitle>
              <CardDescription>
                Let AI help you create personalized templates based on your best-performing content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                <Bot className="h-4 w-4 mr-2" />
                Generate AI Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
          <div className="space-y-4">
            {mockAIData.automations.map((automation) => (
              <Card key={automation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{automation.name}</h3>
                      <p className="text-sm text-muted-foreground">{automation.type}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{automation.triggered}</div>
                        <div className="text-xs text-muted-foreground">Triggered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{automation.converted}</div>
                        <div className="text-xs text-muted-foreground">Converted</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={automation.status === 'active' ? 'default' : 'secondary'}
                        >
                          {automation.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleAutomation(automation.id)}
                        >
                          {automation.status === 'active' ? 'Pause' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Automation</CardTitle>
              <CardDescription>
                Set up intelligent workflows to nurture leads automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Build Automation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Activity</CardTitle>
              <CardDescription>
                Your AI assistant's latest actions and contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAIData.recentActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {action.type === 'email_draft' && <Mail className="h-4 w-4 text-blue-600" />}
                        {action.type === 'call_script' && <Phone className="h-4 w-4 text-green-600" />}
                        {action.type === 'proposal' && <BarChart3 className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.timestamp}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={action.status === 'sent' ? 'default' : 
                               action.status === 'pending' ? 'secondary' : 'outline'}
                    >
                      {action.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesAI;
