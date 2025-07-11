
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TeamPerformance = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Rep',
      revenue: '$145,000',
      deals: '198',
      conversion: '34.2%',
      status: 'On track',
      progress: 87,
      trend: 'up',
      avatar: 'SJ',
      riskLevel: 'low'
    },
    {
      name: 'Michael Chen',
      role: 'Rep',
      revenue: '$89,000',
      deals: '143',
      conversion: '28.1%',
      status: 'Behind',
      progress: 74,
      trend: 'down',
      avatar: 'MC',
      riskLevel: 'high'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Rep',
      revenue: '$112,000',
      deals: '167',
      conversion: '31.8%',
      status: 'Excellent',
      progress: 92,
      trend: 'up',
      avatar: 'ER',
      riskLevel: 'low'
    }
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Team Performance</h2>
        <div className="text-sm text-gray-500">All Team</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {teamMembers.map((member, index) => {
          const TrendIcon = member.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{member.name}</h3>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                  <TrendIcon className={`h-4 w-4 ${member.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Revenue</span>
                    <span className="text-sm font-bold">{member.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Deals</span>
                    <span className="text-sm font-bold">{member.deals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Conversion</span>
                    <span className="text-sm font-bold">{member.conversion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Status</span>
                    <span className={`text-sm font-medium ${
                      member.status === 'Excellent' ? 'text-green-600' :
                      member.status === 'Behind' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Target Progress</span>
                    <span>{member.progress}%</span>
                  </div>
                  <Progress value={member.progress} className="h-2" />
                  <div className="text-xs text-gray-400">
                    {member.riskLevel === 'high' ? '2 hours ago' : 
                     member.riskLevel === 'low' && member.progress > 90 ? '30 minutes ago' : '1 day ago'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default TeamPerformance;
