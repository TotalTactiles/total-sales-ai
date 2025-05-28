
import React, { useState } from 'react';
import { GraduationCap, BookOpen, Video, Trophy, Star, Clock, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const SalesAcademy = () => {
  const { leads } = useLeads();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore the Sales Academy with comprehensive training content.');
  };

  // Mock academy data
  const mockAcademy = {
    stats: {
      coursesCompleted: 12,
      totalCourses: 25,
      certificationsEarned: 3,
      hoursLearned: 47,
      streakDays: 12,
      currentLevel: 'Advanced'
    },
    featuredCourses: [
      {
        id: '1',
        title: 'AI-Powered Sales Techniques',
        description: 'Master the art of using AI tools to enhance your sales process',
        duration: '2.5 hours',
        difficulty: 'Intermediate',
        rating: 4.8,
        students: 2847,
        progress: 75,
        instructor: 'Sarah Johnson',
        category: 'Sales Strategy'
      },
      {
        id: '2',
        title: 'Advanced Objection Handling',
        description: 'Turn objections into opportunities with proven techniques',
        duration: '1.8 hours',
        difficulty: 'Advanced',
        rating: 4.9,
        students: 1923,
        progress: 100,
        instructor: 'Michael Chen',
        category: 'Communication'
      },
      {
        id: '3',
        title: 'Digital Prospecting Mastery',
        description: 'Modern prospecting strategies for the digital age',
        duration: '3.2 hours',
        difficulty: 'Beginner',
        rating: 4.7,
        students: 3456,
        progress: 0,
        instructor: 'Emma Rodriguez',
        category: 'Prospecting'
      }
    ],
    certifications: [
      {
        id: '1',
        name: 'Sales Professional Certification',
        description: 'Comprehensive sales skills certification',
        status: 'earned',
        earnedDate: '2024-01-15',
        expiryDate: '2025-01-15'
      },
      {
        id: '2',
        name: 'Digital Sales Expert',
        description: 'Advanced digital selling techniques',
        status: 'in-progress',
        progress: 67
      },
      {
        id: '3',
        name: 'AI Sales Specialist',
        description: 'AI tools and automation in sales',
        status: 'available',
        requirements: ['Complete 3 AI courses', 'Pass final exam']
      }
    ],
    recentActivity: [
      {
        type: 'course_completed',
        title: 'Completed: Email Automation Strategies',
        timestamp: '2 hours ago',
        points: 150
      },
      {
        type: 'quiz_passed',
        title: 'Passed: CRM Best Practices Quiz',
        timestamp: '1 day ago',
        points: 75
      },
      {
        type: 'badge_earned',
        title: 'Earned: Consistent Learner Badge',
        timestamp: '3 days ago',
        points: 200
      }
    ],
    skillTracks: [
      {
        name: 'Prospecting & Lead Generation',
        courses: 8,
        completed: 5,
        progress: 62
      },
      {
        name: 'Sales Communication',
        courses: 6,
        completed: 4,
        progress: 67
      },
      {
        name: 'Deal Closing Techniques',
        courses: 7,
        completed: 2,
        progress: 29
      },
      {
        name: 'Technology & AI in Sales',
        courses: 5,
        completed: 1,
        progress: 20
      }
    ]
  };

  const handleStartCourse = (courseId: string) => {
    toast.success('Course started! This would normally open the learning interface.');
  };

  const handleViewCertification = (certId: string) => {
    toast.info('Certification details would open here in the full version.');
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Sales Academy" 
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
        <DemoModeIndicator workspace="Sales Academy & Training Platform" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Academy</h1>
          <p className="text-muted-foreground mt-2">
            Continuous learning and skill development for sales excellence
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Trophy className="h-3 w-3 mr-1" />
            Level: {mockAcademy.stats.currentLevel}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Star className="h-3 w-3 mr-1" />
            {mockAcademy.stats.streakDays} day streak
          </Badge>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAcademy.stats.coursesCompleted}/{mockAcademy.stats.totalCourses}
            </div>
            <Progress 
              value={(mockAcademy.stats.coursesCompleted / mockAcademy.stats.totalCourses) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAcademy.stats.certificationsEarned}</div>
            <p className="text-xs text-muted-foreground">
              Professional credentials earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAcademy.stats.hoursLearned}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAcademy.stats.streakDays}</div>
            <p className="text-xs text-muted-foreground">
              Consecutive days
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="skill-tracks">Skill Tracks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockAcademy.featuredCourses.map((course) => (
              <Card key={course.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{course.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{course.instructor}</p>
                      <Badge 
                        variant={course.difficulty === 'Beginner' ? 'secondary' : 
                                course.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {course.difficulty}
                      </Badge>
                    </div>
                    <Button 
                      size="sm"
                      variant={course.progress > 0 ? "outline" : "default"}
                      onClick={() => handleStartCourse(course.id)}
                    >
                      {course.progress === 100 ? 'Review' : 
                       course.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAcademy.certifications.map((cert) => (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                    {cert.status === 'earned' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <CardDescription>{cert.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cert.status === 'earned' && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        Earned on {new Date(cert.earnedDate!).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-green-600">
                        Expires: {new Date(cert.expiryDate!).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {cert.status === 'in-progress' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{cert.progress}%</span>
                      </div>
                      <Progress value={cert.progress} />
                    </div>
                  )}

                  {cert.status === 'available' && cert.requirements && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Requirements:</p>
                      <ul className="text-xs space-y-1">
                        {cert.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleViewCertification(cert.id)}
                  >
                    {cert.status === 'earned' ? 'View Certificate' :
                     cert.status === 'in-progress' ? 'Continue' : 'Start'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skill-tracks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockAcademy.skillTracks.map((track, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {track.name}
                    <Badge variant="outline">
                      {track.completed}/{track.courses} courses
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{track.progress}%</span>
                    </div>
                    <Progress value={track.progress} />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Track
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Learning Activity</CardTitle>
              <CardDescription>Your latest achievements and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAcademy.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {activity.type === 'course_completed' && <BookOpen className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'quiz_passed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {activity.type === 'badge_earned' && <Trophy className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant="outline">+{activity.points} pts</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesAcademy;
