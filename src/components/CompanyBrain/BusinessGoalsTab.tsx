
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  Trash2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BusinessGoal {
  id: string;
  title: string;
  description: string;
  type: 'Revenue' | 'Client Wins' | 'Team Growth' | 'Product Launch';
  targetValue: number;
  currentProgress: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Completed' | 'Paused';
  deadline: string;
  owner: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface AITrainingQuestion {
  id: string;
  question: string;
  answer: string;
}

const BusinessGoalsTab: React.FC = () => {
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  // Mock data for demo
  const mockGoals: BusinessGoal[] = [
    {
      id: '1',
      title: 'Close $200K MRR',
      description: 'Enterprise focus, push higher ticket deals',
      type: 'Revenue',
      targetValue: 200000,
      currentProgress: 137000,
      priority: 'High',
      status: 'In Progress',
      deadline: '2025-07-31',
      owner: 'Sarah Johnson',
      ownerId: 'user_1',
      createdAt: '2025-06-01',
      updatedAt: '2025-07-04'
    },
    {
      id: '2',
      title: 'Acquire 50 Enterprise Clients',
      description: 'Target Fortune 500 companies',
      type: 'Client Wins',
      targetValue: 50,
      currentProgress: 32,
      priority: 'High',
      status: 'In Progress',
      deadline: '2025-08-15',
      owner: 'Michael Chen',
      ownerId: 'user_2',
      createdAt: '2025-06-15',
      updatedAt: '2025-07-03'
    },
    {
      id: '3',
      title: 'Expand Sales Team to 15 Reps',
      description: 'Hire and onboard new sales representatives',
      type: 'Team Growth',
      targetValue: 15,
      currentProgress: 12,
      priority: 'Medium',
      status: 'In Progress',
      deadline: '2025-09-01',
      owner: 'Emily Rodriguez',
      ownerId: 'user_3',
      createdAt: '2025-05-20',
      updatedAt: '2025-07-02'
    }
  ];

  const mockAISuggestions = [
    {
      id: '1',
      title: 'Enterprise leads closed 24% faster',
      description: 'Your team is excelling with enterprise deals. Consider doubling down on this segment.',
      source: 'Revenue Analysis',
      type: 'opportunity',
      impact: 'High'
    },
    {
      id: '2',
      title: 'Reps lagging on client call volume',
      description: 'Current call volume is 30% below target. Goal slippage projected for Q3.',
      source: 'Activity Tracking',
      type: 'warning',
      impact: 'Medium'
    },
    {
      id: '3',
      title: 'Proposal-to-close rate improving',
      description: 'Your proposal quality has increased conversion by 18% this month.',
      source: 'Pipeline Analysis',
      type: 'success',
      impact: 'High'
    }
  ];

  const [trainingQuestions, setTrainingQuestions] = useState<AITrainingQuestion[]>([
    {
      id: '1',
      question: 'What is your #1 revenue goal this quarter?',
      answer: 'Reach $200K MRR by focusing on enterprise clients and increasing average deal size through value-based selling.'
    },
    {
      id: '2',
      question: 'Are you targeting acquisition, retention, or expansion?',
      answer: 'Primary focus on acquisition (60%) and expansion (40%). Retention is stable at 92% so less immediate focus needed.'
    },
    {
      id: '3',
      question: 'What signals would indicate you\'re off track?',
      answer: 'Pipeline velocity dropping below 45 days, conversion rates under 15%, or monthly new client acquisition below 8 companies.'
    }
  ]);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Brain className="h-5 w-5 text-purple-600" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const updateAnswer = (questionId: string, newAnswer: string) => {
    setTrainingQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, answer: newAnswer } : q)
    );
    // Auto-save simulation
    toast.success('Answer saved and used to train Company Brain');
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Current Business Goals */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Current Business Goals
            </CardTitle>
            <Dialog open={showAddGoalModal} onOpenChange={setShowAddGoalModal}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Business Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Goal title" />
                  <Input placeholder="Description" />
                  <Button onClick={() => {
                    setShowAddGoalModal(false);
                    toast.success('Goal added successfully');
                  }}>
                    Create Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockGoals.map((goal) => (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {goal.owner}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {goal.deadline}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {goal.type === 'Revenue' ? '$' : ''}{goal.currentProgress.toLocaleString()} / {goal.type === 'Revenue' ? '$' : ''}{goal.targetValue.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={getProgressPercentage(goal.currentProgress, goal.targetValue)} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Goal-Aligned AI Suggestions */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Goal-Aligned AI Suggestions
            <Badge variant="outline" className="bg-gray-100 text-gray-600 text-xs">
              Demo Mode
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAISuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border-2 ${getSuggestionColor(suggestion.type)} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {getSuggestionIcon(suggestion.type)}
                  <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{suggestion.source}</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    View in Dashboard
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: AI Training Questions */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            AI Training Questions
          </CardTitle>
          <p className="text-sm text-gray-600">Help train the Company Brain to better understand your business goals</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingQuestions.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  {expandedQuestions.includes(item.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                {expandedQuestions.includes(item.id) && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateAnswer(item.id, e.target.value)}
                      className="w-full mt-3 p-3 border border-gray-300 rounded-md text-sm resize-none"
                      rows={3}
                      placeholder="Enter your answer here..."
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        Used to train Company Brain
                      </Badge>
                      <span className="text-xs text-green-600">Auto-saved</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: AI Alignment Tracker */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            AI Alignment Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Goal Alignment Status</h4>
                <Badge variant="outline" className="bg-gray-100 text-gray-600">
                  AI Goal-Sync Disabled
                </Badge>
              </div>
              <Button disabled className="gap-2">
                <Brain className="h-4 w-4" />
                Retrain AI
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Alignment Score</span>
                  <span className="font-bold text-2xl text-orange-600">84%</span>
                </div>
                <Progress value={84} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Last Trained</span>
                  <p className="font-medium">July 4, 2025</p>
                </div>
                <div>
                  <span className="text-gray-600">Next Training</span>
                  <p className="font-medium text-gray-400">Disabled</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> AI alignment engine is built and ready. Enable "Goal-Aware AI Suggestions" in Settings to activate full goal-sync functionality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessGoalsTab;
