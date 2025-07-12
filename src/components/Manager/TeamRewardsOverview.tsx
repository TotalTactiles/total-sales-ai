
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Star, Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeamRewardsOverview: React.FC = () => {
  const navigate = useNavigate();

  const activeRewards = [
    {
      id: '1',
      title: 'Monthly Top Closer',
      description: '$500 bonus + public recognition',
      type: 'competition',
      endDate: 'Dec 31, 2024',
      participants: [
        { name: 'Emily Rodriguez', initials: 'ER', progress: 87, position: '1st' },
        { name: 'Sarah Johnson', initials: 'SJ', progress: 74, position: '2nd' },
        { name: 'Michael Chen', initials: 'MC', progress: 52, position: '3rd' }
      ],
      icon: Trophy
    },
    {
      id: '2',
      title: 'Call Volume Champion',
      description: 'Extra PTO day + team lunch',
      type: 'milestone',
      endDate: 'Weekly',
      participants: [
        { name: 'Sarah Johnson', initials: 'SJ', progress: 95, position: 'Leading' },
        { name: 'Emily Rodriguez', initials: 'ER', progress: 88, position: '2nd' }
      ],
      icon: Target
    },
    {
      id: '3',
      title: 'Customer Satisfaction Star',
      description: '$300 gift card',
      type: 'achievement',
      endDate: 'Ongoing',
      participants: [
        { name: 'Michael Chen', initials: 'MC', progress: 92, position: 'Qualified' }
      ],
      icon: Star
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'competition': return 'bg-yellow-100 text-yellow-800';
      case 'milestone': return 'bg-blue-100 text-blue-800';
      case 'achievement': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSeeMore = () => {
    navigate('/manager/team');
    // TODO: Add navigation to team rewards subtab when implemented
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-purple-600" />
          Team Rewards Overview
          <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-700">
            {activeRewards.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeRewards.map((reward) => {
          const IconComponent = reward.icon;
          return (
            <div key={reward.id} className="p-4 rounded-lg border bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <IconComponent className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{reward.title}</h4>
                    <p className="text-xs text-gray-600">{reward.description}</p>
                  </div>
                </div>
                <Badge className={`${getTypeColor(reward.type)} text-xs`}>
                  {reward.type}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {reward.participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                        {participant.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{participant.name}</span>
                        <span className="text-xs text-gray-600">{participant.position}</span>
                      </div>
                      <Progress value={participant.progress} className="h-1.5" />
                    </div>
                    <span className="text-xs text-purple-600 font-medium">{participant.progress}%</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-200">
                <span className="text-xs text-gray-600">Ends: {reward.endDate}</span>
                <span className="text-xs text-purple-700 font-medium">
                  {reward.participants.length} participating
                </span>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 border-t">
          <Button 
            variant="outline" 
            className="w-full text-sm bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
            onClick={handleSeeMore}
          >
            See More Rewards
            <ArrowRight className="h-3 w-3 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamRewardsOverview;
