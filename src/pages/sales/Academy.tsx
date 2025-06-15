
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  Award, 
  Clock, 
  Star,
  PlayCircle,
  FileText,
  Users,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

const SalesAcademy = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Content');

  const categories = [
    { name: 'All Content', count: 156 },
    { name: 'Objection Handling', count: 23 },
    { name: 'Discovery', count: 18 },
    { name: 'Prospecting', count: 31 },
    { name: 'Closing', count: 19 },
    { name: 'Product Knowledge', count: 28 },
    { name: 'Industry Insights', count: 37 }
  ];

  const recommendedContent = [
    {
      title: 'Handling Price Objections Like a Pro',
      description: 'Master the art of turning price objections into opportunities with proven frameworks',
      duration: '8 min',
      rating: 4.8,
      views: 234,
      type: 'Video',
      difficulty: 'intermediate',
      tags: ['objections', 'pricing', 'closing']
    },
    {
      title: 'Enterprise Sales Discovery Questions',
      description: 'Essential questions to uncover enterprise-level pain points and decision criteria',
      duration: '12 min',
      rating: 4.9,
      views: 189,
      type: 'Guide',
      difficulty: 'advanced',
      tags: ['discovery', 'enterprise', 'qualification']
    }
  ];

  const latestContent = [
    {
      title: 'Perfect Cold Call Opening Scripts',
      description: 'Tested opening scripts that get past gatekeepers and create instant rapport',
      duration: '5 min',
      rating: 4.7,
      views: 298,
      type: 'Script',
      difficulty: 'beginner',
      tags: ['cold-calling', 'scripts', 'prospecting']
    },
    {
      title: 'Alex Hormozi: Value Stacking Masterclass',
      description: 'Learn how to stack value so high that price becomes irrelevant',
      duration: '15 min',
      rating: 4.9,
      views: 445,
      type: 'Video',
      difficulty: 'intermediate',
      tags: ['value-prop', 'closing', 'psychology']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video className="h-4 w-4" />;
      case 'Script': return <FileText className="h-4 w-4" />;
      case 'Guide': return <BookOpen className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 rounded-xl">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales Academy</h1>
            <p className="text-muted-foreground">Your AI-powered learning companion</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">57%</p>
            <p className="text-sm text-muted-foreground">Complete</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">7</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6" />
              <div>
                <h3 className="font-bold">AI Insight for You</h3>
                <p className="text-white/90">
                  You excel at discovery but struggle with price objections. I've curated 3 videos that will boost your close rate by 23%.
                </p>
              </div>
            </div>
            <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              View Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <div className="flex gap-6 border-b">
        {['All Content', 'Recommended for You', 'Latest Updates', 'Your Progress'].map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-medium transition-colors ${
              tab === 'All Content' 
                ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary">{category.count}</Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filter Badges */}
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
              <Video className="h-3 w-3" />
              Video
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
              <Users className="h-3 w-3" />
              AI Pick
            </Badge>
            <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Trending
            </Badge>
          </div>

          {/* Recommended Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommended for You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedContent.map((content, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(content.type)}
                        <Badge variant="outline">{content.type}</Badge>
                      </div>
                      <Badge className={getDifficultyColor(content.difficulty)}>
                        {content.difficulty}
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold mb-2">{content.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{content.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {content.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {content.rating} ({content.views} views)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {content.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Latest Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Latest Updates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestContent.map((content, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(content.type)}
                        <Badge variant="outline">{content.type}</Badge>
                      </div>
                      <Badge className={getDifficultyColor(content.difficulty)}>
                        {content.difficulty}
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold mb-2">{content.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{content.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {content.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {content.rating} ({content.views} views)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {content.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAcademy;
