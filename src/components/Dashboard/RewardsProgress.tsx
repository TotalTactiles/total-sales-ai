
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Calendar, 
  DollarSign,
  Phone,
  Users,
  Gift,
  Lock,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

interface Reward {
  id: string;
  title: string;
  linkedKPI: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: 'locked' | 'in-progress' | 'unlocked';
  type: 'bonus' | 'time-off' | 'recognition' | 'gift';
  description: string;
  icon: string;
}

const RewardsProgress: React.FC = () => {
  const [selectedRewards, setSelectedRewards] = useState<string[]>(['1', '2', '3']);

  const mockRewards: Reward[] = [
    {
      id: '1',
      title: '$1K Bonus',
      linkedKPI: 'Monthly Revenue',
      targetAmount: 50000,
      currentAmount: 40000,
      deadline: '2024-02-29',
      status: 'in-progress',
      type: 'bonus',
      description: 'Reach $50K in monthly revenue',
      icon: '💰'
    },
    {
      id: '2',
      title: 'Friday Off',
      linkedKPI: 'Calls Made',
      targetAmount: 100,
      currentAmount: 85,
      deadline: '2024-02-15',
      status: 'in-progress',
      type: 'time-off',
      description: 'Make 100 calls this month',
      icon: '🏖️'
    },
    {
      id: '3',
      title: 'Team Recognition',
      linkedKPI: 'Demos Booked',
      targetAmount: 15,
      currentAmount: 12,
      status: 'in-progress',
      type: 'recognition',
      description: 'Book 15 demos this quarter',
      icon: '🏆'
    },
    {
      id: '4',
      title: '$500 Gift Card',
      linkedKPI: 'Conversion Rate',
      targetAmount: 25,
      currentAmount: 18,
      status: 'locked',
      type: 'gift',
      description: 'Achieve 25% conversion rate',
      icon: '🎁'
    },
    {
      id: '5',
      title: 'Top Performer Badge',
      linkedKPI: 'Win Streak',
      targetAmount: 10,
      currentAmount: 5,
      status: 'locked',
      type: 'recognition',
      description: 'Maintain 10-deal winning streak',
      icon: '⭐'
    }
  ];

  const availableRewards = mockRewards.filter(reward => !selectedRewards.includes(reward.id));
  const displayRewards = mockRewards.filter(reward => selectedRewards.includes(reward.id));

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getRemainingAmount = (current: number, target: number) => {
    const remaining = target - current;
    return remaining > 0 ? remaining : 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'locked': return <Lock className="h-4 w-4 text-gray-400" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'unlocked': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'locked': return 'bg-gray-100 text-gray-600';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'unlocked': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getKPIIcon = (kpi: string) => {
    switch (kpi.toLowerCase()) {
      case 'monthly revenue': return <DollarSign className="h-4 w-4" />;
      case 'calls made': return <Phone className="h-4 w-4" />;
      case 'demos booked': return <Calendar className="h-4 w-4" />;
      case 'conversion rate': return <Target className="h-4 w-4" />;
      case 'win streak': return <Trophy className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const formatKPIValue = (kpi: string, value: number) => {
    switch (kpi.toLowerCase()) {
      case 'monthly revenue': return `$${value.toLocaleString()}`;
      case 'conversion rate': return `${value}%`;
      default: return value.toString();
    }
  };

  const addReward = (rewardId: string) => {
    setSelectedRewards([...selectedRewards, rewardId]);
  };

  const removeReward = (rewardId: string) => {
    setSelectedRewards(selectedRewards.filter(id => id !== rewardId));
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Your Rewards Progress
          <Badge className="bg-white/20 text-white text-xs">
            {displayRewards.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {displayRewards.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Choose a reward to unlock this space</h3>
            <p className="text-gray-500 mb-4">Select from available rewards set by your manager</p>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Browse Rewards
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayRewards.map(reward => {
              const progress = getProgressPercentage(reward.currentAmount, reward.targetAmount);
              const remaining = getRemainingAmount(reward.currentAmount, reward.targetAmount);
              
              return (
                <div
                  key={reward.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{reward.title}</h4>
                        <Badge className={`text-xs ${getStatusColor(reward.status)}`}>
                          {getStatusIcon(reward.status)}
                          <span className="ml-1 capitalize">{reward.status.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        {getKPIIcon(reward.linkedKPI)}
                        <span>{reward.linkedKPI}</span>
                      </div>
                      <span className="font-medium">
                        {formatKPIValue(reward.linkedKPI, reward.currentAmount)} / {formatKPIValue(reward.linkedKPI, reward.targetAmount)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progress.toFixed(0)}% complete</span>
                      {remaining > 0 && (
                        <span>{formatKPIValue(reward.linkedKPI, remaining)} to go</span>
                      )}
                    </div>
                  </div>
                  
                  {reward.deadline && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {new Date(reward.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => removeReward(reward.id)}
                  >
                    Remove from Dashboard
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        
        {availableRewards.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-gray-700 mb-3">Available Rewards</h4>
            <div className="flex flex-wrap gap-2">
              {availableRewards.slice(0, 3).map(reward => (
                <Button
                  key={reward.id}
                  variant="outline"
                  size="sm"
                  onClick={() => addReward(reward.id)}
                  className="text-xs"
                >
                  <span className="mr-1">{reward.icon}</span>
                  {reward.title}
                </Button>
              ))}
              {availableRewards.length > 3 && (
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  +{availableRewards.length - 3} more...
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RewardsProgress;
