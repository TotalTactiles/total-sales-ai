
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

interface ManagerInsight {
  id: string;
  type: 'cac' | 'ltv' | 'conversion' | 'rep_performance' | 'lead_distribution' | 'automation_opportunity';
  title: string;
  description: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  suggestion?: string;
  metadata: Record<string, any>;
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
      case 'cac':
      case 'ltv':
        return DollarSign;
      case 'rep_performance':
        return Users;
      case 'conversion':
      case 'lead_distribution':
        return BarChart3;
      default:
        return BarChart3;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPageSpecificMessage = () => {
    switch (currentPage) {
      case '/dashboard':
        return 'Analyzing overall business performance and key metrics...';
      case '/analytics':
        return 'Deep-diving into analytics and performance trends...';
      case '/lead-management':
        return 'Optimizing lead distribution and conversion strategies...';
      default:
        return 'Generating contextual insights...';
    }
  };

  if (isGenerating) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
            <div>
              <p className="font-medium text-blue-800">AI Analysis in Progress</p>
              <p className="text-sm text-blue-600">{getPageSpecificMessage()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No insights available for this page</p>
          <p className="text-sm text-gray-400 mt-1">
            AI will generate insights as you use the platform
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => {
        const IconComponent = getInsightIcon(insight.type);
        
        return (
          <Card key={insight.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={getImpactColor(insight.impact)}
                      >
                        {insight.impact.toUpperCase()}
                      </Badge>
                      {getTrendIcon(insight.trend)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {insight.value}
                  </div>
                  {insight.metadata.improvement && (
                    <div className="text-sm text-green-600">
                      +{insight.metadata.improvement}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 mb-4">{insight.description}</p>
              
              {insight.actionable && insight.suggestion && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800 mb-1">AI Recommendation</p>
                      <p className="text-sm text-blue-700">{insight.suggestion}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {insight.metadata.methods && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Success Methods:</p>
                  <div className="flex flex-wrap gap-2">
                    {insight.metadata.methods.map((method: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {method.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ManagerAIInsights;
