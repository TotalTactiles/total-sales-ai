
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Users, Target, AlertTriangle } from 'lucide-react';

interface PulseAction {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'sales' | 'marketing' | 'team' | 'operations';
  title: string;
  description: string;
  impact: string;
  actionButton: string;
}

const ManagerPulse: React.FC = () => {
  const pulseActions: PulseAction[] = [
    {
      id: '1',
      priority: 'high',
      category: 'sales',
      title: 'Support Michael Chen',
      description: 'Michael is 25% behind monthly target and needs immediate coaching on objection handling',
      impact: 'Could recover $15K potential revenue',
      actionButton: 'Schedule 1:1'
    },
    {
      id: '2',
      priority: 'high',
      category: 'marketing',
      title: 'Fix LinkedIn Campaign',
      description: 'LinkedIn ads showing 2.1% CTR but 0.8% conversion - landing page optimization needed',
      impact: 'Improve ROI by 40%',
      actionButton: 'Review Campaign'
    },
    {
      id: '3',
      priority: 'medium',
      category: 'team',
      title: 'Address Burnout Risk',
      description: 'Sarah working 12+ hours daily this week - schedule wellness check-in',
      impact: 'Prevent top performer turnover',
      actionButton: 'Book Meeting'
    },
    {
      id: '4',
      priority: 'medium',
      category: 'sales',
      title: 'Optimize Lead Distribution',
      description: 'High-value leads sitting unassigned for 3+ hours - adjust routing rules',
      impact: 'Reduce response time by 65%',
      actionButton: 'Update Rules'
    },
    {
      id: '5',
      priority: 'low',
      category: 'operations',
      title: 'Update CRM Workflows',
      description: 'Automate follow-up sequences for demo no-shows to recover 15% more meetings',
      impact: 'Save 8 hours/week',
      actionButton: 'Configure'
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return Target;
      case 'marketing': return TrendingUp;
      case 'team': return Users;
      case 'operations': return Brain;
      default: return AlertTriangle;
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Manager Pulse
          <span className="text-purple-100 text-sm ml-auto">AI Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {pulseActions.map((action) => {
            const IconComponent = getCategoryIcon(action.category);
            return (
              <div key={action.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold text-sm text-gray-900">{action.title}</h4>
                  </div>
                  <Badge className={`${getPriorityColor(action.priority)} text-xs`}>
                    {action.priority}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{action.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">
                    💡 {action.impact}
                  </span>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1">
                    {action.actionButton}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerPulse;
