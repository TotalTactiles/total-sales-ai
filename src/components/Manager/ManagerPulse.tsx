
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, TrendingUp, Users, Target, Zap } from 'lucide-react';

const ManagerPulse: React.FC = () => {
  const pulseActions = [
    {
      id: '1',
      priority: 'high',
      category: 'sales_rep',
      action: 'Schedule 1-on-1 with Michael Chen',
      reason: 'Performance down 23% this week, burnout risk detected',
      impact: 'High',
      timeEstimate: '30 min',
      icon: Users
    },
    {
      id: '2',
      priority: 'high',
      category: 'lead_funnel',
      action: 'Fix Google Ads lead qualification',
      reason: '67% of Google leads are unqualified, wasting rep time',
      impact: 'Medium',
      timeEstimate: '2 hours',
      icon: Target
    },
    {
      id: '3',
      priority: 'medium',
      category: 'process',
      action: 'Update follow-up sequence for Enterprise leads',
      reason: '5-day delay average on Enterprise follow-ups',
      impact: 'High',
      timeEstimate: '1 hour',
      icon: TrendingUp
    },
    {
      id: '4',
      priority: 'medium',
      category: 'team',
      action: 'Redistribute leads from Sarah to other reps',
      reason: 'Sarah has 47 active leads while others have 20-25',
      impact: 'Medium',
      timeEstimate: '15 min',
      icon: Users
    },
    {
      id: '5',
      priority: 'low',
      category: 'marketing',
      action: 'Review LinkedIn campaign messaging',
      reason: 'CTR dropped 15% this week',
      impact: 'Low',
      timeEstimate: '45 min',
      icon: TrendingUp
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-600" />
          Manager Pulse
          <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700">
            {pulseActions.filter(a => a.priority === 'high').length} High Priority
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pulseActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <div key={action.id} className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <IconComponent className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{action.action}</h4>
                    <p className="text-xs text-gray-600 mt-1">{action.reason}</p>
                  </div>
                </div>
                <Badge className={`${getPriorityColor(action.priority)} text-xs ml-2`}>
                  {action.priority}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Impact: {action.impact}</span>
                  <span>Est: {action.timeEstimate}</span>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7">
                  <Zap className="h-3 w-3 mr-1" />
                  Take Action
                </Button>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full text-sm">
            View All Recommendations ({pulseActions.length + 3} more)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerPulse;
