
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bell, 
  CheckSquare, 
  Calendar,
  Brain,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  X,
  Play,
  Pause
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'task' | 'insight' | 'workflow';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  source: 'ai' | 'manual' | 'automation';
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'meeting' | 'call' | 'task' | 'reminder';
}

const TopRightPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'High-value lead needs attention',
      message: 'Enterprise lead from TechCorp has been unresponsive for 3 days',
      timestamp: new Date(),
      priority: 'high',
      read: false
    },
    {
      id: '2',
      type: 'insight',
      title: 'Performance improvement detected',
      message: 'Team conversion rate increased by 15% this week',
      timestamp: new Date(Date.now() - 300000),
      priority: 'medium',
      read: false
    },
    {
      id: '3',
      type: 'workflow',
      title: 'Automation workflow triggered',
      message: 'Welcome sequence started for 3 new leads',
      timestamp: new Date(Date.now() - 600000),
      priority: 'low',
      read: true
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review Q1 Performance Reports',
      description: 'Analyze team performance metrics and prepare coaching feedback',
      dueDate: new Date(Date.now() + 86400000),
      priority: 'high',
      completed: false,
      source: 'ai'
    },
    {
      id: '2',
      title: 'Follow up with stalled leads',
      description: 'Contact 5 leads that have been inactive for over a week',
      dueDate: new Date(),
      priority: 'medium',
      completed: false,
      source: 'ai'
    },
    {
      id: '3',
      title: 'Update team sales scripts',
      description: 'Review and update objection handling scripts based on recent feedback',
      dueDate: new Date(Date.now() + 172800000),
      priority: 'medium',
      completed: true,
      source: 'manual'
    }
  ]);

  const [calendarEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Stand-up',
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 5400000),
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Client Demo - TechCorp',
      startTime: new Date(Date.now() + 7200000),
      endTime: new Date(Date.now() + 10800000),
      type: 'call'
    },
    {
      id: '3',
      title: 'Review automation workflows',
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 90000000),
      type: 'task'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingTasks = tasks.filter(t => !t.completed);
  const todayEvents = calendarEvents.filter(e => 
    e.startTime.toDateString() === new Date().toDateString()
  );

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const snoozeTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, dueDate: new Date(t.dueDate.getTime() + 86400000) } : t
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'task': return CheckSquare;
      case 'insight': return Brain;
      case 'workflow': return Zap;
      default: return Bell;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    notification.read ? 'bg-muted/50' : 'bg-background hover:bg-muted/50'
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    <IconComponent className={`h-4 w-4 mt-0.5 ${getPriorityColor(notification.priority)}`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{notification.title}</div>
                      <div className="text-xs text-muted-foreground">{notification.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tasks & Reminders */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <CheckSquare className="h-4 w-4" />
            {pendingTasks.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {pendingTasks.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tasks & Reminders
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 border rounded ${task.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-5 w-5"
                    onClick={() => toggleTaskCompleted(task.id)}
                  >
                    {task.completed ? (
                      <CheckSquare className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 border rounded"></div>
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{task.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {task.source === 'ai' ? (
                          <>
                            <Brain className="h-3 w-3 mr-1" />
                            AI Generated
                          </>
                        ) : (
                          'Manual'
                        )}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Due: {task.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {!task.completed && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6"
                        onClick={() => snoozeTask(task.id)}
                      >
                        <Clock className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Calendar className="h-4 w-4" />
            {todayEvents.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {todayEvents.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {calendarEvents.map((event) => (
              <div key={event.id} className="p-3 border rounded">
                <div className="flex items-center gap-2 mb-1">
                  {event.type === 'meeting' && <Target className="h-4 w-4 text-blue-600" />}
                  {event.type === 'call' && <Bell className="h-4 w-4 text-green-600" />}
                  {event.type === 'task' && <CheckSquare className="h-4 w-4 text-purple-600" />}
                  <div className="font-medium text-sm">{event.title}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <Badge variant="outline" className="mt-2 text-xs capitalize">
                  {event.type}
                </Badge>
              </div>
            ))}
            {calendarEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events scheduled for today</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopRightPanel;
