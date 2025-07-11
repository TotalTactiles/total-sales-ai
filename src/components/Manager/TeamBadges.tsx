
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TeamBadges = () => {
  const badges = [
    {
      name: 'Michael Chen below target',
      description: '25% behind monthly goal',
      category: 'Revenue Performance',
      status: 'high',
      color: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Team Badges</h2>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Pref</span>
          <span>Coach</span>
          <span>Burnout</span>
          <span>Covid</span>
          <span>Activity</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h3 className="font-semibold text-sm">{badge.name}</h3>
              <p className="text-xs text-gray-600">{badge.description}</p>
            </div>
            <Badge className={badge.color}>
              {badge.category}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamBadges;
