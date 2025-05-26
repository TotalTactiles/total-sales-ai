
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle,
  Star,
  Zap,
  User
} from 'lucide-react';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { useAuth } from '@/contexts/AuthContext';

interface SalesRepAIAssistantProps {
  className?: string;
}

const SalesRepAIAssistant: React.FC<SalesRepAIAssistantProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { salesRepAI, logUserAction } = useUnifiedAI();
  const { profile } = useAuth();

  // Only show for sales reps
  if (profile?.role !== 'sales_rep') {
    return null;
  }

  useEffect(() => {
    if (isExpanded) {
      salesRepAI.getPersonalizedRecommendations();
      logUserAction('open_sales_ai_assistant', { timestamp: new Date().toISOString() });
    }
  }, [isExpanded]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.full_name?.split(' ')[0] || 'Rep';
    
    if (hour < 12) {
      return `Good morning, ${name}! Ready to crush your goals today?`;
    } else if (hour < 17) {
      return `Good afternoon, ${name}! Keep that momentum going!`;
    } else {
      return `Good evening, ${name}! Time to wrap up strong!`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      case 'follow_up':
        return Clock;
      default:
        return Target;
    }
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
        <div className="relative">
          <Button
            onClick={() => setIsExpanded(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          >
            <Brain className="h-8 w-8 text-white" />
            <div className="absolute -top-1 -right-1">
              <div className="h-4 w-4 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </Button>
          
          {salesRepAI.taskRecommendations.length > 0 && !isExpanded && (
            <div className="absolute -top-1 -left-1">
              <Badge className="bg-red-500 text-xs px-1 animate-bounce">
                {salesRepAI.taskRecommendations.length}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Panel */}
      {isExpanded && (
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Side Panel */}
          <div className="mr-auto w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-left">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6" />
                  <div>
                    <h2 className="text-xl font-bold">AI Sales Coach</h2>
                    <p className="text-green-100 text-sm">Your personal performance optimizer</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-white/20"
                >
                  ×
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Greeting */}
                <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                  <CardContent className="p-4">
                    <p className="text-green-800 font-medium">
                      {getGreeting()}
                    </p>
                  </CardContent>
                </Card>

                {/* Task Recommendations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Priority Tasks
                  </h3>
                  
                  {salesRepAI.isGenerating ? (
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-600"></div>
                        <p>Analyzing your pipeline for optimal tasks...</p>
                      </CardContent>
                    </Card>
                  ) : salesRepAI.taskRecommendations.length > 0 ? (
                    <div className="space-y-3">
                      {salesRepAI.taskRecommendations.slice(0, 3).map((task) => {
                        const TaskIcon = getTaskIcon(task.type);
                        return (
                          <Card key={task.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-green-100 rounded-lg">
                                    <TaskIcon className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{task.title}</h4>
                                    <p className="text-sm text-gray-600">{task.description}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                <span>Success: {Math.round(task.success_probability * 100)}%</span>
                                <span>{task.estimated_duration} min</span>
                                {task.best_time && <span>Best: {task.best_time}</span>}
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                <p className="text-sm text-gray-700">
                                  <strong>AI Reasoning:</strong> {task.reasoning}
                                </p>
                              </div>
                              
                              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                                <Zap className="h-4 w-4 mr-2" />
                                Take Action
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-4 text-center text-gray-500">
                        <p>No priority tasks right now. Great job staying on top of things!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Performance Insights */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Performance Insights
                  </h3>
                  
                  {salesRepAI.performanceInsights.length > 0 ? (
                    <div className="space-y-3">
                      {salesRepAI.performanceInsights.map((insight) => (
                        <Card key={insight.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium capitalize">
                                {insight.metric.replace(/_/g, ' ')}
                              </h4>
                              <Badge variant="outline" className={
                                insight.trend === 'improving' ? 'text-green-700 border-green-300' :
                                insight.trend === 'declining' ? 'text-red-700 border-red-300' :
                                'text-gray-700 border-gray-300'
                              }>
                                {insight.trend}
                              </Badge>
                            </div>
                            
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Current: {insight.current_value}</span>
                                <span>Benchmark: {insight.benchmark}</span>
                              </div>
                              <Progress 
                                value={(insight.current_value / insight.benchmark) * 100} 
                                className="h-2"
                              />
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{insight.suggestion}</p>
                            
                            {insight.action_items.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Action Items:</p>
                                {insight.action_items.map((item, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-4 text-center text-gray-500">
                        <p>Performance insights will appear as you use the platform</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Coaching Recommendations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    Personalized Coaching
                  </h3>
                  
                  {salesRepAI.coachingItems.length > 0 ? (
                    <div className="space-y-3">
                      {salesRepAI.coachingItems.map((coaching) => (
                        <Card key={coaching.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{coaching.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getPriorityColor(coaching.priority)}>
                                  {coaching.priority}
                                </Badge>
                                <Badge variant="secondary">
                                  {coaching.difficulty}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{coaching.description}</p>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                              <span>{coaching.estimated_time} minutes</span>
                              {coaching.interactive && (
                                <Badge variant="outline" className="text-xs">
                                  Interactive
                                </Badge>
                              )}
                            </div>
                            
                            {coaching.progress !== undefined && (
                              <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{coaching.progress}%</span>
                                </div>
                                <Progress value={coaching.progress} className="h-2" />
                              </div>
                            )}
                            
                            <Button size="sm" variant="outline" className="w-full">
                              <User className="h-4 w-4 mr-2" />
                              Start Coaching
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-4 text-center text-gray-500">
                        <p>Coaching recommendations will be generated based on your performance</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SalesRepAIAssistant;
