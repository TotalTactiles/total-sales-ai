
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, TrendingDown, ArrowRight, Brain } from 'lucide-react';

interface ActionItem {
  id: string;
  type: 'redistribute' | 'coach' | 'escalate';
  target: string;
  priority: 'red' | 'orange' | 'yellow';
  message: string;
  route: string;
}

const ManagerActionPanel: React.FC = () => {
  const actionItems: ActionItem[] = [{
    id: '1',
    type: 'redistribute',
    target: 'Sarah Johnson',
    priority: 'red',
    message: 'Sarah has 47 active leads while Michael has 23',
    route: '/manager/team'
  }, {
    id: '2',
    type: 'coach',
    target: 'Michael Chen',
    priority: 'orange',
    message: 'Performance decline detected - 25% below target',
    route: '/manager/team'
  }, {
    id: '3',
    type: 'escalate',
    target: 'Enterprise Deal #4428',
    priority: 'yellow',
    message: 'High-value deal stalled for 5 days',
    route: '/manager/leads'
  }];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'red':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'orange':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'redistribute':
        return <Users className="h-4 w-4" />;
      case 'coach':
        return <TrendingDown className="h-4 w-4" />;
      case 'escalate':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Manager Assistant</h3>
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            {actionItems.length} Actions
          </Badge>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          View All
        </Button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2">
        {actionItems.map(item => (
          <div 
            key={item.id} 
            className={`flex-shrink-0 p-3 rounded-lg border ${getPriorityColor(item.priority)} hover:shadow-md transition-all duration-200 cursor-pointer group min-w-[280px]`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <h4 className="font-medium text-sm">{item.target}</h4>
              </div>
            </div>
            <p className="text-xs opacity-80 mb-3 line-clamp-2">
              {item.message}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium opacity-70">
                AI Recommended
              </span>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-6 group-hover:bg-blue-700 transition-colors">
                Act
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerActionPanel;
