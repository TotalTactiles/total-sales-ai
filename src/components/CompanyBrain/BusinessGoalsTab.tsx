
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Plus, Calendar, Lightbulb, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const BusinessGoalsTab: React.FC = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Increase Monthly Revenue',
      target: '$500,000',
      current: '$420,000',
      progress: 84,
      deadline: '2024-01-31',
      status: 'on-track',
      category: 'Revenue'
    },
    {
      id: 2,
      title: 'Improve Lead Conversion Rate',
      target: '35%',
      current: '28%',
      progress: 80,
      deadline: '2024-02-15',
      status: 'at-risk',
      category: 'Conversion'
    },
    {
      id: 3,
      title: 'Reduce Sales Cycle',
      target: '21 days',
      current: '26 days',
      progress: 65,
      deadline: '2024-03-01',
      status: 'behind',
      category: 'Efficiency'
    }
  ]);

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '', category: '' });

  const aiSuggestions = [
    {
      id: 1,
      title: 'Focus on High-Value Prospects',
      description: 'Your data shows 20% higher close rates with prospects over $50k deal size',
      impact: 'High',
      effort: 'Low'
    },
    {
      id: 2,
      title: 'Optimize Follow-up Timing',
      description: 'Following up within 4 hours increases response rates by 35%',
      impact: 'Medium',
      effort: 'Low'
    },
    {
      id: 3,
      title: 'Improve Proposal Quality',
      description: 'Proposals with ROI calculations have 28% higher acceptance rates',
      impact: 'High',
      effort: 'Medium'
    }
  ];

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) {
      toast.error('Please fill in title and target');
      return;
    }
    
    toast.success('Goal added successfully');
    setNewGoal({ title: '', target: '', deadline: '', category: '' });
    setIsAddGoalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'behind':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Business Goals & Tracking</h3>
          <p className="text-sm text-gray-600">Set, track, and optimize your business objectives</p>
        </div>
        <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Goal Title</label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Enter goal title..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Target</label>
                <Input
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="e.g., $100,000 or 50%"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  placeholder="e.g., Revenue, Conversion, Efficiency"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddGoal}>Add Goal</Button>
                <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{goal.category}</Badge>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{goal.current}</div>
                  <div className="text-sm text-gray-600">of {goal.target}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Deadline: {goal.deadline}
                  </div>
                  <Button variant="outline" size="sm">
                    Update Progress
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h4 className="font-medium text-gray-900">AI Suggestions</h4>
        </div>
        <div className="grid gap-4">
          {aiSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-1">{suggestion.title}</h5>
                    <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                    <div className="flex gap-2">
                      <Badge className={getImpactColor(suggestion.impact)}>
                        {suggestion.impact} Impact
                      </Badge>
                      <Badge variant="outline">
                        {suggestion.effort} Effort
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Goals Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Active Goals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">76%</div>
              <div className="text-sm text-gray-600">Avg Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">1</div>
              <div className="text-sm text-gray-600">On Track</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">Need Attention</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessGoalsTab;
