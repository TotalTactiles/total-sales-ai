
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Lightbulb, Clock } from 'lucide-react';

interface ManagerInsight {
  id: string;
  type: 'alert' | 'insight' | 'recommendation';
  title: string;
  description: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  impact: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  assistantType: 'dashboard' | 'business-ops' | 'team' | 'leads' | 'company-brain';
}

interface ManagerAIInsightsProps {
  insights: ManagerInsight[];
  isGenerating: boolean;
  currentPage: string;
}

const ManagerAIInsights: React.FC<ManagerAIInsightsProps> = ({ 
  insights, 
  isGenerating, 
  currentPage 
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'insight': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isGenerating) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600">No insights available for this workspace</p>
          <p className="text-sm text-gray-500 mt-1">AI will analyze your data and provide insights here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <Card key={insight.id} className={`border-l-4 ${
          insight.priority === 'critical' ? 'border-l-red-500' :
          insight.priority === 'high' ? 'border-l-orange-500' :
          insight.priority === 'medium' ? 'border-l-yellow-500' :
          'border-l-green-500'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getInsightIcon(insight.type)}
                <h4 className="font-medium text-sm">{insight.title}</h4>
              </div>
              <Badge className={getPriorityColor(insight.priority)}>
                {insight.priority}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Value: {insight.value}</span>
              <span>{insight.timestamp}</span>
            </div>
            {insight.actionRequired && (
              <div className="mt-2 pt-2 border-t">
                <Badge variant="outline" className="text-xs">
                  Action Required
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManagerAIInsights;
