
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Play, Book, Award, TrendingUp, Clock } from 'lucide-react';

const Academy: React.FC = () => {
  const courses = [
    {
      id: 1,
      title: 'Advanced Objection Handling',
      description: 'Master the art of turning objections into opportunities',
      progress: 75,
      duration: '2.5 hours',
      level: 'Advanced'
    },
    {
      id: 2,
      title: 'AI-Powered Lead Qualification',
      description: 'Learn to leverage AI for better lead scoring',
      progress: 40,
      duration: '1.5 hours',
      level: 'Intermediate'
    },
    {
      id: 3,
      title: 'Closing Techniques Masterclass',
      description: 'Proven strategies to close more deals',
      progress: 0,
      duration: '3 hours',
      level: 'Expert'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Academy</h1>
          <p className="text-gray-600">Continuous learning and skill development</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          <GraduationCap className="h-3 w-3 mr-1" />
          Learning Mode
        </Badge>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hours Learned</p>
                <p className="text-2xl font-bold">28.5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skill Level</p>
                <p className="text-2xl font-bold">Expert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle>My Learning Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <Badge variant="outline">{course.level}</Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Progress value={course.progress} className="flex-1" />
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                  </div>
                  
                  <Button className="ml-4">
                    <Play className="h-4 w-4 mr-2" />
                    {course.progress > 0 ? 'Continue' : 'Start'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Emotional Intelligence in Sales</h4>
              <p className="text-sm text-gray-600 mb-3">Build deeper connections with prospects</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Beginner</Badge>
                <Button size="sm" variant="outline">Enroll</Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Digital Sales Strategies</h4>
              <p className="text-sm text-gray-600 mb-3">Modern approaches to online selling</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Intermediate</Badge>
                <Button size="sm" variant="outline">Enroll</Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Negotiation Mastery</h4>
              <p className="text-sm text-gray-600 mb-3">Advanced negotiation techniques</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Advanced</Badge>
                <Button size="sm" variant="outline">Enroll</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Academy;
