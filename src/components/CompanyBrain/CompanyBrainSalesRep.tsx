
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Play,
  Award
} from 'lucide-react';

const CompanyBrainSalesRep: React.FC = () => {
  const learningProgress = {
    currentStreak: 7,
    totalLessons: 24,
    completedLessons: 18,
    skillLevel: 'Advanced',
    nextMilestone: 'Expert'
  };

  const suggestedContent = [
    {
      id: 1,
      title: 'Handling Price Objections Like Alex Hormozi',
      type: 'Video',
      duration: '12 min',
      author: 'Alex Hormozi',
      relevance: 'High',
      skills: ['Objection Handling', 'Pricing Strategy']
    },
    {
      id: 2,
      title: 'Advanced Cold Calling Techniques',
      type: 'Article',
      duration: '8 min read',
      author: 'Sales Expert',
      relevance: 'Medium',
      skills: ['Cold Calling', 'Lead Generation']
    },
    {
      id: 3,
      title: 'Closing Deals in Competitive Markets',
      type: 'Podcast',
      duration: '45 min',
      author: 'Industry Leader',
      relevance: 'High',
      skills: ['Deal Closing', 'Competition']
    }
  ];

  const companyGoals = [
    {
      name: 'Q4 Revenue Target',
      progress: 73,
      myContribution: 12,
      status: 'on-track'
    },
    {
      name: 'Team Conversion Rate',
      progress: 68,
      myContribution: 8,
      status: 'behind'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Company Brain</h1>
        </div>
        <p className="text-gray-600">
          Your personalized learning hub and performance insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Learning Progress */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-3">
                    <span className="text-2xl font-bold text-purple-700">{learningProgress.currentStreak}</span>
                  </div>
                  <h3 className="font-medium">Day Streak</h3>
                  <p className="text-sm text-gray-500">Keep learning to maintain your streak!</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {learningProgress.nextMilestone}</span>
                    <span>{learningProgress.completedLessons}/{learningProgress.totalLessons}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(learningProgress.completedLessons / learningProgress.totalLessons) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Badge className="bg-purple-100 text-purple-800">
                    {learningProgress.skillLevel} Level
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Company Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">{goal.name}</h4>
                      <Badge className={
                        goal.status === 'on-track' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }>
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            goal.status === 'on-track' ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        My contribution: {goal.myContribution}% • Overall: {goal.progress}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Suggested Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestedContent.map((content) => (
                  <div key={content.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-gray-600">
                          {content.type} • {content.duration} • by {content.author}
                        </p>
                      </div>
                      <Badge className={
                        content.relevance === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {content.relevance} Relevance
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {content.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  AI Learning Assistant
                </h3>
                <p className="text-sm text-purple-700 mb-4">
                  I've analyzed your performance and found 3 Alex Hormozi videos that match your communication style. 
                  These will help improve your objection handling skills.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Show Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyBrainSalesRep;
