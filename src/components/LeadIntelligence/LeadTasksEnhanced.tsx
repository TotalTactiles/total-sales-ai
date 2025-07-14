import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Brain,
  CheckCircle,
  Circle,
  AlertCircle,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import UsageTracker from '@/components/AIBrain/UsageTracker';
import { Lead } from '@/types/lead';

interface LeadTasksEnhancedProps {
  lead: Lead;
  aiDelegationMode: boolean;
  onUpdate?: (field: string, value: any) => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  aiGenerated: boolean;
  category: 'follow_up' | 'research' | 'preparation' | 'meeting';
}

const LeadTasksEnhanced: React.FC<LeadTasksEnhancedProps> = ({ lead, aiDelegationMode, onUpdate }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Send ROI calculator',
      description: 'Share personalized ROI calculator based on company size and industry',
      dueDate: 'Today',
      priority: 'high',
      completed: false,
      aiGenerated: true,
      category: 'follow_up'
    },
    {
      id: '2',
      title: 'Research company recent news',
      description: 'Check for any recent company announcements, funding, or industry changes',
      dueDate: 'Tomorrow',
      priority: 'medium',
      completed: false,
      aiGenerated: true,
      category: 'research'
    },
    {
      id: '3',
      title: 'Prepare demo for construction industry',
      description: 'Customize demo to highlight construction-specific use cases',
      dueDate: 'This week',
      priority: 'medium',
      completed: true,
      aiGenerated: false,
      category: 'preparation'
    },
    {
      id: '4',
      title: 'Follow up on pricing questions',
      description: 'Address specific questions about implementation timeline and costs',
      dueDate: 'Today',
      priority: 'high',
      completed: false,
      aiGenerated: false,
      category: 'follow_up'
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const
  });

  const { trackEvent, trackClick } = useUsageTracking();

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));

    const task = tasks.find(t => t.id === taskId);
    trackEvent({
      feature: 'task_completion',
      action: task?.completed ? 'uncomplete' : 'complete',
      context: 'lead_tasks',
      metadata: { 
        taskId, 
        leadId: lead.id, 
        aiGenerated: task?.aiGenerated,
        category: task?.category
      }
    });

    if (!task?.completed) {
      toast.success('Task completed! Great progress!');
    }

    if (onUpdate) {
      onUpdate('tasks', tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      ));
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
      dueDate: 'Custom',
      priority: newTask.priority,
      completed: false,
      aiGenerated: false,
      category: 'follow_up'
    };

    const updatedTasks = [task, ...tasks];
    setTasks(updatedTasks);
    setNewTask({ title: '', description: '', priority: 'medium' });
    setShowAddTask(false);

    trackEvent({
      feature: 'manual_task_creation',
      action: 'create',
      context: 'lead_tasks',
      metadata: { leadId: lead.id, taskPriority: newTask.priority }
    });

    toast.success('Task added successfully!');
    
    if (onUpdate) {
      onUpdate('tasks', updatedTasks);
    }
  };

  const generateAITasks = () => {
    trackClick('ai_task_generation', 'lead_tasks');
    
    const aiTasks: Task[] = [
      {
        id: Date.now().toString(),
        title: 'Send case study from similar construction company',
        description: 'Share success story from ABC Construction showing 40% efficiency gains',
        dueDate: 'Tomorrow',
        priority: 'high',
        completed: false,
        aiGenerated: true,
        category: 'follow_up'
      },
      {
        id: (Date.now() + 1).toString(),
        title: 'Schedule follow-up call for next week',
        description: 'Book 30-minute call to discuss implementation timeline and next steps',
        dueDate: 'This week',
        priority: 'medium',
        completed: false,
        aiGenerated: true,
        category: 'meeting'
      }
    ];

    const updatedTasks = [...aiTasks, ...tasks];
    setTasks(updatedTasks);
    toast.success('AI generated 2 new tasks based on lead behavior!');
    
    if (onUpdate) {
      onUpdate('tasks', updatedTasks);
    }
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

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => !t.completed);
  const finishedTasks = tasks.filter(t => t.completed);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Lead Tasks</h3>
          <p className="text-sm text-slate-600">
            {completedTasks} of {totalTasks} tasks completed
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
            onClick={() => setShowAddTask(!showAddTask)}
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
            <span className="text-sm text-slate-600">{Math.round((completedTasks / totalTasks) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Task Form */}
      {showAddTask && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Task title..."
            />
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Task description (optional)..."
              rows={3}
            />
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Priority:</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTask}>Add Task</Button>
              <Button variant="outline" onClick={() => setShowAddTask(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Tasks Section */}
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium mb-3">Tasks To Be Completed ({activeTasks.length})</h4>
          <div className="space-y-3">
            {activeTasks.map((task) => {
              const CategoryIcon = getCategoryIcon(task.category);
              
              return (
                <UsageTracker
                  key={task.id}
                  feature="task_interaction"
                  context={`${task.category}_${task.aiGenerated ? 'ai' : 'manual'}`}
                >
                  <Card className="transition-all duration-200 hover:shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleTaskComplete(task.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{task.title}</h4>
                              {task.aiGenerated && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            
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
                            <p className="text-sm text-slate-600 mb-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              Due: {task.dueDate}
                            </div>
                            
                            {task.priority === 'high' && (
                              <Badge variant="outline" className="text-xs text-red-600 bg-red-50">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                High Priority
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </UsageTracker>
              );
            })}
          </div>
        </div>

        {/* Completed Tasks Section */}
        {finishedTasks.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-3">✅ Completed Tasks ({finishedTasks.length})</h4>
            <div className="space-y-3">
              {finishedTasks.map((task) => {
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
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium line-through text-slate-500">{task.title}</h4>
                              {task.aiGenerated && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs text-green-600 bg-green-50">
                                Completed
                              </Badge>
                              <CategoryIcon className="h-4 w-4 text-slate-400" />
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-slate-500 line-through mb-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Circle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-medium text-slate-600 mb-2">No tasks yet</h3>
              <p className="text-sm text-slate-500 mb-4">
                Add your first task or let AI suggest some based on this lead's behavior.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={generateAITasks}>
                  <Brain className="h-4 w-4 mr-1" />
                  AI Suggest
                </Button>
                <Button onClick={() => setShowAddTask(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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
