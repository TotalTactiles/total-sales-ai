
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, TrendingDown } from 'lucide-react';

interface ActionItem {
  id: string;
  type: 'redistribute' | 'coach' | 'escalate';
  target: string;
  priority: 'red' | 'orange' | 'yellow';
  message: string;
  route: string;
}

const ManagerActionPanel: React.FC = () => {
  const actionItems: ActionItem[] = [
    {
      id: '1',
      type: 'redistribute',
      target: 'Sarah Johnson',
      priority: 'red',
      message: 'Sarah has 47 active leads while Michael has 23',
      route: '/manager/team'
    },
    {
      id: '2',
      type: 'coach',
      target: 'Michael Chen',
      priority: 'orange',
      message: 'Performance decline detected - 25% below target',
      route: '/manager/team'
    },
    {
      id: '3',
      type: 'escalate',
      target: 'Enterprise Deal #4428',
      priority: 'yellow',
      message: 'High-value deal stalled for 5 days',
      route: '/manager/leads'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'redistribute': return <Users className="h-4 w-4" />;
      case 'coach': return <TrendingDown className="h-4 w-4" />;
      case 'escalate': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">AI Recommended Actions</h3>
          <div className="flex gap-2">
            {actionItems.map((item) => (
              <Card key={item.id} className={`border ${getPriorityColor(item.priority)} p-2`}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-2">
                    {getIcon(item.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{item.target}</p>
                      <p className="text-xs text-gray-600 truncate">{item.message}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-6">
                      Take Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerActionPanel;
