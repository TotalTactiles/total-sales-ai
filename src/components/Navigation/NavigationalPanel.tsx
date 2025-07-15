
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  CheckSquare, 
  Calendar, 
  X, 
  Clock, 
  Plus, 
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Mail,
  Phone,
  MessageSquare,
  Target,
  Settings,
  Eye
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  type: 'ai_nudge' | 'manual' | 'system' | 'workflow';
  linkedTo?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'meeting' | 'call' | 'review' | 'milestone' | 'target';
  participants?: string[];
  description?: string;
}

const NavigationalPanel: React.FC = () => {
  const [activePanel, setActivePanel] = useState<'notifications' | 'tasks' | 'calendar' | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarView, setCalendarView] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('weekly');
  const [calendarFilters, setCalendarFilters] = useState({
    tasks: true,
    leads: true,
    team: true,
    system: true,
    manual: true
  });

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { user, profile } = useAuth();

  // Load tasks and calendar events
  useEffect(() => {
    loadTasks();
    loadCalendarEvents();
  }, []);

  const loadTasks = () => {
    // Mock tasks data - in real app, this would come from API
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Review John Smith\'s performance',
        description: 'Monthly performance review due',
        priority: 'high',
        dueDate: new Date().toISOString(),
        status: 'pending',
        type: 'ai_nudge',
        linkedTo: 'rep_coaching'
      },
      {
        id: '2',
        title: 'Follow up on hot leads',
        description: '3 hot leads need immediate attention',
        priority: 'high',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        type: 'system',
        linkedTo: 'lead_outcomes'
      },
      {
        id: '3',
        title: 'Setup automation for lead scoring',
        description: 'Configure new lead scoring automation',
        priority: 'medium',
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        type: 'workflow',
        linkedTo: 'automation_schedules'
      }
    ];
    setTasks(mockTasks);
  };

  const loadCalendarEvents = () => {
    // Mock calendar events - in real app, this would come from API
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Meeting',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        type: 'meeting',
        participants: ['John Smith', 'Sarah Johnson'],
        description: 'Weekly team sync'
      },
      {
        id: '2',
        title: 'Lead Review - Tech Corp',
        start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        type: 'review',
        description: 'Review high-value lead progress'
      },
      {
        id: '3',
        title: 'Q4 Sales Target Review',
        start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        type: 'target',
        description: 'Review quarterly sales performance'
      }
    ];
    setCalendarEvents(mockEvents);
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    // Handle navigation to full context based on notification type
    console.log('Navigate to full context for notification:', notificationId);
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'completed' as const } : task
    ));
  };

  const handleTaskSnooze = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { 
        ...task, 
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
      } : task
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ai': return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case 'task': return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case 'lead': return <Users className="h-4 w-4 text-green-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'ai_nudge': return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case 'manual': return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      case 'workflow': return <TrendingUp className="h-4 w-4 text-green-500" />;
      default: return <CheckSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="h-4 w-4 text-blue-500" />;
      case 'call': return <Phone className="h-4 w-4 text-green-500" />;
      case 'review': return <Eye className="h-4 w-4 text-purple-500" />;
      case 'milestone': return <Target className="h-4 w-4 text-orange-500" />;
      case 'target': return <TrendingUp className="h-4 w-4 text-red-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const todaysTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString() && task.status !== 'completed';
  });

  const overdueTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate < today && task.status !== 'completed';
  });

  const totalTasksCount = todaysTasks.length + overdueTasks.length;

  return (
    <div className="flex items-center space-x-4 relative">
      {/* Calendar Icon */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActivePanel(activePanel === 'calendar' ? null : 'calendar')}
        className="relative p-2 hover:bg-gray-100 rounded-lg"
      >
        <Calendar className="h-5 w-5 text-gray-600" />
      </Button>

      {/* Tasks & Reminders Icon */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActivePanel(activePanel === 'tasks' ? null : 'tasks')}
        className="relative p-2 hover:bg-gray-100 rounded-lg"
      >
        <CheckSquare className="h-5 w-5 text-gray-600" />
        {totalTasksCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-red-500"
          >
            {totalTasksCount > 9 ? '9+' : totalTasksCount}
          </Badge>
        )}
      </Button>

      {/* Notification Bell Icon */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActivePanel(activePanel === 'notifications' ? null : 'notifications')}
        className="relative p-2 hover:bg-gray-100 rounded-lg"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-red-500"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {activePanel === 'notifications' && (
        <Card className="absolute top-12 right-0 w-96 bg-white shadow-lg border rounded-lg z-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePanel(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(notification.created_at), 'PPp')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Tasks Panel */}
      {activePanel === 'tasks' && (
        <Card className="absolute top-12 right-0 w-96 bg-white shadow-lg border rounded-lg z-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Tasks & Reminders
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePanel(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              <div className="p-4 space-y-4">
                {/* Today's Tasks */}
                {todaysTasks.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm text-gray-900 mb-2">Today's Tasks</h3>
                    <div className="space-y-2">
                      {todaysTasks.map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-start gap-3">
                            {getTaskIcon(task.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTaskComplete(task.id)}
                                  className="text-xs text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Done
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTaskSnooze(task.id)}
                                  className="text-xs text-gray-600 hover:text-gray-700"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Snooze
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm text-red-600 mb-2">Overdue</h3>
                    <div className="space-y-2">
                      {overdueTasks.map((task) => (
                        <div key={task.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                          <div className="flex items-start gap-3">
                            {getTaskIcon(task.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                                <Badge className="text-xs bg-red-100 text-red-800">
                                  Overdue
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTaskComplete(task.id)}
                                  className="text-xs text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Done
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTaskSnooze(task.id)}
                                  className="text-xs text-gray-600 hover:text-gray-700"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Snooze
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {totalTasksCount === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <CheckSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No tasks for today</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Calendar Panel */}
      {activePanel === 'calendar' && (
        <Card className="absolute top-12 right-0 w-96 bg-white shadow-lg border rounded-lg z-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar
              </CardTitle>
              <div className="flex items-center space-x-2">
                <select
                  value={calendarView}
                  onChange={(e) => setCalendarView(e.target.value as any)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePanel(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              <div className="p-4 space-y-4">
                {/* Filter Options */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(calendarFilters).map(([key, value]) => (
                    <Button
                      key={key}
                      variant={value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCalendarFilters(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className="text-xs"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Events List */}
                <div className="space-y-2">
                  {calendarEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        {getEventIcon(event.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">
                              {format(new Date(event.start), 'PPp')}
                            </span>
                            {event.participants && (
                              <span className="text-xs text-gray-500">
                                • {event.participants.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {calendarEvents.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No events scheduled</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NavigationalPanel;
