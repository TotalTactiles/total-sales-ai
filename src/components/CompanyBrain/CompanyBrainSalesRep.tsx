
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  BookOpen, 
  MessageSquare, 
  Phone,
  Search,
  Star,
  Play,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Award,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useAIBrain } from '@/hooks/useAIBrain';
import { useUsageTracking } from '@/hooks/useUsageTracking';

const CompanyBrainSalesRep: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { queryKnowledge } = useAIBrain();
  const { trackEvent } = useUsageTracking();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    trackEvent({
      feature: 'company_brain_search',
      action: 'search',
      context: 'sales_rep',
      metadata: { query: searchQuery }
    });

    try {
      const results = await queryKnowledge({
        industry: 'general',
        query: searchQuery,
        topK: 5
      });
      
      if (results) {
        toast.success(`Found ${results.length} relevant results`);
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const productInfo = [
    { name: 'Core Platform', version: 'v2.1', lastUpdated: '2 days ago', confidence: 95 },
    { name: 'Analytics Module', version: 'v1.8', lastUpdated: '1 week ago', confidence: 88 },
    { name: 'Integration Suite', version: 'v1.5', lastUpdated: '3 days ago', confidence: 92 }
  ];

  const objectionScripts = [
    { objection: 'Price too high', script: 'Focus on ROI and long-term savings...', usage: 47, success: 73 },
    { objection: 'Need to think about it', script: 'Understand the decision process...', usage: 32, success: 61 },
    { objection: 'Not the right time', script: 'Explore timing concerns...', usage: 28, success: 69 }
  ];

  const callInsights = [
    { insight: 'Mention ROI within first 3 minutes', impact: 'High', category: 'Timing' },
    { insight: 'Use competitor comparison when price objection', impact: 'Medium', category: 'Objection' },
    { insight: 'Ask about decision timeline early', impact: 'High', category: 'Qualification' }
  ];

  const socialSummaries = [
    { platform: 'LinkedIn', post: 'Company announced new partnership', engagement: 'High', relevance: 'Sales opportunity' },
    { platform: 'Instagram', post: 'Behind-the-scenes office culture', engagement: 'Medium', relevance: 'Relationship building' },
    { platform: 'Facebook', post: 'Product update announcement', engagement: 'Low', relevance: 'Product knowledge' }
  ];

  const approvedContent = [
    { title: 'Best Call Opening Lines', type: 'Script', rating: 4.8, views: 234 },
    { title: 'Q4 Success Stories', type: 'Recording', rating: 4.9, views: 189 },
    { title: 'Handling Technical Questions', type: 'Guide', rating: 4.7, views: 156 },
    { title: 'Email Follow-up Templates', type: 'Template', rating: 4.6, views: 298 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Knowledge Portal</h1>
                <p className="text-slate-600">Your AI-powered sales companion</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Learning Mode Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Ask me anything... (e.g., 'How to handle price objections?', 'Product comparison', 'Best follow-up timing')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 text-lg"
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching} size="lg">
                {isSearching ? 'Searching...' : 'Ask AI'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">73%</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Scripts Used</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Learning Streak</p>
                  <p className="text-2xl font-bold text-purple-600">7 days</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">AI Tips Used</p>
                  <p className="text-2xl font-bold text-yellow-600">34</p>
                </div>
                <Lightbulb className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="objections">Objections</TabsTrigger>
            <TabsTrigger value="insights">Call Insights</TabsTrigger>
            <TabsTrigger value="social">Social Intel</TabsTrigger>
            <TabsTrigger value="learning">Learning Hub</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Today's AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">High Priority</span>
                      </div>
                      <p className="text-sm">Focus on Enterprise prospects today - 87% higher close rate detected</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Timing Insight</span>
                      </div>
                      <p className="text-sm">Best call window: 10-11 AM today based on your success patterns</p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Script Suggestion</span>
                      </div>
                      <p className="text-sm">Try the new "Value First" opening - 23% better engagement this week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Quick Wins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Follow up with TechCorp</p>
                        <p className="text-sm text-slate-600">Demo scheduled, send ROI calculator</p>
                      </div>
                      <Button size="sm">Action</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Call InnovateCo</p>
                        <p className="text-sm text-slate-600">Price objection last time - use new script</p>
                      </div>
                      <Button size="sm">Call</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Review GrowthInc proposal</p>
                        <p className="text-sm text-slate-600">Decision meeting tomorrow</p>
                      </div>
                      <Button size="sm">Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="space-y-6">
              {productInfo.map((product, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <p className="text-slate-600">{product.version} • Updated {product.lastUpdated}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {product.confidence}% AI Confidence
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Product Sheet
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Sales Scripts
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Use Cases
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="objections" className="mt-6">
            <div className="space-y-4">
              {objectionScripts.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">"{item.objection}"</h3>
                      <div className="flex items-center gap-4">
                        <Badge>Used {item.usage} times</Badge>
                        <Badge className="bg-green-100 text-green-700">{item.success}% success</Badge>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 mb-4">{item.script}</p>
                    
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Practice
                      </Button>
                      <Button variant="outline" size="sm">View Full Script</Button>
                      <Button variant="outline" size="sm">Examples</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="space-y-4">
              {callInsights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{insight.insight}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={insight.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                          {insight.impact} Impact
                        </Badge>
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">AI detected this pattern improves your call outcomes significantly</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <div className="space-y-4">
              {socialSummaries.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{item.platform[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.platform}</h3>
                          <p className="text-sm text-slate-600">{item.post}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge>{item.engagement} Engagement</Badge>
                        <p className="text-xs text-slate-500 mt-1">{item.relevance}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedContent.map((content, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{content.title}</h3>
                      <Badge variant="outline">{content.type}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(content.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                        ))}
                        <span className="text-sm text-slate-600 ml-1">{content.rating}</span>
                      </div>
                      <span className="text-sm text-slate-600">{content.views} views</span>
                    </div>
                    
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Access Content
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyBrainSalesRep;
