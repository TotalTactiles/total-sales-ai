
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Eye, 
  Edit, 
  Target, 
  TrendingUp, 
  Brain, 
  FileText, 
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface BusinessGoal {
  id: string;
  name: string;
  metric: string;
  dataSource: string;
  targetValue: number;
  currentValue: number;
  timeframe: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
  assignee: string;
  createdDate: Date;
  notes: string;
}

interface AISuggestion {
  id: string;
  summary: string;
  linkedMetric: string;
  timestamp: Date;
  triggerSource: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

interface AITrainingQuestion {
  id: string;
  question: string;
  category: string;
  answered: boolean;
  answer?: string;
  timestamp: Date;
}

const BusinessGoalsTab: React.FC = () => {
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<BusinessGoal | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<AITrainingQuestion | null>(null);
  const [questionAnswer, setQuestionAnswer] = useState('');

  const [goals] = useState<BusinessGoal[]>([
    {
      id: '1',
      name: 'Increase Monthly Recurring Revenue',
      metric: 'MRR Growth',
      dataSource: 'Stripe + Salesforce',
      targetValue: 50000,
      currentValue: 42000,
      timeframe: 'Q1 2024',
      status: 'on_track',
      assignee: 'Sarah Johnson',
      createdDate: new Date('2023-12-01'),
      notes: 'Focus on enterprise accounts and upselling existing customers'
    },
    {
      id: '2',
      name: 'Improve Lead Conversion Rate',
      metric: 'Conversion %',
      dataSource: 'CRM Analytics',
      targetValue: 25,
      currentValue: 18,
      timeframe: 'Q1 2024',
      status: 'at_risk',
      assignee: 'Mike Rodriguez',
      createdDate: new Date('2023-11-15'),
      notes: 'Implement new qualification process and lead scoring'
    },
    {
      id: '3',
      name: 'Reduce Customer Acquisition Cost',
      metric: 'CAC',
      dataSource: 'Marketing + Sales Data',
      targetValue: 500,
      currentValue: 650,
      timeframe: 'Q2 2024',
      status: 'behind',
      assignee: 'Lisa Kim',
      createdDate: new Date('2023-10-20'),
      notes: 'Optimize ad spend and improve organic channels'
    }
  ]);

  const [aiSuggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      summary: 'Focus on enterprise leads for higher MRR growth - they convert 3x better',
      linkedMetric: 'MRR Growth',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      triggerSource: 'Lead Analysis Pattern',
      confidence: 87,
      impact: 'high'
    },
    {
      id: '2',
      summary: 'Implement automated follow-up sequences to improve conversion rates',
      linkedMetric: 'Conversion %',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      triggerSource: 'Workflow Analysis',
      confidence: 92,
      impact: 'high'
    },
    {
      id: '3',
      summary: 'Social media campaigns on LinkedIn show 40% lower CAC than Google Ads',
      linkedMetric: 'CAC',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      triggerSource: 'Marketing Channel Analysis',
      confidence: 78,
      impact: 'medium'
    }
  ]);

  const [trainingQuestions] = useState<AITrainingQuestion[]>([
    {
      id: '1',
      question: 'What is your ideal customer profile for enterprise accounts?',
      category: 'Customer Segmentation',
      answered: false,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      question: 'How do you prioritize leads when they have similar scores?',
      category: 'Lead Qualification',
      answered: true,
      answer: 'We prioritize based on company size, budget authority, and timeline urgency',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      question: 'What are the key indicators that a lead is ready for a demo?',
      category: 'Sales Process',
      answered: false,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [alignmentScore] = useState(78);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-700';
      case 'at_risk': return 'bg-yellow-100 text-yellow-700';
      case 'behind': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'at_risk': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'behind': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getProgress = (current: number, target: number, isReverse: boolean = false) => {
    if (isReverse) {
      // For metrics where lower is better (like CAC)
      const progress = Math.max(0, Math.min(100, ((target - current) / target) * 100 + 100));
      return Math.round(progress);
    } else {
      // For metrics where higher is better
      return Math.round((current / target) * 100);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlignmentColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewGoal = (goal: BusinessGoal) => {
    setSelectedGoal(goal);
    setIsViewModalOpen(true);
  };

  const handleAnswerQuestion = (question: AITrainingQuestion) => {
    setSelectedQuestion(question);
    setQuestionAnswer(question.answer || '');
  };

  const handleSaveAnswer = () => {
    if (!questionAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }
    
    toast.success('Answer saved - AI will use this to improve recommendations');
    setSelectedQuestion(null);
    setQuestionAnswer('');
  };

  const handleExportInsights = () => {
    toast.info('Exporting AI insights to PDF - Feature disabled for demo');
  };

  const handleRetrainAI = () => {
    toast.info('AI Retraining initiated - This process takes 10-15 minutes');
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Less than 1h ago';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">Goals Management</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="training">AI Training</TabsTrigger>
          <TabsTrigger value="alignment">AI Alignment</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          {/* Goals Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Business Goals</h3>
              <p className="text-sm text-gray-600">
                Track and manage your business objectives with real-time data sync
              </p>
            </div>
            <Button onClick={() => setIsAddGoalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </div>

          {/* Goals Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
                <div className="text-sm text-gray-600">Total Goals</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {goals.filter(g => g.status === 'on_track').length}
                </div>
                <div className="text-sm text-gray-600">On Track</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {goals.filter(g => g.status === 'at_risk').length}
                </div>
                <div className="text-sm text-gray-600">At Risk</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {goals.filter(g => g.status === 'behind').length}
                </div>
                <div className="text-sm text-gray-600">Behind</div>
              </CardContent>
            </Card>
          </div>

          {/* Goals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{goal.name}</h4>
                        <Badge className={getStatusColor(goal.status)}>
                          {getStatusIcon(goal.status)}
                          <span className="ml-1 capitalize">{goal.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Metric: </span>
                          <span className="font-medium">{goal.metric}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Progress: </span>
                          <span className="font-medium">
                            {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Timeframe: </span>
                          <span className="font-medium">{goal.timeframe}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Assigned: </span>
                          <span className="font-medium">{goal.assignee}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>
                            {getProgress(goal.currentValue, goal.targetValue, goal.metric === 'CAC')}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              goal.status === 'on_track' ? 'bg-green-500' :
                              goal.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${getProgress(goal.currentValue, goal.targetValue, goal.metric === 'CAC')}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewGoal(goal)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.info('Edit goal - Feature disabled for demo')}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          {/* AI Suggestions Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">AI Suggestions</h3>
              <p className="text-sm text-gray-600">
                AI-generated insights and recommendations based on your business goals
              </p>
            </div>
            <Button onClick={handleExportInsights}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>

          {/* Suggestions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2">{suggestion.summary}</CardTitle>
                    <Badge className={getImpactColor(suggestion.impact)}>
                      {suggestion.impact} impact
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-600">Linked Metric: </span>
                    <span className="font-medium">{suggestion.linkedMetric}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-600">Trigger Source: </span>
                    <span className="font-medium">{suggestion.triggerSource}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{formatTimeAgo(suggestion.timestamp)}</span>
                    <div className="flex items-center gap-1">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{suggestion.confidence}% confidence</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          {/* AI Training Header */}
          <div>
            <h3 className="text-lg font-semibold">AI Training Questions</h3>
            <p className="text-sm text-gray-600">
              Answer questions to help AI better understand your business context and preferences
            </p>
          </div>

          {/* Training Questions */}
          <div className="space-y-4">
            {trainingQuestions.map((question) => (
              <Card key={question.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{question.question}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge className={question.answered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {question.answered ? 'Answered' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(question.timestamp)}
                    </div>
                  </div>

                  {question.answered && question.answer && (
                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      <div className="text-sm font-medium text-green-800 mb-1">Your Answer:</div>
                      <div className="text-sm text-green-700">{question.answer}</div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button 
                      variant={question.answered ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleAnswerQuestion(question)}
                    >
                      {question.answered ? 'Update Answer' : 'Answer Question'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alignment" className="space-y-6">
          {/* AI Alignment Tracker */}
          <div>
            <h3 className="text-lg font-semibold">AI Alignment Tracker</h3>
            <p className="text-sm text-gray-600">
              Monitor how well the AI aligns with your business goals and preferences
            </p>
          </div>

          {/* Alignment Score */}
          <Card>
            <CardContent className="p-8 text-center">
              <div className={`text-6xl font-bold mb-4 ${getAlignmentColor(alignmentScore)}`}>
                {alignmentScore}%
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Alignment Score</h3>
              <p className="text-gray-600 mb-6">
                {alignmentScore >= 80 ? 'Excellent alignment with your business goals' :
                 alignmentScore >= 60 ? 'Good alignment, room for improvement' :
                 'Poor alignment, consider retraining'}
              </p>
              
              <div className="flex justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Training Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89</div>
                  <div className="text-sm text-gray-600">Questions Answered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-600">Data Points</div>
                </div>
              </div>

              <Button onClick={handleRetrainAI} size="lg" className="gap-2">
                <RefreshCw className="h-5 w-5" />
                Retrain AI
              </Button>
            </CardContent>
          </Card>

          {/* Training Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Training Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div>
                    <div className="font-medium">Last Training Session</div>
                    <div className="text-sm text-gray-600">January 10, 2024 - 14:30</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Completed</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <div>
                    <div className="font-medium">Next Scheduled Training</div>
                    <div className="text-sm text-gray-600">January 24, 2024 - Auto-scheduled</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Post-Training Effects</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        After retraining, all AI systems (Company Brain, Rep OS, TSAM Brain) 
                        will recalibrate to align with updated business goals and preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Goal Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedGoal?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedGoal && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Goal Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Metric:</span> {selectedGoal.metric}</div>
                    <div><span className="text-gray-600">Data Source:</span> {selectedGoal.dataSource}</div>
                    <div><span className="text-gray-600">Timeframe:</span> {selectedGoal.timeframe}</div>
                    <div><span className="text-gray-600">Assignee:</span> {selectedGoal.assignee}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Progress</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {getProgress(selectedGoal.currentValue, selectedGoal.targetValue, selectedGoal.metric === 'CAC')}%
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {selectedGoal.currentValue.toLocaleString()} / {selectedGoal.targetValue.toLocaleString()}
                    </div>
                    <Badge className={getStatusColor(selectedGoal.status)}>
                      {getStatusIcon(selectedGoal.status)}
                      <span className="ml-1 capitalize">{selectedGoal.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  {selectedGoal.notes}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">AI Insights</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-800">AI Recommendation</div>
                      <div className="text-sm text-blue-700 mt-1">
                        Based on current trends, focus on enterprise leads and implement 
                        automated follow-up sequences to accelerate progress toward this goal.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => toast.info('Edit goal - Feature disabled for demo')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Goal
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Answer Question Modal */}
      <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Answer Training Question</DialogTitle>
          </DialogHeader>
          
          {selectedQuestion && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800 mb-2">Question:</div>
                <div className="text-blue-700">{selectedQuestion.question}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Answer:</label>
                <textarea
                  value={questionAnswer}
                  onChange={(e) => setQuestionAnswer(e.target.value)}
                  placeholder="Provide detailed answer to help AI understand your preferences..."
                  className="w-full h-32 p-3 border rounded-md resize-none"
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    Your answer will be used to improve AI recommendations and align 
                    future suggestions with your business preferences.
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAnswer}>
                  Save Answer
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Dialog>

      {/* Add Goal Modal */}
      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Business Goal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input placeholder="Goal name (e.g., Increase Monthly Revenue)" />
            <Input placeholder="Metric (e.g., MRR, Conversion Rate, CAC)" />
            <select className="w-full border rounded-md px-3 py-2">
              <option>Select timeframe</option>
              <option>This Quarter</option>
              <option>Next Quarter</option>
              <option>This Year</option>
              <option>Custom</option>
            </select>
            <Input placeholder="Target value" type="number" />
            <Input placeholder="Data source (e.g., Stripe, Salesforce)" />
            <select className="w-full border rounded-md px-3 py-2">
              <option>Assign to</option>
              <option>Sarah Johnson</option>
              <option>Mike Rodriguez</option>
              <option>Lisa Kim</option>
            </select>
            <textarea 
              placeholder="Notes and context for this goal..."
              className="w-full h-24 p-3 border rounded-md resize-none"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Goal added successfully');
                setIsAddGoalOpen(false);
              }}>
                <Target className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessGoalsTab;
