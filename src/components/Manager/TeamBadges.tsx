
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trophy, TrendingUp } from 'lucide-react';

const TeamBadges = () => {
  const achievements = [
    {
      name: 'Q4 Revenue Champion',
      description: 'Sarah Johnson - $145K revenue, 112% of target',
      category: 'Revenue Excellence',
      status: 'achieved',
      progress: 112,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-800',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: Trophy
    },
    {
      name: 'Team Collaboration Sprint',
      description: 'Cross-functional project completion',
      category: 'Team Performance',
      status: 'in_progress',
      progress: 74,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-blue-800',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: TrendingUp
    },
    {
      name: 'Michael Chen - Performance Alert',
      description: '25% behind monthly goal - needs coaching support',
      category: 'Performance Risk',
      status: 'alert',
      progress: 74,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-red-800',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: AlertTriangle
    }
  ];

  const categories = ['Performance', 'Coaching', 'Wellness', 'Activity', 'Goals'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team Recognition & Alerts</h2>
          <p className="text-slate-600 mt-1">Performance achievements and attention areas</p>
        </div>
        <div className="flex gap-3">
          {categories.map((category, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="text-sm font-medium text-slate-600 border-slate-300 hover:bg-slate-50"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => {
          const IconComponent = achievement.icon;
          return (
            <Card 
              key={index} 
              className={`${achievement.bgColor} ${achievement.borderColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 ${achievement.color} rounded-full shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 leading-tight">
                        {achievement.name}
                      </CardTitle>
                      <Badge className={`${achievement.textColor} bg-white/80 mt-2`}>
                        {achievement.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {achievement.description}
                </p>
                
                {achievement.status === 'in_progress' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-slate-900">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${achievement.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">
                    {achievement.status === 'achieved' ? 'Completed' :
                     achievement.status === 'alert' ? 'Action Required' : 'In Progress'}
                  </span>
                  <span className="text-slate-400">Updated 1h ago</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TeamBadges;
