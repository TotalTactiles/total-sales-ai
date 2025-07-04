
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamReward {
  id: string;
  rewardTitle: string;
  participants: Array<{
    id: string;
    name: string;
    initials: string;
    progress: number;
    currentValue: number;
    targetValue: number;
  }>;
}

const TeamRewardsCard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedReward, setSelectedReward] = useState('all');

  const teamRewards: TeamReward[] = [
    {
      id: '1',
      rewardTitle: '$1K Gold Bonus',
      participants: [
        { id: '1', name: 'Sarah Johnson', initials: 'SJ', progress: 80, currentValue: 40000, targetValue: 50000 },
        { id: '3', name: 'Emily Rodriguez', initials: 'ER', progress: 60, currentValue: 30000, targetValue: 50000 }
      ]
    },
    {
      id: '2',
      rewardTitle: 'Friday Off Reward',
      participants: [
        { id: '2', name: 'Michael Chen', initials: 'MC', progress: 92, currentValue: 92, targetValue: 100 }
      ]
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const handleViewAllRewards = () => {
    navigate('/manager/team?subtab=team-rewards');
  };

  const getDisplayedRewards = () => {
    if (selectedReward === 'all') {
      return teamRewards;
    }
    return teamRewards.filter(reward => reward.id === selectedReward);
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Gift className="h-5 w-5" />
            Rewards Snapshot
          </CardTitle>
          <Select value={selectedReward} onValueChange={setSelectedReward}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rewards</SelectItem>
              {teamRewards.map(reward => (
                <SelectItem key={reward.id} value={reward.id}>
                  {reward.rewardTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {getDisplayedRewards().map((reward) => (
            <div key={reward.id} className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-orange-600" />
                {reward.rewardTitle}
              </h4>
              
              <div className="space-y-3">
                {reward.participants.map((participant) => (
                  <div key={participant.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs">
                            {participant.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-700">{participant.name}</span>
                      </div>
                      <span className={`text-sm font-semibold ${getProgressColor(participant.progress)}`}>
                        {participant.progress}%
                      </span>
                    </div>
                    <Progress value={participant.progress} className="h-2" />
                    <div className="text-xs text-gray-500 text-right">
                      {participant.currentValue.toLocaleString()} / {participant.targetValue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleViewAllRewards}
          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-sm"
        >
          View All Team Rewards
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamRewardsCard;
