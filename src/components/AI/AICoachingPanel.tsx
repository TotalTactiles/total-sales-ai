
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  GraduationCap, 
  Target, 
  TrendingUp, 
  Clock, 
  Calendar, 
  CheckCircle, 
  X,
  Zap,
  Eye
} from 'lucide-react';

interface CoachingTask {
  id: string;
  title: string;
  description: string;
  category: 'objection_handling' | 'closing_techniques' | 'discovery' | 'presentation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  daysInCoaching: number;
  progress?: number;
}

const AICoachingPanel: React.FC = () => {
  const [coachingTasks, setCoachingTasks] = useState<CoachingTask[]>([
    {
      id: '1',
      title: 'Handling Price Objections',
      description: 'Learn advanced techniques to overcome price-related objections and demonstrate value.',
      category: 'objection_handling',
      difficulty: 'intermediate',
      estimatedTime: '15 min',
      daysInCoaching: 2,
      progress: 0
    },
    {
      id: '2',
      title: 'Discovery Questions Mastery',
      description: 'Master the art of asking the right questions to uncover pain points.',
      category: 'discovery',
      difficulty: 'beginner',
      estimatedTime: '10 min',
      daysInCoaching: 0,
      progress: 0
    },
    {
      id: '3',
      title: 'Assumptive Close Technique',
      description: 'Learn when and how to use assumptive closing to accelerate deals.',
      category: 'closing_techniques',
      difficulty: 'advanced',
      estimatedTime: '20 min',
      daysInCoaching: 5,
      progress: 60
    }
  ]);

  const [selectedTask, setSelectedTask] = useState<CoachingTask | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [reminderData, setReminderData] = useState({
    date: '',
    time: '',
    notes: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleTaskClick = (task: CoachingTask) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleActNow = () => {
    if (!selectedTask) return;
    
    // Opens module in Academy tab
    console.log('Opening Academy module:', selectedTask);
    
    // Log to TSAM for tracking
    console.log('TSAM tracking: Coaching task started', selectedTask);
    
    setIsTaskModalOpen(false);
    // Navigate to Academy tab with specific module
  };

  const handleAddToCalendar = () => {
    if (!selectedTask) return;
    
    console.log('Adding to calendar:', selectedTask);
    setIsTaskModalOpen(false);
  };

  const handleRemindLater = () => {
    if (!selectedTask) return;
    
    console.log('Remind later:', selectedTask, reminderData);
    setIsTaskModalOpen(false);
  };

  const handleDismiss = () => {
    if (!selectedTask) return;
    
    console.log('Dismissing task:', selectedTask);
    setCoachingTasks(prev => prev.filter(task => task.id !== selectedTask.id));
    setIsTaskModalOpen(false);
  };

  const handleMarkComplete = () => {
    if (!selectedTask) return;
    
    // Mark as complete - remove from both Dashboard + Academy > Recommended
    console.log('Marking complete:', selectedTask);
    setCoachingTasks(prev => prev.filter(task => task.id !== selectedTask.id));
    setIsTaskModalOpen(false);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'objection_handling': return 'bg-red-100 text-red-800';
      case 'closing_techniques': return 'bg-green-100 text-green-800';
      case 'discovery': return 'bg-blue-100 text-blue-800';
      case 'presentation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <>
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              AI Sales Coaching
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {coachingTasks.length} Tasks
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {coachingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>All coaching tasks completed!</p>
              <p className="text-sm">You're on top of your game.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {coachingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer relative"
                  onClick={() => handleTaskClick(task)}
                  onMouseEnter={() => setShowPreview(true)}
                  onMouseLeave={() => setShowPreview(false)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold pr-2">{task.title}</h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge className={getCategoryColor(task.category)} variant="outline" size="sm">
                        {task.category.replace('_', ' ')}
                      </Badge>
                      {task.daysInCoaching > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {task.daysInCoaching}d coaching
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getDifficultyColor(task.difficulty)} variant="outline" size="sm">
                        {task.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.estimatedTime}
                      </span>
                    </div>
                    
                    {task.progress !== undefined && task.progress > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{task.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Action Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {selectedTask?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm mb-3">{selectedTask.description}</p>
                <div className="flex items-center gap-3">
                  <Badge className={getCategoryColor(selectedTask.category)} variant="outline">
                    {selectedTask.category.replace('_', ' ')}
                  </Badge>
                  <Badge className={getDifficultyColor(selectedTask.difficulty)} variant="outline">
                    {selectedTask.difficulty}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedTask.estimatedTime}
                  </span>
                </div>
                {selectedTask.daysInCoaching > 0 && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedTask.daysInCoaching} days in coaching
                    </Badge>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleActNow} className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline" onClick={handlePreview} className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleAddToCalendar} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button variant="outline" onClick={() => setIsTaskModalOpen(false)} className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Remind Later
                </Button>
              </div>

              {selectedTask.progress !== undefined && selectedTask.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">{selectedTask.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full transition-all"
                      style={{ width: `${selectedTask.progress}%` }}
                    />
                  </div>
                  {selectedTask.progress >= 80 && (
                    <Button variant="outline" onClick={handleMarkComplete} className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button variant="destructive" onClick={handleDismiss}>
                  <X className="h-4 w-4 mr-2" />
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AICoachingPanel;
