
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Award, Brain, Calendar, Phone, DollarSign, TrendingUp } from 'lucide-react';
import { TooltipInfo } from '@/components/ui/tooltip-info';

export const EnhancedGoalsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('progress');

  const goals = [
    {
      title: 'Monthly Calls',
      current: 196,
      target: 200,
      progress: 98,
      pace: 'On track',
      icon: Phone,
      color: 'text-blue-600',
      aiInsight: "You're 4 calls away from your target. Maintain current pace to finish strong this month."
    },
    {
      title: 'Revenue Target',
      current: 63500,
      target: 80000,
      progress: 79,
      pace: 'Slightly behind',
      icon: DollarSign,
      color: 'text-green-600',
      aiInsight: "Focus on closing 2-3 high-value deals this week. Pipeline shows $22K in qualified opportunities."
    },
    {
      title: 'Meetings Booked',
      current: 41,
      target: 50,
      progress: 82,
      pace: 'Ahead of pace',
      icon: Calendar,
      color: 'text-purple-600',
      aiInsight: "Great progress! Book 3 more meetings to exceed your target and unlock bonus tier."
    }
  ];

  const rewards = [
    {
      title: 'Call Champion',
      requirement: '200+ calls',
      reward: '$250 bonus',
      progress: 98,
      unlocked: false
    },
    {
      title: 'Revenue Rockstar',
      requirement: '$80K revenue',
      reward: '$500 bonus + recognition',
      progress: 79,
      unlocked: false
    },
    {
      title: 'Meeting Master',
      requirement: '50+ meetings',
      reward: '$200 bonus',
      progress: 82,
      unlocked: false
    },
    {
      title: 'Triple Threat',
      requirement: 'Hit all 3 targets',
      reward: '$1000 bonus + promotion track',
      progress: Math.min(98, 79, 82),
      unlocked: false
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Goals & Rewards Hub
          <TooltipInfo content="Track your progress toward monthly targets and see available reward milestones. Achieving goals unlocks bonuses and career advancement opportunities." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Progress Tracker</TabsTrigger>
            <TabsTrigger value="rewards">Reward Milestones</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-4 mt-4">
            {goals.map((goal, index) => {
              const IconComponent = goal.icon;
              const paceColor = goal.pace === 'On track' ? 'text-green-600' : 
                             goal.pace === 'Ahead of pace' ? 'text-blue-600' : 'text-orange-600';
              
              return (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-5 w-5 ${goal.color}`} />
                      <span className="font-medium">{goal.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={paceColor}>
                        {goal.pace}
                      </Badge>
                      <span className="font-bold">
                        {goal.title.includes('Revenue') ? formatCurrency(goal.current) : goal.current}
                        /{goal.title.includes('Revenue') ? formatCurrency(goal.target) : goal.target}
                      </span>
                    </div>
                  </div>
                  <Progress value={goal.progress} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{goal.progress}% completed</span>
                    <span>
                      {goal.title.includes('Revenue') ? 
                        formatCurrency(goal.target - goal.current) : 
                        (goal.target - goal.current)
                      } to go
                    </span>
                  </div>
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="rewards" className="space-y-4 mt-4">
            {rewards.map((reward, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">{reward.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{reward.requirement}</p>
                  </div>
                  <Badge variant={reward.progress >= 100 ? "default" : "outline"} className="text-green-700">
                    {reward.reward}
                  </Badge>
                </div>
                <Progress value={reward.progress} className="h-2 mb-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{reward.progress}% complete</span>
                  {reward.progress >= 90 && (
                    <span className="text-green-600 font-medium">Almost there!</span>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4 mt-4">
            {goals.map((goal, index) => {
              const IconComponent = goal.icon;
              return (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-full">
                      <IconComponent className={`h-4 w-4 ${goal.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{goal.title}</h4>
                      <p className="text-sm text-gray-700">{goal.aiInsight}</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              );
            })}
            
            <div className="mt-6">
              <Button className="w-full">
                <Brain className="h-4 w-4 mr-2" />
                Get Personalized Action Plan
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
