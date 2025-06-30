
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  GraduationCap, 
  Play, 
  Trophy, 
  Clock, 
  Star, 
  CheckCircle, 
  BookOpen, 
  Video, 
  Brain,
  Zap,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';

const Academy: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all-content');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Learning progress data
  const learningProgress = {
    totalItems: 156,
    completedItems: 89,
    completionPercentage: 57,
    streak: 7,
    xp: 850,
    level: 3,
    nextLevelXp: 1000
  };

  const categories = [
    { id: 'all', name: 'All Content', count: 156 },
    { id: 'objection-handling', name: 'Objection Handling', count: 23 },
    { id: 'discovery', name: 'Discovery', count: 18 },
    { id: 'prospecting', name: 'Prospecting', count: 31 },
    { id: 'closing', name: 'Closing', count: 19 },
    { id: 'product-knowledge', name: 'Product Knowledge', count: 28 },
    { id: 'industry-insights', name: 'Industry Insights', count: 37 }
  ];

  const contentItems = [
    {
      id: '1',
      title: 'Handling Price Objections Like a Pro',
      type: 'video',
      category: 'objection-handling',
      duration: '8 min',
      difficulty: 'intermediate',
      completed: false,
      rating: 4.8,
      views: 234,
      description: 'Master the art of turning price objections into opportunities with proven frameworks',
      tags: ['objections', 'pricing', 'closing'],
      aiPick: true,
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
      rating: 4.9,
      views: 189,
      description: 'Essential questions to uncover enterprise-level pain points and decision criteria',
      tags: ['discovery', 'enterprise', 'qualification']
    },
    {
      id: '3',
      title: 'Perfect Cold Call Opening Scripts',
      type: 'script',
      category: 'prospecting',
      duration: '5 min',
      difficulty: 'beginner',
      completed: true,
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
      rating: 4.9,
      views: 445,
      description: 'Learn how to stack value so high that price becomes irrelevant',
      tags: ['value-prop', 'closing', 'psychology'],
      aiPick: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'guide': return BookOpen;
      case 'script': return BookOpen;
      default: return Play;
    }
  };

  const filteredContent = selectedCategory === 'all' 
    ? contentItems 
    : contentItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sales Academy</h1>
                <p className="text-gray-600">Your AI-powered learning companion</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{learningProgress.completionPercentage}%</div>
              <div className="text-sm text-gray-600">Complete</div>
              <div className="text-lg font-semibold text-purple-600">{learningProgress.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>

        {/* AI Insights Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6" />
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  AI Insight for You
                </h3>
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
              {/* Category Sidebar */}
              <div className="lg:col-span-1">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Grid */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredContent.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <Card key={item.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {item.aiPick && (
                                <Badge className="bg-purple-100 text-purple-700 text-xs">
                                  <Zap className="h-3 w-3 mr-1" />
                                  AI Pick
                                </Badge>
                              )}
                              {item.trending && (
                                <Badge className="bg-orange-100 text-orange-700 text-xs">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          </div>
                          {item.completed && (
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                          <TypeIcon className="h-4 w-4 text-gray-500" />
                          <Badge className={`${getDifficultyColor(item.difficulty)} text-white border-0 text-xs`}>
                            {item.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            {item.duration}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {item.rating}
                          </div>
                          <div>({item.views} views)</div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button 
                          className="w-full"
                          variant={item.completed ? "outline" : "default"}
                        >
                          <TypeIcon className="h-4 w-4 mr-2" />
                          {item.completed ? 'Review' : 'Start'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommended">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentItems.filter(item => item.aiPick).map((item) => (
                <Card key={item.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-purple-600" />
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
              {contentItems.slice(0, 2).map((item) => (
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
                    <Trophy className="h-5 w-5" />
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
                    
                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">{learningProgress.streak}</div>
                        <div className="text-sm text-slate-600">Day Learning Streak</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{learningProgress.xp} XP</div>
                        <div className="text-sm text-slate-600">Level {learningProgress.level} Closer</div>
                        <Progress value={(learningProgress.xp / learningProgress.nextLevelXp) * 100} className="h-2 mt-2" />
                        <div className="text-xs text-slate-500 mt-1">{learningProgress.nextLevelXp - learningProgress.xp} XP to next level</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Focus Areas */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
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
                      <Star className="h-4 w-4 text-yellow-500" />
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

export default Academy;
