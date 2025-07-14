
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, TrendingUp, BookOpen, CheckCircle, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface CoachingTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: string;
  daysInCoaching: number;
  isCompleted: boolean;
}

const AICoachingPanel = () => {
  const [tasks, setTasks] = useState<CoachingTask[]>([
    {
      id: '1',
      title: 'Objection Handling: Price Concerns',
      description: 'Learn 5 proven techniques to overcome price objections and demonstrate value',
      difficulty: 'intermediate',
      estimatedTime: '15 min',
      category: 'Objection Handling',
      daysInCoaching: 2,
      isCompleted: false
    },
    {
      id: '2',
      title: 'Discovery Questions Framework',
      description: 'Master the BANT qualification framework for better lead qualification',
      difficulty: 'beginner',
      estimatedTime: '20 min',
      category: 'Discovery',
      daysInCoaching: 5,
      isCompleted: false
    },
    {
      id: '3',
      title: 'Advanced Closing Techniques',
      description: 'Practice assumption close, alternative close, and urgency-based closing',
      difficulty: 'advanced',
      estimatedTime: '25 min',
      category: 'Closing',
      daysInCoaching: 1,
      isCompleted: false
    }
  ]);

  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState<string | null>(null);

  const handleTaskAction = (taskId: string, action: 'act_now' | 'calendar' | 'remind_later' | 'dismiss') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    switch (action) {
      case 'act_now':
        // Navigate to Academy tab with this specific module
        toast.success(`Opening "${task.title}" in Academy`);
        break;
      case 'calendar':
        toast.success('Added to calendar for later study');
        break;
      case 'remind_later':
        toast.success('Reminder set for tomorrow');
        break;
      case 'dismiss':
        setTasks(prev => prev.filter(t => t.id !== taskId));
        toast.success('Coaching task dismissed');
        break;
    }
    setShowActionModal(null);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: true }
        : task
    ));
    toast.success('Coaching completed! Great job!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeTasks = tasks.filter(t => !t.isCompleted);

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5 text-blue-600" />
            AI Sales Coaching
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {activeTasks.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeTasks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p className="text-sm">All coaching completed!</p>
            <p className="text-xs text-gray-400">New recommendations coming soon</p>
          </div>
        ) : (
          activeTasks.map((task) => (
            <div
              key={task.id}
              className="relative bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredTask(task.id)}
              onMouseLeave={() => setHoveredTask(null)}
              onClick={() => setShowActionModal(task.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                      {task.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      {task.estimatedTime}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                      {task.category}
                    </Badge>
                    {task.daysInCoaching > 1 && (
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                        Day {task.daysInCoaching} in Coaching
                      </Badge>
                    )}
                  </div>
                </div>

                {hoveredTask === task.id && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredTask(null);
                      }}
                      title="Preview"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskAction(task.id, 'dismiss');
                      }}
                      title="Dismiss"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Modal */}
              {showActionModal === task.id && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowActionModal(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleTaskAction(task.id, 'act_now')}
                      className="text-xs"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Act Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTaskAction(task.id, 'calendar')}
                      className="text-xs"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Calendar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTaskAction(task.id, 'remind_later')}
                      className="text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Remind Later
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTaskAction(task.id, 'dismiss')}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {activeTasks.length > 0 && (
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-blue-600 hover:text-blue-700"
              onClick={() => toast.info('Opening Academy with all recommendations')}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              View All in Academy
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICoachingPanel;
