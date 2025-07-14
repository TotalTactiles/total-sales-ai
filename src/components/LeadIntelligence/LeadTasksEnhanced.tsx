
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Brain,
  CheckCircle,
  Circle,
  AlertCircle,
  Target,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';

interface LeadTasksEnhancedProps {
  lead: Lead;
  aiDelegationMode: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  dueTime?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  aiGenerated: boolean;
  category: 'follow_up' | 'research' | 'preparation' | 'meeting';
  createdAt: string;
  completedAt?: string;
}

const LeadTasksEnhanced: React.FC<LeadTasksEnhancedProps> = ({ lead, aiDelegationMode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Send ROI calculator',
      description: 'Share personalized ROI calculator based on company size and industry',
      dueDate: '2024-01-16',
      dueTime: '14:00',
      priority: 'high',
      completed: false,
      aiGenerated: true,
      category: 'follow_up',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Follow up on pricing questions',
      description: 'Address specific questions about implementation timeline and costs',
      dueDate: '2024-01-15',
      priority: 'high',
      completed: false,
      aiGenerated: false,
      category: 'follow_up',
      createdAt: '2024-01-14T16:30:00Z'
    },
    {
      id: '3',
      title: 'Prepare demo for construction industry',
      description: 'Customize demo to highlight construction-specific use cases',
      dueDate: '2024-01-18',
      priority: 'medium',
      completed: true,
      aiGenerated: false,
      category: 'preparation',
      createdAt: '2024-01-12T09:00:00Z',
      completedAt: '2024-01-13T15:30:00Z'
    }
  ]);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium' as const
  });

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    ));

    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast.success('Task completed! Great progress!');
    } else {
      toast.success('Task marked as incomplete');
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate || undefined,
      dueTime: newTask.dueTime || undefined,
      priority: newTask.priority,
      completed: false,
      aiGenerated: false,
      category: 'follow_up',
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', description: '', dueDate: '', dueTime: '', priority: 'medium' });
    setShowAddTaskModal(false);
    toast.success('Task added successfully!');
  };

  const generateAITasks = () => {
    const aiTasks: Task[] = [
      {
        id: Date.now().toString(),
        title: 'Send case study from similar construction company',
        description: 'Share success story from ABC Construction showing 40% efficiency gains',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high',
        completed: false,
        aiGenerated: true,
        category: 'follow_up',
        createdAt: new Date().toISOString()
      }
    ];

    setTasks(prev => [...aiTasks, ...prev]);
    toast.success('AI generated new tasks based on lead behavior!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'follow_up': return Clock;
      case 'research': return Target;
      case 'preparation': return CheckCircle;
      case 'meeting': return Calendar;
      default: return Circle;
    }
  };

  const isTaskDueSoon = (task: Task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 48 && diffHours >= 0;
  };

  const formatDueDate = (task: Task) => {
    if (!task.dueDate) return '';
    const date = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return task.dueTime ? `Today at ${task.dueTime}` : 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return task.dueTime ? `Tomorrow at ${task.dueTime}` : 'Tomorrow';
    } else {
      return task.dueTime ? `${date.toLocaleDateString()} at ${task.dueTime}` : date.toLocaleDateString();
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Lead Tasks</h3>
          <p className="text-sm text-slate-600">
            {completedTasks.length} of {tasks.length} tasks completed
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateAITasks}
            disabled={aiDelegationMode}
          >
            <Brain className="h-4 w-4 mr-1" />
            AI Suggest
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddTaskModal(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-slate-600">
              {Math.round((completedTasks.length / Math.max(tasks.length, 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedTasks.length / Math.max(tasks.length, 1)) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Tasks */}
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Tasks To Be Completed</h4>
          <div className="space-y-3">
            {activeTasks.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 mb-1">All tasks completed!</p>
                  <p className="text-xs text-gray-500">Great job staying on top of your lead management.</p>
                </CardContent>
              </Card>
            ) : (
              activeTasks.map((task) => {
                const CategoryIcon = getCategoryIcon(task.category);
                const isDueSoon = isTaskDueSoon(task);
                
                return (
                  <Card key={task.id} className={`transition-all duration-200 hover:shadow-sm ${
                    isDueSoon ? 'border-orange-200 bg-orange-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleTaskComplete(task.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority}
                              </Badge>
                              <CategoryIcon className="h-4 w-4 text-slate-400" />
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {task.aiGenerated && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                              {task.dueDate && (
                                <div className={`flex items-center gap-1 text-xs ${
                                  isDueSoon ? 'text-orange-600 font-medium' : 'text-slate-500'
                                }`}>
                                  <Clock className="h-3 w-3" />
                                  Due: {formatDueDate(task)}
                                </div>
                              )}
                            </div>
                            
                            {isDueSoon && (
                              <Badge variant="outline" className="text-xs text-orange-600 bg-orange-50">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Due Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">✅ Completed Tasks</h4>
            <div className="space-y-3">
              {completedTasks.map((task) => {
                const CategoryIcon = getCategoryIcon(task.category);
                
                return (
                  <Card key={task.id} className="bg-slate-50 opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleTaskComplete(task.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium line-through text-slate-600">{task.title}</h4>
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="h-4 w-4 text-slate-400" />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTaskComplete(task.id)}
                                className="h-6 w-6 p-0"
                                title="Mark as incomplete"
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-slate-500 line-through mb-2">{task.description}</p>
                          )}
                          
                          <div className="flex items-center gap-2">
                            {task.aiGenerated && (
                              <Badge variant="outline" className="text-xs bg-slate-100 text-slate-600">
                                <Brain className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                            {task.completedAt && (
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <CheckCircle className="h-3 w-3" />
                                Completed {new Date(task.completedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Task Title *</label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Task description (optional)..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Due Date</label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Due Time</label>
                <Input
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddTaskModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddTask} className="flex-1">
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Delegation Notice */}
      {aiDelegationMode && (
        <Card className="border-blue-200 bg-blue-50 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Brain className="h-4 w-4" />
              <span className="font-medium">AI is Managing Tasks</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              The AI assistant is automatically creating and managing tasks for this lead.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadTasksEnhanced;
