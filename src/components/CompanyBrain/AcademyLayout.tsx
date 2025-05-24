
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Star, 
  Clock, 
  TrendingUp, 
  Award,
  CheckCircle,
  Bookmark,
  Play,
  FileText,
  Video,
  Mic,
  Target,
  Brain,
  Lightbulb
} from 'lucide-react';
import { useEnhancedUsageTracking } from '@/hooks/useEnhancedUsageTracking';

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'audio' | 'guide' | 'script';
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  bookmarked: boolean;
  rating: number;
  views: number;
  description: string;
  tags: string[];
  aiRecommended?: boolean;
  trending?: boolean;
  addedRecently?: boolean;
}

interface LearningProgress {
  totalItems: number;
  completedItems: number;
  completionPercentage: number;
  streak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

const AcademyLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all-content');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { trackEvent, trackPageView } = useEnhancedUsageTracking();

  React.useEffect(() => {
    trackPageView('sales_rep_academy');
  }, []);

  const learningProgress: LearningProgress = {
    totalItems: 156,
    completedItems: 89,
    completionPercentage: 57,
    streak: 7,
    weeklyGoal: 15,
    weeklyProgress: 12
  };

  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Handling Price Objections Like a Pro',
      type: 'video',
      category: 'objection-handling',
      duration: '8 min',
      difficulty: 'intermediate',
      completed: false,
      bookmarked: true,
      rating: 4.8,
      views: 234,
      description: 'Master the art of turning price objections into opportunities with proven frameworks',
      tags: ['objections', 'pricing', 'closing'],
      aiRecommended: true,
      trending: true
    },
    {
      id: '2',
      title: 'Enterprise Sales Discovery Questions',
      type: 'guide',
      category: 'discovery',
      duration: '12 min',
      difficulty: 'advanced',
      completed: true,
      bookmarked: false,
      rating: 4.9,
      views: 189,
      description: 'Essential questions to uncover enterprise-level pain points and decision criteria',
      tags: ['discovery', 'enterprise', 'qualification'],
      addedRecently: true
    },
    {
      id: '3',
      title: 'Perfect Cold Call Opening Scripts',
      type: 'script',
      category: 'prospecting',
      duration: '5 min',
      difficulty: 'beginner',
      completed: true,
      bookmarked: true,
      rating: 4.7,
      views: 298,
      description: 'Tested opening scripts that get past gatekeepers and create instant rapport',
      tags: ['cold-calling', 'scripts', 'prospecting']
    },
    {
      id: '4',
      title: 'Alex Hormozi: Value Stacking Masterclass',
      type: 'video',
      category: 'closing',
      duration: '15 min',
      difficulty: 'intermediate',
      completed: false,
      bookmarked: false,
      rating: 4.9,
      views: 445,
      description: 'Learn how to stack value so high that price becomes irrelevant',
      tags: ['value-prop', 'closing', 'psychology'],
      aiRecommended: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Content', count: 156 },
    { id: 'objection-handling', name: 'Objection Handling', count: 23 },
    { id: 'discovery', name: 'Discovery', count: 18 },
    { id: 'prospecting', name: 'Prospecting', count: 31 },
    { id: 'closing', name: 'Closing', count: 19 },
    { id: 'product-knowledge', name: 'Product Knowledge', count: 28 },
    { id: 'industry-insights', name: 'Industry Insights', count: 37 }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'script': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleContentClick = (item: ContentItem) => {
    trackEvent({
      feature: 'academy_content',
      action: 'view',
      context: item.category,
      metadata: { 
        contentId: item.id, 
        contentType: item.type,
        difficulty: item.difficulty,
        aiRecommended: item.aiRecommended 
      }
    });
  };

  const toggleBookmark = (itemId: string) => {
    trackEvent({
      feature: 'academy_bookmark',
      action: 'toggle',
      context: 'content_library',
      metadata: { contentId: itemId }
    });
  };

  const markComplete = (itemId: string) => {
    trackEvent({
      feature: 'academy_completion',
      action: 'mark_complete',
      context: 'learning_progress',
      metadata: { contentId: itemId }
    });
  };

  const filteredContent = selectedCategory === 'all' 
    ? contentItems 
    : contentItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Sales Academy</h1>
                <p className="text-slate-600">Your AI-powered learning companion</p>
              </div>
            </div>
            
            {/* Progress Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{learningProgress.completionPercentage}%</div>
                    <div className="text-xs text-slate-600">Complete</div>
                  </div>
                  <div className="w-16 h-16 relative">
                    <Progress 
                      value={learningProgress.completionPercentage} 
                      className="transform rotate-90 w-16"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{learningProgress.streak}</div>
                    <div className="text-xs text-slate-600">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Insights Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6" />
              <div className="flex-1">
                <h3 className="font-semibold">AI Insight for You</h3>
                <p className="text-sm text-purple-100">
                  You excel at discovery but struggle with price objections. I've curated 3 videos that will boost your close rate by 23%.
                </p>
              </div>
              <Button variant="secondary" size="sm">
                View Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all-content">All Content</TabsTrigger>
            <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
            <TabsTrigger value="latest">Latest Updates</TabsTrigger>
            <TabsTrigger value="progress">Your Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="all-content">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Categories */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className="w-full justify-between"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary">{category.count}</Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content Grid */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredContent.map((item) => (
                  <Card 
                    key={item.id} 
                    className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleContentClick(item)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="text-sm text-slate-600 capitalize">{item.type}</span>
                          {item.aiRecommended && (
                            <Badge className="bg-purple-100 text-purple-700">
                              <Lightbulb className="h-3 w-3 mr-1" />
                              AI Pick
                            </Badge>
                          )}
                          {item.trending && (
                            <Badge className="bg-orange-100 text-orange-700">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(item.id);
                            }}
                            className="p-1 h-auto"
                          >
                            <Bookmark className={`h-4 w-4 ${item.bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
                          </Button>
                          {item.completed && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{item.duration}</span>
                        </div>
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-slate-600">{item.rating}</span>
                          <span className="text-xs text-slate-500">({item.views} views)</span>
                        </div>
                        
                        {!item.completed ? (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markComplete(item.id);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommended">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentItems.filter(item => item.aiRecommended).map((item) => (
                <Card key={item.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <Badge className="bg-purple-100 text-purple-700">AI Recommended</Badge>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-700">
                        <strong>Why this helps:</strong> Based on your call patterns, this will improve your objection handling by 34%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="latest">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentItems.filter(item => item.addedRecently).map((item) => (
                <Card key={item.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <Badge className="bg-green-100 text-green-700">New</Badge>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall Completion</span>
                        <span className="text-sm text-slate-600">{learningProgress.completedItems}/{learningProgress.totalItems}</span>
                      </div>
                      <Progress value={learningProgress.completionPercentage} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Weekly Goal</span>
                        <span className="text-sm text-slate-600">{learningProgress.weeklyProgress}/{learningProgress.weeklyGoal}</span>
                      </div>
                      <Progress value={(learningProgress.weeklyProgress / learningProgress.weeklyGoal) * 100} className="h-3" />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">{learningProgress.streak}</div>
                        <div className="text-sm text-slate-600">Day Learning Streak</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Struggling Areas */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="font-medium text-red-700">Price Objections</div>
                      <div className="text-sm text-red-600">3 resources recommended</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-700">Enterprise Discovery</div>
                      <div className="text-sm text-yellow-600">2 resources recommended</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-700">Cold Calling</div>
                      <div className="text-sm text-green-600">Strength - 92% success rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div className="text-sm">
                        <div className="font-medium">Completed "Cold Call Scripts"</div>
                        <div className="text-slate-600">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Bookmark className="h-4 w-4 text-yellow-500" />
                      <div className="text-sm">
                        <div className="font-medium">Bookmarked "Value Stacking"</div>
                        <div className="text-slate-600">5 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Play className="h-4 w-4 text-blue-500" />
                      <div className="text-sm">
                        <div className="font-medium">Started "Enterprise Discovery"</div>
                        <div className="text-slate-600">1 day ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AcademyLayout;
