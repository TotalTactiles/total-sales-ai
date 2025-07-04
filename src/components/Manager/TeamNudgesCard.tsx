
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingDown, 
  Users, 
  Heart, 
  Target, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamNudge {
  id: string;
  type: 'performance' | 'coaching' | 'burnout' | 'goals' | 'activity';
  title: string;
  description: string;
  actionText: string;
  filterState?: string;
  priority: 'high' | 'medium' | 'low';
}

const TeamNudgesCard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('performance');

  const teamNudges: TeamNudge[] = [
    {
      id: '1',
      type: 'performance',
      title: 'Michael Chen below target',
      description: '25% behind monthly goal',
      actionText: 'Review Performance',
      filterState: 'performance-review',
      priority: 'high'
    },
    {
      id: '2',
      type: 'coaching',
      title: 'Emily needs objection training',
      description: 'Price objections up 40%',
      actionText: 'Assign Training',
      filterState: 'coaching-needed',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'burnout',
      title: 'Sarah working overtime',
      description: '12+ hours daily this week',
      actionText: 'Schedule Check-in',
      filterState: 'burnout-risk',
      priority: 'high'
    },
    {
      id: '4',
      type: 'goals',
      title: 'Q4 targets adjustment',
      description: '78% team on track',
      actionText: 'Review Goals',
      filterState: 'goal-tracking',
      priority: 'medium'
    },
    {
      id: '5',
      type: 'activity',
      title: 'Call volume declining',
      description: 'Down 15% vs last week',
      actionText: 'Boost Activity',
      filterState: 'activity-boost',
      priority: 'medium'
    }
  ];

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'performance': return TrendingDown;
      case 'coaching': return Users;
      case 'burnout': return Heart;
      case 'goals': return Target;
      case 'activity': return Activity;
      default: return Users;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNudgeAction = (nudge: TeamNudge) => {
    navigate(`/manager/team?filter=${nudge.filterState || nudge.type}`);
  };

  const getFilteredNudges = () => {
    return teamNudges.filter(nudge => nudge.type === activeTab).slice(0, 3);
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Users className="h-5 w-5" />
          Team Nudges
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
          <TabsList className="grid w-full grid-cols-5 text-xs">
            <TabsTrigger value="performance" className="text-xs">Perf</TabsTrigger>
            <TabsTrigger value="coaching" className="text-xs">Coach</TabsTrigger>
            <TabsTrigger value="burnout" className="text-xs">Burnout</TabsTrigger>
            <TabsTrigger value="goals" className="text-xs">Goals</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>
          
          <div className="space-y-2">
            {getFilteredNudges().map((nudge) => (
              <div
                key={nudge.id}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleNudgeAction(nudge)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-900">{nudge.title}</h4>
                  <Badge className={`${getPriorityColor(nudge.priority)} text-xs`}>
                    {nudge.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{nudge.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-orange-600 font-medium">
                    {nudge.actionText}
                  </span>
                  <ArrowRight className="h-3 w-3 text-orange-600" />
                </div>
              </div>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamNudgesCard;
