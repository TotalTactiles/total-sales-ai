
import React from 'react';
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
  TrendingUp
} from 'lucide-react';

const SalesAcademy = () => {
  const modules = [
    {
      id: 1,
      title: 'Sales Fundamentals',
      description: 'Master the basics of effective selling',
      progress: 85,
      duration: '2h 30m',
      lessons: 12,
      type: 'video',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: 'Advanced Objection Handling',
      description: 'Turn objections into opportunities',
      progress: 60,
      duration: '1h 45m',
      lessons: 8,
      type: 'interactive',
      difficulty: 'Advanced'
    },
    {
      id: 3,
      title: 'Pipeline Management',
      description: 'Optimize your sales pipeline',
      progress: 100,
      duration: '3h 15m',
      lessons: 15,
      type: 'mixed',
      difficulty: 'Intermediate'
    },
    {
      id: 4,
      title: 'Closing Techniques',
      description: 'Master the art of closing deals',
      progress: 25,
      duration: '2h 00m',
      lessons: 10,
      type: 'video',
      difficulty: 'Advanced'
    }
  ];

  const achievements = [
    { title: 'First Sale', description: 'Closed your first deal', earned: true },
    { title: 'Quick Learner', description: 'Completed 5 modules', earned: true },
    { title: 'Pipeline Pro', description: 'Maintained 90%+ pipeline health', earned: false },
    { title: 'Top Performer', description: 'Exceeded quota 3 months in a row', earned: false }
  ];

  const recentActivity = [
    { action: 'Completed', item: 'Objection Handling - Lesson 3', time: '2 hours ago' },
    { action: 'Started', item: 'Closing Techniques Module', time: '1 day ago' },
    { action: 'Earned', item: 'Quick Learner Achievement', time: '3 days ago' },
    { action: 'Completed', item: 'Sales Fundamentals Final Quiz', time: '1 week ago' }
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Academy</h1>
          <p className="text-muted-foreground">Enhance your skills and accelerate your career</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-500 text-white">
            75% Complete
          </Badge>
          <Button>Continue Learning</Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modules Completed</p>
                <p className="text-2xl font-bold">3/4</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Hours</p>
                <p className="text-2xl font-bold">12.5</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">2/4</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Skill Level</p>
                <p className="text-2xl font-bold">Pro</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Learning Modules
          </CardTitle>
          <CardDescription>Build your sales expertise with our comprehensive training</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    <Badge variant={module.progress === 100 ? "default" : "secondary"}>
                      {module.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {module.lessons} lessons
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      {module.type === 'video' && <Video className="h-4 w-4" />}
                      {module.type === 'interactive' && <Users className="h-4 w-4" />}
                      {module.type === 'mixed' && <FileText className="h-4 w-4" />}
                      {module.type}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={module.progress === 100 ? "outline" : "default"}
                  >
                    {module.progress === 100 ? (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Review Module
                      </>
                    ) : module.progress > 0 ? (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Module
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 border rounded-lg ${
                    achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Award className={`h-6 w-6 ${
                    achievement.earned ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-yellow-500 text-white">Earned</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span> {activity.item}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAcademy;
