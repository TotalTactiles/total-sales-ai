
import React, { useState } from 'react';
import { Brain, Book, Users, Lightbulb, Search, Plus, Star, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerCompanyBrain = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore the comprehensive Company Brain knowledge management system.');
  };

  // Mock Company Brain data for managers
  const mockCompanyBrainData = {
    knowledgeCategories: [
      {
        category: 'Sales Playbooks',
        count: 24,
        recentlyUpdated: 3,
        mostUsed: 'Enterprise Sales Process',
        icon: '📊'
      },
      {
        category: 'Product Knowledge',
        count: 67,
        recentlyUpdated: 8,
        mostUsed: 'AI Features Overview',
        icon: '🛠️'
      },
      {
        category: 'Competitive Intelligence',
        count: 18,
        recentlyUpdated: 2,
        mostUsed: 'Competitor Comparison Matrix',
        icon: '⚔️'
      },
      {
        category: 'Customer Success Stories',
        count: 45,
        recentlyUpdated: 5,
        mostUsed: 'Healthcare Implementation Case',
        icon: '🏆'
      },
      {
        category: 'Training Materials',
        count: 89,
        recentlyUpdated: 12,
        mostUsed: 'Objection Handling Guide',
        icon: '🎓'
      },
      {
        category: 'Industry Insights',
        count: 34,
        recentlyUpdated: 4,
        mostUsed: 'Market Trends Q1 2024',
        icon: '📈'
      }
    ],
    popularContent: [
      {
        title: 'Advanced Objection Handling Techniques',
        category: 'Training',
        views: 342,
        rating: 4.8,
        lastUpdated: '2 days ago',
        tags: ['objections', 'closing', 'advanced']
      },
      {
        title: 'Enterprise Customer Success: TechCorp Case Study',
        category: 'Case Studies',
        views: 287,
        rating: 4.9,
        lastUpdated: '1 week ago',
        tags: ['enterprise', 'success-story', 'ROI']
      },
      {
        title: 'Healthcare Compliance Requirements Guide',
        category: 'Product Knowledge',
        views: 256,
        rating: 4.7,
        lastUpdated: '3 days ago',
        tags: ['healthcare', 'compliance', 'HIPAA']
      },
      {
        title: 'Competitive Analysis: AI Sales Tools 2024',
        category: 'Competitive Intelligence',
        views: 198,
        rating: 4.6,
        lastUpdated: '1 week ago',
        tags: ['competitors', 'AI', 'market-analysis']
      }
    ],
    teamActivity: [
      {
        user: 'Sarah Johnson',
        action: 'Created new sales script',
        content: 'Healthcare Vertical Pitch Deck',
        timestamp: '2 hours ago'
      },
      {
        user: 'Michael Chen',
        action: 'Updated knowledge article',
        content: 'Common Technical Objections',
        timestamp: '5 hours ago'
      },
      {
        user: 'Jennifer Park',
        action: 'Added case study',
        content: 'Manufacturing ROI Success Story',
        timestamp: '1 day ago'
      },
      {
        user: 'David Rodriguez',
        action: 'Completed training module',
        content: 'Advanced Discovery Questions',
        timestamp: '2 days ago'
      }
    ],
    aiRecommendations: [
      {
        type: 'content-gap',
        title: 'Missing Content Identified',
        description: 'No objection handling guide for SMB segment detected. Team asks about this topic frequently.',
        action: 'Create SMB objection guide',
        priority: 'high'
      },
      {
        type: 'update-needed',
        title: 'Outdated Pricing Information',
        description: 'Pricing guides haven\'t been updated since Q4. May cause confusion in proposals.',
        action: 'Update pricing materials',
        priority: 'medium'
      },
      {
        type: 'trending-topic',
        title: 'AI Security Questions Increasing',
        description: '45% increase in AI security questions. Consider creating dedicated content.',
        action: 'Develop AI security FAQ',
        priority: 'medium'
      }
    ],
    knowledgeMetrics: {
      totalArticles: 287,
      monthlyViews: 2847,
      activeContributors: 12,
      averageRating: 4.6,
      searchQueries: 456,
      newContentThisMonth: 23
    }
  };

  const handleCreateContent = () => {
    toast.success('Content creation wizard launched!');
  };

  const handleAssignTraining = (contentId: string) => {
    toast.success('Training module assigned to team members');
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Company Brain Knowledge Hub" 
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
        <DemoModeIndicator workspace="Company Brain - Centralized Knowledge Management System" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Brain</h1>
          <p className="text-muted-foreground mt-2">
            Centralized knowledge hub for sales excellence and team development
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
          <Button onClick={handleCreateContent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Knowledge Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Knowledge</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompanyBrainData.knowledgeMetrics.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              +{mockCompanyBrainData.knowledgeMetrics.newContentThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompanyBrainData.knowledgeMetrics.monthlyViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Team engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompanyBrainData.knowledgeMetrics.activeContributors}</div>
            <p className="text-xs text-muted-foreground">
              Active contributors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompanyBrainData.knowledgeMetrics.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Content quality score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search knowledge base, playbooks, case studies, training materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Knowledge Overview</TabsTrigger>
          <TabsTrigger value="content">Popular Content</TabsTrigger>
          <TabsTrigger value="team">Team Activity</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Knowledge Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCompanyBrainData.knowledgeCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{category.category}</CardTitle>
                        <CardDescription>{category.count} articles</CardDescription>
                      </div>
                    </div>
                    {category.recentlyUpdated > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.recentlyUpdated} new
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Most Used: </span>
                      <span className="font-medium">{category.mostUsed}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Browse {category.category}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Access Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and frequently needed resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Book className="h-6 w-6 mb-2" />
                  Sales Playbook
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Training Library
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Lightbulb className="h-6 w-6 mb-2" />
                  Best Practices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Content</CardTitle>
              <CardDescription>Top-viewed and highest-rated knowledge articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCompanyBrainData.popularContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{content.title}</h4>
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant="outline">{content.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm">{content.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{content.views} views</span>
                      </div>
                      <div className="flex gap-1">
                        {content.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{content.lastUpdated}</div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAssignTraining(content.title)}
                        >
                          Assign Training
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Training Materials</span>
                    <span className="font-semibold">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Case Studies</span>
                    <span className="font-semibold">4.7/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sales Playbooks</span>
                    <span className="font-semibold">4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Pricing Guide Updated</div>
                    <div className="text-muted-foreground">2024 pricing structure</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">New Case Study Added</div>
                    <div className="text-muted-foreground">Healthcare implementation</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Competitive Analysis Refresh</div>
                    <div className="text-muted-foreground">Q1 2024 market update</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Knowledge Activity</CardTitle>
              <CardDescription>Recent contributions and engagement from team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCompanyBrainData.teamActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.user} {activity.action}</p>
                      <p className="text-sm text-muted-foreground">"{activity.content}"</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Contribution Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sarah Johnson</span>
                    <span className="font-semibold">23 articles</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Michael Chen</span>
                    <span className="font-semibold">18 articles</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jennifer Park</span>
                    <span className="font-semibold">15 articles</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="text-red-600">• SMB objection handling</div>
                  <div className="text-orange-600">• AI security concerns</div>
                  <div className="text-yellow-600">• Pricing negotiation tactics</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Completions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-semibold text-green-600">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {mockCompanyBrainData.aiRecommendations.map((recommendation, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold">{recommendation.title}</h3>
                        <Badge variant={recommendation.priority === 'high' ? 'destructive' : 'secondary'}>
                          {recommendation.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Recommended Action: {recommendation.action}</span>
                      </div>
                    </div>
                    <Button size="sm">
                      Implement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Analytics</CardTitle>
              <CardDescription>AI-powered insights into knowledge usage and effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Most Searched Topics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Objection handling</span>
                      <span className="text-muted-foreground">89 searches</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pricing strategies</span>
                      <span className="text-muted-foreground">67 searches</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Competitive advantages</span>
                      <span className="text-muted-foreground">54 searches</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Content Performance</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Avg. Time on Page: </span>
                      <span className="font-semibold">4m 32s</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Bounce Rate: </span>
                      <span className="font-semibold">12%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Content Sharing: </span>
                      <span className="font-semibold">89%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerCompanyBrain;
