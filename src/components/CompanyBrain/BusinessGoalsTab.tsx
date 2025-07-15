
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Eye, 
  Edit, 
  Brain,
  FileText,
  Download,
  HelpCircle
} from 'lucide-react';

interface BusinessGoal {
  id: string;
  name: string;
  metric: string;
  dataSource: string;
  currentValue: number;
  targetValue: number;
  status: 'on-track' | 'at-risk' | 'exceeded';
  timeframe: string;
  assignee: string;
}

interface AISuggestion {
  id: string;
  title: string;
  summary: string;
  linkedMetric: string;
  timestamp: Date;
  triggerSource: string;
}

const BusinessGoalsTab: React.FC = () => {
  const [goals, setGoals] = useState<BusinessGoal[]>([
    {
      id: '1',
      name: 'Increase Monthly Revenue',
      metric: 'Monthly Recurring Revenue',
      dataSource: 'CRM Integration',
      currentValue: 85000,
      targetValue: 100000,
      status: 'on-track',
      timeframe: 'Q1 2024',
      assignee: 'Sales Team'
    },
    {
      id: '2',
      name: 'Improve Lead Conversion',
      metric: 'Lead to Customer Rate',
      dataSource: 'Lead Management System',
      currentValue: 15,
      targetValue: 20,
      status: 'at-risk',
      timeframe: 'Monthly',
      assignee: 'Marketing Team'
    }
  ]);

  const [suggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      title: 'Optimize Follow-up Timing',
      summary: 'Analysis shows 23% higher conversion when leads are contacted within 5 minutes',
      linkedMetric: 'Lead to Customer Rate',
      timestamp: new Date(),
      triggerSource: 'Lead Behavior Analysis'
    },
    {
      id: '2',
      title: 'Focus on Enterprise Segment',
      summary: 'Enterprise leads show 3x higher lifetime value with 40% better retention',
      linkedMetric: 'Monthly Recurring Revenue',
      timestamp: new Date(Date.now() - 86400000),
      triggerSource: 'Revenue Analysis'
    },
    {
      id: '3',
      title: 'Improve Email Subject Lines',
      summary: 'A/B testing reveals 18% higher open rates with personalized subject lines',
      linkedMetric: 'Lead to Customer Rate',
      timestamp: new Date(Date.now() - 172800000),
      triggerSource: 'Email Campaign Analysis'
    }
  ]);

  const [trainingQuestions] = useState([
    'What is your primary customer acquisition channel?',
    'How do you currently measure customer satisfaction?',
    'What seasonal trends affect your business most?',
    'What is your ideal customer profile?',
    'How do you prioritize feature development?'
  ]);

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isViewGoalOpen, setIsViewGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<BusinessGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    metric: '',
    timeframe: '',
    dataSource: '',
    notes: ''
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'on-track': 'bg-green-100 text-green-800',
      'at-risk': 'bg-red-100 text-red-800',
      'exceeded': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status === 'on-track' ? 'On Track' : 
         status === 'at-risk' ? 'At Risk' : 'Exceeded'}
      </Badge>
    );
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleAddGoal = () => {
    const goal: BusinessGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      metric: newGoal.metric,
      dataSource: newGoal.dataSource,
      currentValue: 0,
      targetValue: 100,
      status: 'on-track',
      timeframe: newGoal.timeframe,
      assignee: 'Unassigned'
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({ name: '', metric: '', timeframe: '', dataSource: '', notes: '' });
    setIsAddGoalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Goals</h2>
          <p className="text-muted-foreground">Track and manage your key business objectives</p>
        </div>
        <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Business Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Goal Title</label>
                <Input
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Increase Monthly Revenue"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Metric</label>
                <Input
                  value={newGoal.metric}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, metric: e.target.value }))}
                  placeholder="e.g., Monthly Recurring Revenue"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Timeframe</label>
                <Select value={newGoal.timeframe} onValueChange={(value) => setNewGoal(prev => ({ ...prev, timeframe: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Data Source</label>
                <Select value={newGoal.dataSource} onValueChange={(value) => setNewGoal(prev => ({ ...prev, dataSource: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crm">CRM Integration</SelectItem>
                    <SelectItem value="analytics">Analytics Platform</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={newGoal.notes}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this goal..."
                  rows={3}
                />
              </div>
              <Button onClick={handleAddGoal} className="w-full">
                Add Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">{goal.metric}</p>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${calculateProgress(goal.currentValue, goal.targetValue)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                  <span>Data Source: {goal.dataSource}</span>
                  <span>Timeframe: {goal.timeframe}</span>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setIsViewGoalOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{suggestion.title}</h3>
                  <Badge variant="outline">{suggestion.linkedMetric}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{suggestion.summary}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Source: {suggestion.triggerSource}</span>
                  <span>{suggestion.timestamp.toLocaleDateString()}</span>
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
            <HelpCircle className="h-5 w-5" />
            AI Training Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trainingQuestions.slice(0, 5).map((question, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <span className="text-sm">{question}</span>
                <Button variant="outline" size="sm">
                  Answer
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            AI generates new questions weekly based on your business changes and performance data.
          </p>
        </CardContent>
      </Card>

      {/* AI Alignment Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>AI Alignment Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Current Alignment Score</span>
              <Badge className="bg-green-100 text-green-800">87%</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full" style={{ width: '87%' }}></div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Last Training: 3 days ago</span>
              <span>Next Training: In 4 days</span>
            </div>
            <Button variant="outline" className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Retrain AI System
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Goal Details Modal */}
      <Dialog open={isViewGoalOpen} onOpenChange={setIsViewGoalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedGoal?.name}</DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Value</label>
                  <p className="text-2xl font-bold">{selectedGoal.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Target Value</label>
                  <p className="text-2xl font-bold">{selectedGoal.targetValue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Progress</label>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${calculateProgress(selectedGoal.currentValue, selectedGoal.targetValue)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {calculateProgress(selectedGoal.currentValue, selectedGoal.targetValue).toFixed(1)}% complete
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">AI Insights</h4>
                <div className="bg-muted p-3 rounded">
                  <p className="text-sm">
                    Based on current trends, you're likely to reach {(selectedGoal.currentValue * 1.15).toLocaleString()} 
                    by the end of {selectedGoal.timeframe}. Consider increasing outreach activities 
                    to meet the target goal.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Data Source:</span> {selectedGoal.dataSource}
                </div>
                <div>
                  <span className="text-muted-foreground">Assignee:</span> {selectedGoal.assignee}
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
