
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  Plus, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  Edit,
  Eye,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface BusinessGoal {
  id: string;
  name: string;
  metricType: 'revenue' | 'clients' | 'conversion' | 'efficiency';
  targetValue: number;
  currentValue: number;
  dataSource: string[];
  deadline: string;
  owner: string;
  notes?: string;
  lastUpdated: string;
}

interface AITrainingQuestion {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  author: string;
}

const BusinessGoalsTab: React.FC = () => {
  const [goals, setGoals] = useState<BusinessGoal[]>([
    {
      id: '1',
      name: 'Increase Monthly Revenue',
      metricType: 'revenue',
      targetValue: 500000,
      currentValue: 420000,
      dataSource: ['CRM', 'Financial Reports'],
      deadline: '2025-01-31',
      owner: 'Sarah Johnson',
      notes: 'Focus on enterprise clients',
      lastUpdated: '2025-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Close 50 New Clients',
      metricType: 'clients',
      targetValue: 50,
      currentValue: 32,
      dataSource: ['CRM', 'Pipeline Data'],
      deadline: '2025-02-28',
      owner: 'Michael Chen',
      lastUpdated: '2025-01-15T08:15:00Z'
    }
  ]);

  const [aiSuggestions] = useState([
    {
      id: '1',
      summary: 'Focus on enterprise leads for higher revenue',
      targetedMetric: 'Monthly Revenue',
      timestamp: '2025-01-15T09:00:00Z',
      reasoning: 'Enterprise deals average 3x higher value than SMB deals'
    },
    {
      id: '2',
      summary: 'Optimize follow-up timing for better conversion',
      targetedMetric: 'Client Conversion',
      timestamp: '2025-01-15T08:30:00Z',
      reasoning: 'Leads contacted within 2 hours have 40% higher close rates'
    }
  ]);

  const [trainingQuestions, setTrainingQuestions] = useState<AITrainingQuestion[]>([
    {
      id: '1',
      question: 'What is your primary revenue target for this quarter?',
      answer: 'Reach $500K MRR by focusing on enterprise clients with deals over $50K',
      timestamp: '2025-01-15T10:00:00Z',
      author: 'Manager'
    },
    {
      id: '2',
      question: 'Which lead sources perform best for your team?',
      answer: 'LinkedIn outreach and warm referrals convert 60% higher than cold calls',
      timestamp: '2025-01-15T09:30:00Z',
      author: 'Manager'
    }
  ]);

  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isViewGoalOpen, setIsViewGoalOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<BusinessGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    metricType: 'revenue',
    targetValue: '',
    deadline: '',
    owner: '',
    dataSource: '',
    notes: ''
  });

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getMetricTypeColor = (type: string) => {
    switch (type) {
      case 'revenue': return 'bg-green-100 text-green-800';
      case 'clients': return 'bg-blue-100 text-blue-800';
      case 'conversion': return 'bg-purple-100 text-purple-800';
      case 'efficiency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value: number, type: string) => {
    if (type === 'revenue') {
      return `$${value.toLocaleString()}`;
    }
    return value.toString();
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetValue) {
      toast.error('Please fill in name and target value');
      return;
    }

    const goal: BusinessGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      metricType: newGoal.metricType as any,
      targetValue: parseInt(newGoal.targetValue),
      currentValue: 0,
      dataSource: newGoal.dataSource.split(',').map(s => s.trim()),
      deadline: newGoal.deadline,
      owner: newGoal.owner,
      notes: newGoal.notes,
      lastUpdated: new Date().toISOString()
    };

    setGoals([...goals, goal]);
    setNewGoal({
      name: '',
      metricType: 'revenue',
      targetValue: '',
      deadline: '',
      owner: '',
      dataSource: '',
      notes: ''
    });
    setIsAddGoalOpen(false);
    toast.success('Goal added successfully');
  };

  const handleViewGoal = (goal: BusinessGoal) => {
    setSelectedGoal(goal);
    setIsViewGoalOpen(true);
  };

  const handleEditGoal = (goal: BusinessGoal) => {
    setSelectedGoal(goal);
    setIsEditGoalOpen(true);
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const updateQuestionAnswer = (questionId: string, answer: string) => {
    setTrainingQuestions(prev => 
      prev.map(q => q.id === questionId 
        ? { ...q, answer, timestamp: new Date().toISOString() }
        : q
      )
    );
    toast.success('Answer updated and sent to AI training');
  };

  const exportSuggestions = () => {
    toast.info('Exporting suggestions to PDF...');
    // TODO: Implement PDF export
  };

  const retrainAI = () => {
    toast.info('Retraining AI with latest data...');
    // TODO: Implement AI retraining
  };

  const alignmentScore = 84;
  const getAlignmentColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Goals Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Business Goals
            </CardTitle>
            <Button onClick={() => setIsAddGoalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <Badge className={getMetricTypeColor(goal.metricType)}>
                        {goal.metricType}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Data Sources:</span> {goal.dataSource.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Owner:</span> {goal.owner}
                      </div>
                      <div>
                        <span className="font-medium">Deadline:</span> {goal.deadline}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span> {new Date(goal.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewGoal(goal)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditGoal(goal)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Current Performance</span>
                    <span className="font-medium">
                      {formatValue(goal.currentValue, goal.metricType)} / {formatValue(goal.targetValue, goal.metricType)}
                    </span>
                  </div>
                  <Progress value={getProgressPercentage(goal.currentValue, goal.targetValue)} className="h-2" />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {getProgressPercentage(goal.currentValue, goal.targetValue).toFixed(1)}% complete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Goal-Aligned AI Suggestions
            </CardTitle>
            <Button variant="outline" onClick={exportSuggestions}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{suggestion.summary}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Targeted Metric:</span> {suggestion.targetedMetric}
                      </div>
                      <div>
                        <span className="font-medium">Generated:</span> {new Date(suggestion.timestamp).toLocaleString()}
                      </div>
                    </div>
                    {suggestion.reasoning && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Reasoning:</span> {suggestion.reasoning}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Training Questions */}
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
              <div key={question.id} className="border rounded-lg">
                <button
                  onClick={() => toggleQuestion(question.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium">{question.question}</span>
                  {expandedQuestions.includes(question.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedQuestions.includes(question.id) && (
                  <div className="p-4 border-t">
                    <Textarea
                      value={question.answer}
                      onChange={(e) => updateQuestionAnswer(question.id, e.target.value)}
                      placeholder="Enter your answer..."
                      className="mb-3"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Last updated: {new Date(question.timestamp).toLocaleString()}</span>
                      <span>By: {question.author}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Alignment Tracker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI Alignment Tracker
            </CardTitle>
            <Button onClick={retrainAI}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retrain AI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getAlignmentColor(alignmentScore)}`}>
                {alignmentScore}%
              </div>
              <div className="text-gray-600">Goal Alignment Score</div>
              <Progress value={alignmentScore} className="mt-4" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Last Trained:</span>
                <p>January 4, 2025</p>
              </div>
              <div>
                <span className="font-medium">Next Training:</span>
                <p>January 11, 2025</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Contributing Factors:</strong> Rep activity alignment (90%), workflow completion (85%), lead quality metrics (78%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Goal Modal */}
      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="Enter goal name"
              />
            </div>
            <div>
              <Label htmlFor="metricType">Metric Type</Label>
              <Select value={newGoal.metricType} onValueChange={(value) => setNewGoal({ ...newGoal, metricType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="clients">Clients</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                  <SelectItem value="efficiency">Efficiency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetValue">Target Value</Label>
              <Input
                id="targetValue"
                type="number"
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                placeholder="Enter target value"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={newGoal.owner}
                onChange={(e) => setNewGoal({ ...newGoal, owner: e.target.value })}
                placeholder="Enter owner name"
              />
            </div>
            <div>
              <Label htmlFor="dataSource">Data Sources (comma-separated)</Label>
              <Input
                id="dataSource"
                value={newGoal.dataSource}
                onChange={(e) => setNewGoal({ ...newGoal, dataSource: e.target.value })}
                placeholder="CRM, Analytics, Reports"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={newGoal.notes}
                onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddGoal}>Add Goal</Button>
              <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Goal Modal */}
      <Dialog open={isViewGoalOpen} onOpenChange={setIsViewGoalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Goal Details</DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedGoal.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Type:</strong> {selectedGoal.metricType}</div>
                  <div><strong>Owner:</strong> {selectedGoal.owner}</div>
                  <div><strong>Deadline:</strong> {selectedGoal.deadline}</div>
                  <div><strong>Data Sources:</strong> {selectedGoal.dataSource.join(', ')}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Performance</h4>
                <div className="text-2xl font-bold mb-2">
                  {formatValue(selectedGoal.currentValue, selectedGoal.metricType)} / {formatValue(selectedGoal.targetValue, selectedGoal.metricType)}
                </div>
                <Progress value={getProgressPercentage(selectedGoal.currentValue, selectedGoal.targetValue)} className="mb-2" />
                <div className="text-sm text-gray-600">
                  {getProgressPercentage(selectedGoal.currentValue, selectedGoal.targetValue).toFixed(1)}% complete
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">AI Insights</h4>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">Based on current performance, you're tracking well to meet this goal. Consider focusing on high-value prospects to accelerate progress.</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Data Source Map</h4>
                <div className="text-sm text-gray-600">
                  Connected to: {selectedGoal.dataSource.join(', ')}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessGoalsTab;
