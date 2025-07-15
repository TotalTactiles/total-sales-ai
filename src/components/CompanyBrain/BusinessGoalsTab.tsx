
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  Brain,
  Download,
  RefreshCw,
  Calendar,
  BarChart3
} from 'lucide-react';

const BusinessGoalsTab: React.FC = () => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  const goals = [
    {
      id: 1,
      name: 'Increase Monthly Revenue',
      metric: '$50,000',
      current: '$42,000',
      target: '$50,000',
      progress: 84,
      dataSource: 'CRM Integration',
      status: 'on-track',
      assignee: 'Sales Team'
    },
    {
      id: 2,
      name: 'Improve Lead Conversion Rate',
      metric: '25%',
      current: '18%',
      target: '25%',
      progress: 72,
      dataSource: 'Pipeline Analytics',
      status: 'at-risk',
      assignee: 'Marketing Team'
    },
    {
      id: 3,
      name: 'Reduce Customer Acquisition Cost',
      metric: '$200',
      current: '$250',
      target: '$200',
      progress: 60,
      dataSource: 'Marketing Analytics',
      status: 'behind',
      assignee: 'Marketing Team'
    }
  ];

  const aiSuggestions = [
    {
      id: 1,
      summary: 'Focus on high-value leads to improve conversion efficiency',
      metric: 'Lead Conversion Rate',
      timestamp: '2 hours ago',
      source: 'Pipeline Analysis'
    },
    {
      id: 2,
      summary: 'Optimize email campaigns to reduce acquisition costs',
      metric: 'Customer Acquisition Cost',
      timestamp: '4 hours ago',
      source: 'Marketing Performance'
    },
    {
      id: 3,
      summary: 'Increase follow-up frequency for Q4 revenue boost',
      metric: 'Monthly Revenue',
      timestamp: '6 hours ago',
      source: 'Sales Activity'
    }
  ];

  const trainingQuestions = [
    {
      id: 1,
      question: 'What is your primary target market segment for Q4?',
      answered: false
    },
    {
      id: 2,
      question: 'How do you currently measure customer satisfaction?',
      answered: true,
      answeredAt: '2 days ago'
    },
    {
      id: 3,
      question: 'What are your main competitive advantages?',
      answered: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="alignment">Alignment</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Business Goals
                </CardTitle>
                <Dialog open={showAddGoalModal} onOpenChange={setShowAddGoalModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Goal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input placeholder="Enter goal title" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Target Metric</label>
                        <Input placeholder="e.g., $50,000 or 25%" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Timeframe</label>
                        <Input placeholder="e.g., Q4 2024" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Data Source</label>
                        <select className="w-full p-2 border rounded">
                          <option>CRM Integration</option>
                          <option>Pipeline Analytics</option>
                          <option>Marketing Analytics</option>
                          <option>Custom Source</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Assignee</label>
                        <Input placeholder="Team or person responsible" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Create Goal</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{goal.name}</h4>
                        <p className="text-sm text-gray-500">
                          {goal.current} / {goal.target} • {goal.dataSource}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status.replace('-', ' ')}
                        </Badge>
                        <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{goal.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <h5 className="font-medium mb-2">Current Progress</h5>
                                  <div className="text-2xl font-bold">{goal.progress}%</div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${goal.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <h5 className="font-medium mb-2">Live Stats</h5>
                                  <div className="text-2xl font-bold">{goal.current}</div>
                                  <div className="text-sm text-gray-500">Target: {goal.target}</div>
                                </div>
                              </div>
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <h5 className="font-medium text-blue-900 mb-2">AI Insights</h5>
                                <p className="text-sm text-blue-800">
                                  Based on current trends, you're likely to achieve 92% of your target by the deadline. 
                                  Consider increasing follow-up activities by 15% to reach your goal.
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Assigned to: {goal.assignee}</span>
                      <span>{goal.progress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.status === 'on-track' ? 'bg-green-500' :
                          goal.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Suggestions
                </CardTitle>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{suggestion.summary}</h4>
                      <span className="text-xs text-gray-500">{suggestion.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Linked to: {suggestion.metric}</span>
                      <span>Source: {suggestion.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Training Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingQuestions.map((question) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{question.question}</h4>
                      <div className="flex items-center gap-2">
                        {question.answered ? (
                          <Badge className="bg-green-100 text-green-800">
                            Answered {question.answeredAt}
                          </Badge>
                        ) : (
                          <Button size="sm">Answer</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alignment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Alignment Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-green-100 mb-4">
                    <span className="text-3xl font-bold text-green-700">87%</span>
                  </div>
                  <h3 className="text-lg font-medium">Alignment Score</h3>
                  <p className="text-sm text-gray-500">AI is well-aligned with your business goals</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <h4 className="font-medium">Last Training</h4>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <h4 className="font-medium">Next Training</h4>
                    <p className="text-sm text-gray-500">In 4 days</p>
                  </div>
                </div>

                <div className="text-center">
                  <Button>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retrain AI
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    This will sweep all data and recalibrate AI systems
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessGoalsTab;
