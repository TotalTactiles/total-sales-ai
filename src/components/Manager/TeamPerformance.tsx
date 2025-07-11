
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown, Users, Award } from 'lucide-react';

const TeamPerformance = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Sales Rep',
      revenue: '$145,000',
      deals: '198',
      conversion: '34.2%',
      status: 'Exceeding',
      progress: 112,
      trend: 'up',
      avatar: 'SJ',
      riskLevel: 'low',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200'
    },
    {
      name: 'Michael Chen',
      role: 'Sales Rep',
      revenue: '$89,000',
      deals: '143',
      conversion: '28.1%',
      status: 'Below Target',
      progress: 74,
      trend: 'down',
      avatar: 'MC',
      riskLevel: 'high',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Account Executive',
      revenue: '$112,000',
      deals: '167',
      conversion: '31.8%',
      status: 'On Track',
      progress: 92,
      trend: 'up',
      avatar: 'ER',
      riskLevel: 'low',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Team Performance</h2>
            <p className="text-slate-600 mt-1">Individual performance metrics and insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
          <Award className="h-5 w-5" />
          <span className="font-semibold">3 Active Performers</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => {
          const TrendIcon = member.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card 
              key={index} 
              className={`${member.bgColor} ${member.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white text-lg font-bold">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {member.name}
                    </CardTitle>
                    <p className="text-sm text-slate-600 font-medium">{member.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendIcon 
                        className={`h-4 w-4 ${
                          member.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                        }`} 
                      />
                      <span 
                        className={`text-sm font-semibold ${
                          member.status === 'Exceeding' ? 'text-emerald-600' :
                          member.status === 'Below Target' ? 'text-red-600' : 'text-blue-600'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Revenue</p>
                    <p className="text-lg font-bold text-slate-900">{member.revenue}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Deals</p>
                    <p className="text-lg font-bold text-slate-900">{member.deals}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Conv. Rate</p>
                    <p className="text-lg font-bold text-slate-900">{member.conversion}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600">Target Progress</span>
                    <span className="text-slate-900">{member.progress}%</span>
                  </div>
                  <Progress 
                    value={Math.min(member.progress, 100)} 
                    className="h-3" 
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      {member.riskLevel === 'high' ? 'Needs attention' : 
                       member.progress > 100 ? 'Exceeding goals' : 'On track'}
                    </span>
                    <span>Updated 2h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPerformance;
