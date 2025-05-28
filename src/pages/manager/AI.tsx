
import React, { useState } from 'react';
import { Bot, Brain, MessageSquare, BarChart3, Lightbulb, Zap, Target, TrendingUp, Users, AlertTriangle } from 'lucide-react';
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

const ManagerAI = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Experience AI-powered management insights and team optimization.');
  };

  // Mock AI data for managers
  const mockManagerAI = {
    strategicInsights: [
      {
        id: '1',
        type: 'opportunity',
        title: 'Team Performance Optimization',
        description: 'AI analysis shows Sarah Johnson could mentor 2 junior reps, potentially increasing team productivity by 23%.',
        confidence: 94,
        action: 'Create mentorship program',
        impact: 'High',
        timeframe: 'This week'
      },
      {
        id: '2',
        type: 'alert',
        title: 'Pipeline Risk Detection',
        description: 'Michael Chen shows declining performance patterns. Early intervention could prevent 35% quota miss.',
        confidence: 87,
        action: 'Schedule coaching session',
        impact: 'Critical',
        timeframe: 'Immediately'
      },
      {
        id: '3',
        type: 'trend',
        title: 'Market Opportunity Identified',
        description: 'Healthcare sector leads show 45% higher conversion rates. Consider team specialization.',
        confidence: 91,
        action: 'Reallocate resources',
        impact: 'Medium',
        timeframe: 'Next month'
      }
    ],
    teamOptimization: [
      {
        category: 'Lead Distribution',
        recommendation: 'Redistribute 15 high-value leads from Sarah to David for skill development',
        expectedImpact: '+18% team conversion rate',
        confidence: 89
      },
      {
        category: 'Training Focus',
        recommendation: 'Team-wide objection handling workshop could improve close rates by 22%',
        expectedImpact: '+$340K quarterly revenue',
        confidence: 85
      },
      {
        category: 'Process Improvement',
        recommendation: 'Automate follow-up reminders to reduce response time by 40%',
        expectedImpact: '+12% lead engagement',
        confidence: 92
      }
    ],
    marketIntelligence: [
      {
        insight: 'LinkedIn outreach shows 67% higher response rates on Tuesday afternoons',
        action: 'Optimize team scheduling',
        department: 'Sales Operations'
      },
      {
        insight: 'Enterprise leads require 3.2 touchpoints before qualification on average',
        action: 'Adjust lead nurturing sequences',
        department: 'Marketing'
      },
      {
        insight: 'Referral leads convert 2.4x faster than cold outreach',
        action: 'Expand referral program',
        department: 'Business Development'
      }
    ],
    automationOpportunities: [
      {
        id: '1',
        name: 'Performance Alert System',
        description: 'Automatically notify managers when rep performance drops below threshold',
        status: 'recommended',
        savings: '8 hours/week',
        complexity: 'Low'
      },
      {
        id: '2',
        name: 'Lead Scoring Enhancement',
        description: 'AI-powered lead scoring based on team historical performance',
        status: 'in-progress',
        savings: '15 hours/week',
        complexity: 'Medium'
      },
      {
        id: '3',
        name: 'Predictive Coaching',
        description: 'Identify coaching needs before performance issues arise',
        status: 'planning',
        savings: '20 hours/week',
        complexity: 'High'
      }
    ],
    recentAIActions: [
      {
        action: 'Optimized lead distribution algorithm',
        impact: 'Team conversion rate increased by 12%',
        timestamp: '2 hours ago',
        category: 'optimization'
      },
      {
        action: 'Generated performance improvement plan for Michael Chen',
        impact: 'Identified 5 key development areas',
        timestamp: '5 hours ago',
        category: 'coaching'
      },
      {
        action: 'Analyzed competitor pricing strategy',
        impact: 'Recommended pricing adjustments for 3 products',
        timestamp: '1 day ago',
        category: 'strategy'
      }
    ]
  };

  const handleAIPrompt = () => {
    if (!aiPrompt.trim()) return;
    
    toast.success('AI is analyzing your request with management context...');
    setAiPrompt('');
    
    // Simulate AI response
    setTimeout(() => {
      toast.info('Strategic insights generated! Check the insights tab for detailed recommendations.');
    }, 2000);
  };

  const handleImplementRecommendation = (recommendationId: string) => {
    toast.success('Implementation plan created! Team will be notified of changes.');
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Manager AI Assistant" 
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
        <DemoModeIndicator workspace="AI-Powered Management & Team Optimization" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Management Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Strategic insights, team optimization, and predictive management tools
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Bot className="h-3 w-3 mr-1" />
            AI Active
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Brain className="h-3 w-3 mr-1" />
            Strategic Mode
          </Badge>
        </div>
      </div>

      {/* AI Command Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Strategic AI Assistant
          </CardTitle>
          <CardDescription>
            Get management insights, team optimization recommendations, and strategic analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ask me about team performance, lead optimization, coaching recommendations, or strategic insights..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Team Analysis
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Performance Optimization
              </Badge>
              <Badge variant="outline" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Strategic Planning
              </Badge>
            </div>
            <Button onClick={handleAIPrompt} disabled={!aiPrompt.trim()}>
              <Zap className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
          <TabsTrigger value="optimization">Team Optimization</TabsTrigger>
          <TabsTrigger value="intelligence">Market Intelligence</TabsTrigger>
          <TabsTrigger value="automation">AI Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockManagerAI.strategicInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        insight.type === 'opportunity' ? 'bg-green-500' :
                        insight.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                      <Badge variant={insight.impact === 'Critical' ? 'destructive' : 
                                     insight.impact === 'High' ? 'default' : 'secondary'}>
                        {insight.impact}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Timeline: </span>
                        <span className="text-xs font-medium">{insight.timeframe}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleImplementRecommendation(insight.id)}
                    >
                      <Lightbulb className="h-3 w-3 mr-1" />
                      {insight.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent AI Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Analysis & Actions</CardTitle>
              <CardDescription>Latest AI-driven insights and automated improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockManagerAI.recentAIActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {action.category === 'optimization' && <TrendingUp className="h-4 w-4 text-blue-600" />}
                        {action.category === 'coaching' && <Users className="h-4 w-4 text-green-600" />}
                        {action.category === 'strategy' && <Target className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{action.action}</p>
                        <p className="text-sm text-muted-foreground">{action.impact}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{action.category}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{action.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="space-y-4">
            {mockManagerAI.teamOptimization.map((optimization, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{optimization.category}</h3>
                        <Badge variant="outline" className="text-xs">
                          {optimization.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{optimization.recommendation}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-green-600">
                          Expected Impact: {optimization.expectedImpact}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Implement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team Performance Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Matrix</CardTitle>
              <CardDescription>AI analysis of team strengths and improvement opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">High Performers</h4>
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <p className="text-xs text-green-700">Ready for leadership roles</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Steady Contributors</h4>
                  <div className="text-2xl font-bold text-blue-600">4</div>
                  <p className="text-xs text-blue-700">Meeting expectations</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">Need Support</h4>
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <p className="text-xs text-yellow-700">Coaching opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Intelligence & Insights</CardTitle>
              <CardDescription>AI-powered market analysis and competitive intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockManagerAI.marketIntelligence.map((intel, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{intel.insight}</h4>
                      <Badge variant="outline">{intel.department}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Recommended Action: {intel.action}
                    </p>
                    <Button size="sm" variant="outline">
                      Implement Strategy
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900">🚨 Threat Alert</h4>
                    <p className="text-red-700 text-sm">Competitor X reduced prices by 15% in healthcare segment</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">🎯 Opportunity</h4>
                    <p className="text-green-700 text-sm">Gap identified in SMB market for AI-powered solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Adoption in Sales</span>
                    <span className="font-semibold text-green-600">+67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Remote Selling</span>
                    <span className="font-semibold text-blue-600">+23%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Video-First Demos</span>
                    <span className="font-semibold text-purple-600">+45%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="space-y-4">
            {mockManagerAI.automationOpportunities.map((automation) => (
              <Card key={automation.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{automation.name}</h3>
                        <Badge 
                          variant={automation.status === 'recommended' ? 'default' : 
                                   automation.status === 'in-progress' ? 'secondary' : 'outline'}
                        >
                          {automation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{automation.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-blue-600">
                          Time Savings: {automation.savings}
                        </span>
                        <span className="text-sm">
                          Complexity: {automation.complexity}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant={automation.status === 'recommended' ? 'default' : 'outline'}
                      size="sm"
                    >
                      {automation.status === 'recommended' ? 'Deploy' : 
                       automation.status === 'in-progress' ? 'Monitor' : 'Plan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Automation Impact Dashboard</CardTitle>
              <CardDescription>ROI and efficiency gains from AI automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">43</div>
                  <div className="text-sm text-blue-700">Hours Saved Weekly</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-green-700">Process Accuracy</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$2.3M</div>
                  <div className="text-sm text-purple-700">Projected Annual Savings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerAI;
