import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, TrendingDown, ArrowRight } from 'lucide-react';
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
        return 'bg-red-100 text-red-800 border-red-200';
      case 'orange':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
  return <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <AlertTriangle className="h-5 w-5" />
          AI Recommended Actions
          <Badge className="bg-blue-100 text-blue-800 text-xs ml-auto">
            {actionItems.length} Actions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {actionItems.map(item => <div key={item.id} className={`p-4 rounded-lg border ${getPriorityColor(item.priority)} hover:shadow-md transition-all duration-200 cursor-pointer group`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getIcon(item.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                      {item.target}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
                
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 font-medium">
                  Recommended Action
                </span>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7 group-hover:bg-blue-700 transition-colors">
                  Take Action
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>)}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <Button variant="outline" className="w-full text-sm bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700">
            View All Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default ManagerActionPanel;