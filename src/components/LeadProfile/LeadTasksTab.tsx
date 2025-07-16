
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Clock, CheckCircle, Calendar } from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface LeadTasksTabProps {
  lead: Lead;
  aiDelegationMode: boolean;
  onUpdate: (field: string, value: any) => void;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueTime?: string;
  completed: boolean;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

const LeadTasksTab: React.FC<LeadTasksTabProps> = ({ lead, aiDelegationMode, onUpdate }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

  const [mockTasks, setMockTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Follow up on pricing discussion',
      description: 'Send detailed pricing breakdown and ROI calculator',
      dueTime: '2024-01-15T14:00',
      completed: false,
      createdAt: '2024-01-10',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Schedule product demo',
      description: 'Set up 30-minute demo for next week',
      completed: false,
      createdAt: '2024-01-10',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Initial contact made',
      description: 'Successful discovery call completed',
      completed: true,
      createdAt: '2024-01-05',
      priority: 'low'
    }
  ]);

  const activeTasks = mockTasks.filter(task => !task.completed);
  const completedTasks = mockTasks.filter(task => task.completed);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDescription,
        dueTime: newTaskTime,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0],
        priority: 'medium'
      };
      
      setMockTasks([...mockTasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskTime('');
      setShowAddTask(false);
      toast.success('Task added successfully');
    }
  };

  const handleToggleTask = (taskId: string) => {
    setMockTasks(mockTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const isTaskDueSoon = (dueTime?: string) => {
    if (!dueTime) return false;
    const due = new Date(dueTime);
    const now = new Date();
    const hoursDiff = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 48 && hoursDiff > 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Add Task Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button onClick={() => setShowAddTask(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Task Title</label>
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
              <Textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Enter task description..."
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Due Time (Optional)</label>
              <Input
                type="datetime-local"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                Add Task
              </Button>
              <Button variant="outline" onClick={() => setShowAddTask(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks To Be Completed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            Tasks To Be Completed ({activeTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <div key={task.id} className="p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {isTaskDueSoon(task.dueTime) && (
                          <Badge variant="destructive" className="text-xs">
                            Due Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Created: {task.createdAt}</span>
                      {task.dueTime && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(task.dueTime).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {activeTasks.length === 0 && (
              <p className="text-center text-slate-500 py-8">No active tasks</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Completed Tasks ({completedTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task.id} className="p-3 border rounded-lg bg-slate-50">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-through text-slate-600">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-slate-500 line-through">{task.description}</p>
                    )}
                    <span className="text-xs text-slate-400">Completed: {task.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {completedTasks.length === 0 && (
              <p className="text-center text-slate-500 py-4">No completed tasks</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadTasksTab;
