
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Gift, Target, Brain, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamReward {
  id: string;
  repName: string;
  repInitials: string;
  rewardTitle: string;
  progress: number;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  icon: string;
  aiInsight: string;
  likelihood: 'high' | 'medium' | 'low';
}

interface TeamRewardsSnapshotProps {
  className?: string;
}

const TeamRewardsSnapshot: React.FC<TeamRewardsSnapshotProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  // Mock data for top 3 team members' rewards with AI insights
  const teamRewards: TeamReward[] = [
    {
      id: '1',
      repName: 'Sarah Johnson',
      repInitials: 'SJ',
      rewardTitle: '$1K Bonus',
      progress: 80,
      targetMetric: 'Monthly Revenue',
      currentValue: 40000,
      targetValue: 50000,
      icon: '💰',
      aiInsight: 'Strong momentum - likely to achieve with current deal pipeline',
      likelihood: 'high'
    },
    {
      id: '2',
      repName: 'Michael Chen',
      repInitials: 'MC',
      rewardTitle: 'Friday Off',
      progress: 85,
      targetMetric: 'Calls Made',
      currentValue: 85,
      targetValue: 100,
      icon: '🏖️',
      aiInsight: 'On track - needs 15 more calls by month-end',
      likelihood: 'high'
    },
    {
      id: '3',
      repName: 'Jasmine Lee',
      repInitials: 'JL',
      rewardTitle: 'Team Recognition',
      progress: 60,
      targetMetric: 'Demos Booked',
      currentValue: 9,
      targetValue: 15,
      icon: '🏆',
      aiInsight: 'Behind pace - suggest increasing outreach activity',
      likelihood: 'medium'
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'high': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatMetricValue = (value: number, metric: string) => {
    if (metric.includes('Revenue') || metric.includes('Bonus')) {
      return `$${value.toLocaleString()}`;
    }
    return value.toString();
  };

  const handleSeeMore = () => {
    navigate('/manager/team?subtab=team-rewards');
  };

  return (
    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Team Rewards Overview
          <div className="flex items-center gap-1 ml-auto">
            <Brain className="h-4 w-4 text-orange-100" />
            <span className="text-orange-100 text-sm">AI Insights</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Rewards Performance</span>
          </div>
          <p className="text-xs text-blue-700">
            2 rewards likely to be achieved this month. Consider adjusting Jasmine's targets or providing additional support.
          </p>
        </div>

        <div className="space-y-4">
          {teamRewards.map((reward) => (
            <div key={reward.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm">
                    {reward.repInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-gray-900">{reward.repName}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{reward.icon}</span>
                      <Badge className={`${getLikelihoodColor(reward.likelihood)} text-xs`}>
                        {reward.likelihood} chance
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{reward.rewardTitle}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">{reward.targetMetric}</span>
                  <span className={`text-xs font-semibold ${getProgressColor(reward.progress)}`}>
                    {reward.progress}%
                  </span>
                </div>
                
                <Progress value={reward.progress} className="h-2" />
                
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>
                    {formatMetricValue(reward.currentValue, reward.targetMetric)} / {formatMetricValue(reward.targetValue, reward.targetMetric)}
                  </span>
                  <span>
                    {formatMetricValue(reward.targetValue - reward.currentValue, reward.targetMetric)} to go
                  </span>
                </div>

                <div className="bg-purple-50 rounded p-2 border border-purple-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Brain className="h-3 w-3 text-purple-600" />
                    <span className="text-xs font-medium text-purple-800">AI Insight</span>
                  </div>
                  <p className="text-xs text-purple-700">{reward.aiInsight}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleSeeMore}
          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-sm"
        >
          See More Rewards
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamRewardsSnapshot;
