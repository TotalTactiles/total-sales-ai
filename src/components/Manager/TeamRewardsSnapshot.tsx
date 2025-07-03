
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Gift, Target } from 'lucide-react';

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
}

interface TeamRewardsSnapshotProps {
  className?: string;
}

const TeamRewardsSnapshot: React.FC<TeamRewardsSnapshotProps> = ({ className = '' }) => {
  // Mock data for top 3 team members' rewards
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
      icon: '💰'
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
      icon: '🏖️'
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
      icon: '🏆'
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const formatMetricValue = (value: number, metric: string) => {
    if (metric.includes('Revenue') || metric.includes('Bonus')) {
      return `$${value.toLocaleString()}`;
    }
    return value.toString();
  };

  return (
    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Team Rewards Snapshot
          <span className="text-orange-100 text-sm ml-auto">3 Active</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {teamRewards.map((reward) => (
            <div key={reward.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm">
                    {reward.repInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 text-sm">{reward.repName}</h4>
                    <span className="text-lg">{reward.icon}</span>
                  </div>
                  <p className="text-xs text-gray-600">{reward.rewardTitle}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">{reward.targetMetric}</span>
                  <span className={`text-xs font-semibold ${getProgressColor(reward.progress)}`}>
                    {reward.progress}%
                  </span>
                </div>
                
                <Progress value={reward.progress} className="h-2" />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {formatMetricValue(reward.currentValue, reward.targetMetric)} / {formatMetricValue(reward.targetValue, reward.targetMetric)}
                  </span>
                  <span>
                    {formatMetricValue(reward.targetValue - reward.currentValue, reward.targetMetric)} to go
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-sm"
          onClick={() => console.log('Navigate to Team Rewards tab')}
        >
          View All Team Rewards
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamRewardsSnapshot;
