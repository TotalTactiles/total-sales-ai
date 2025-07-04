
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const AIFunnelInsights: React.FC = () => {
  const insights = [
    {
      id: '1',
      type: 'warning',
      title: 'High Leakage at Qualification Stage',
      description: 'Only 21% of contacted leads are qualifying. Industry average is 35%.',
      suggestion: 'Implement better lead scoring and qualification training for the team.',
      impact: 'Could increase qualified leads by 67% (125 additional leads/month)',
      priority: 'high'
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Strong Negotiation Performance',
      description: '75% of leads in negotiation close successfully - above industry average.',
      suggestion: 'Leverage negotiation best practices across earlier funnel stages.',
      impact: 'Could improve overall conversion by 15%',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'risk',
      title: 'Proposal-to-Negotiation Drop-off',
      description: 'Only 48% of proposals make it to negotiation stage.',
      suggestion: 'Review proposal templates and follow-up sequences.',
      impact: 'Addressing this could add $45K monthly revenue',
      priority: 'high'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'risk':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'opportunity':
        return 'bg-green-50 border-green-200';
      case 'risk':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Brain className="h-5 w-5" />
          AI Optimized Funnel Insights
          <Badge className="bg-purple-100 text-purple-800 text-xs ml-auto">
            Live Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type)} hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getInsightIcon(insight.type)}
                  <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
                </div>
                <Badge className={getPriorityBadge(insight.priority)}>
                  {insight.priority} priority
                </Badge>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
              
              <div className="bg-white/60 p-3 rounded-md mb-3">
                <h5 className="font-medium text-xs text-gray-800 mb-1">AI Recommendation:</h5>
                <p className="text-xs text-gray-700">{insight.suggestion}</p>
              </div>
              
              <div className="bg-blue-50 p-2 rounded-md">
                <p className="text-xs font-medium text-blue-800">Projected Impact: {insight.impact}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 text-sm mb-2">Overall Funnel Health Score</h4>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-purple-700">73/100</div>
            <div className="text-xs text-purple-600">Good - Room for improvement</div>
          </div>
          <div className="mt-2 bg-purple-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '73%' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFunnelInsights;
