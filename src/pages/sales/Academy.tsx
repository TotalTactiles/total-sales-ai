
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Play, Trophy, Clock, Star, CheckCircle, BookOpen, Video } from 'lucide-react';

const Academy: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState(0);

  const lessons = [
    {
      id: 1,
      title: 'Handling Price Objections',
      category: 'Objection Handling',
      duration: '12 min',
      difficulty: 'Beginner',
      completed: true,
      score: 85,
      type: 'video'
    },
    {
      id: 2,
      title: 'Discovery Questions for SaaS',
      category: 'Discovery',
      duration: '15 min',
      difficulty: 'Intermediate',
      completed: false,
      score: null,
      type: 'interactive'
    },
    {
      id: 3,
      title: 'Closing Techniques',
      category: 'Closing',
      duration: '18 min',
      difficulty: 'Advanced',
      completed: false,
      score: null,
      type: 'video'
    }
  ];

  const battlecards = [
    {
      id: 1,
      title: 'CFO Persona',
      description: 'Key talking points for financial decision makers',
      lastUpdated: '2 days ago',
      useCount: 23
    },
    {
      id: 2,
      title: 'Competitor: Salesforce',
      description: 'How to position against Salesforce',
      lastUpdated: '1 week ago',
      useCount: 18
    },
    {
      id: 3,
      title: 'ROI Calculator Script',
      description: 'Step-by-step ROI presentation',
      lastUpdated: '3 days ago',
      useCount: 31
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'interactive': return BookOpen;
      default: return Play;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pl-72">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Academy</h1>
          <p className="text-gray-600">Adaptive lessons, battlecards, and skill building</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    <span>Level 3 Closer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    <span>850 XP</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-purple-100 mb-1">Next Level</p>
                <Progress value={65} className="w-32 bg-white/20" />
                <p className="text-sm text-purple-100 mt-1">150 XP to go</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="battlecards">Battlecards</TabsTrigger>
            <TabsTrigger value="quiz">Practice Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {lessons.map((lesson) => {
                const TypeIcon = getTypeIcon(lesson.type);
                return (
                  <Card key={lesson.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                          <p className="text-gray-600 text-sm">{lesson.category}</p>
                        </div>
                        {lesson.completed && (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={`${getDifficultyColor(lesson.difficulty)} text-white border-0`}>
                          {lesson.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {lesson.duration}
                        </div>
                      </div>

                      {lesson.completed && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-green-800 font-medium">Completed</span>
                            <span className="text-green-600">Score: {lesson.score}%</span>
                          </div>
                        </div>
                      )}

                      <Button 
                        className="w-full"
                        variant={lesson.completed ? "outline" : "default"}
                      >
                        <TypeIcon className="h-4 w-4 mr-2" />
                        {lesson.completed ? 'Review' : 'Start Lesson'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="battlecards">
            <div className="space-y-4">
              {battlecards.map((card) => (
                <Card key={card.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{card.title}</h3>
                        <p className="text-gray-600">{card.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Updated {card.lastUpdated}</span>
                          <span>Used {card.useCount} times</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                        <Button size="sm">
                          Use Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6" />
                  Practice Quiz Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Ready to Test Your Skills?</h3>
                    <p className="text-gray-600 mb-6">Take a quick quiz to reinforce your learning and earn XP</p>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button size="lg" variant="outline">
                      Quick Quiz (5 min)
                    </Button>
                    <Button size="lg">
                      Full Assessment (15 min)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Academy;
