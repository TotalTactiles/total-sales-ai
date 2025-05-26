
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Target, 
  Calendar,
  BarChart3,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  metric?: string;
  change?: number;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

interface ManagerAIInsightsProps {
  insights: Insight[];
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
      case 'success': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'danger': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  const getInsightBorder = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'danger': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      default: return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority as keyof typeof colors];
  };

  if (isGenerating) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="ml-2 text-sm text-muted-foreground">Jarvis is analyzing...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6 text-center">
          <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No specific insights for this page yet. Ask Jarvis a question to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id} className={getInsightBorder(insight.type)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge className={getPriorityBadge(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  
                  {insight.metric && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.metric}
                      </Badge>
                      {insight.change && (
                        <span className={`text-xs flex items-center gap-1 ${
                          insight.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {insight.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {Math.abs(insight.change)}%
                        </span>
                      )}
                    </div>
                  )}
                  
                  {insight.action && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7"
                    >
                      {insight.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManagerAIInsights;
