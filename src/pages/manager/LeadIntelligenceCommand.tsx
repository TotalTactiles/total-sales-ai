
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Filter,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

const LeadIntelligenceCommand = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('Analysis complete');
    }, 2000);
  };

  const leadInsights = [
    {
      id: 1,
      title: 'High-Intent Prospects',
      description: 'Leads showing strong buying signals',
      count: 23,
      trend: '+12%',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Warm Nurture Candidates',
      description: 'Leads ready for follow-up',
      count: 45,
      trend: '+8%',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Cold Prospects',
      description: 'Leads requiring activation',
      count: 78,
      trend: '-3%',
      priority: 'low'
    }
  ];

  const aiRecommendations = [
    {
      id: 1,
      title: 'Focus on Enterprise Leads',
      description: 'Your team closes 40% more enterprise deals than SMB',
      confidence: 89,
      impact: 'High'
    },
    {
      id: 2,
      title: 'Optimize Follow-up Timing',
      description: 'Leads contacted within 2 hours have 3x higher conversion',
      confidence: 76,
      impact: 'Medium'
    },
    {
      id: 3,
      title: 'Leverage Warm Introductions',
      description: 'Referral leads convert 5x better than cold outreach',
      confidence: 92,
      impact: 'High'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Intelligence Command</h1>
        <p className="text-gray-600">AI-powered lead analysis and recommendations</p>
      </div>

      {/* Search and Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Lead Analysis
          </CardTitle>
          <CardDescription>
            Ask questions about your leads, pipeline, and conversion patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Ask about your leads... (e.g., 'Which leads are most likely to close this month?')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Lead Insights</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge variant={insight.priority === 'high' ? 'destructive' : 
                                  insight.priority === 'medium' ? 'default' : 'secondary'}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{insight.count}</div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">{insight.trend}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {aiRecommendations.map((rec) => (
              <Card key={rec.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Confidence:</span>
                          <Badge variant="outline">{rec.confidence}%</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Impact:</span>
                          <Badge variant={rec.impact === 'High' ? 'destructive' : 'default'}>
                            {rec.impact}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Performance analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadIntelligenceCommand;
