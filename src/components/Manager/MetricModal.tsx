
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, AlertTriangle, DollarSign, Brain } from 'lucide-react';

interface MetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  metric: string;
  change?: string;
  insights: string[];
  recommendations: string[];
  deepDiveLink: string;
  deepDiveLinkText: string;
  type: 'revenue' | 'risk' | 'pipeline' | 'alerts';
}

const MetricModal: React.FC<MetricModalProps> = ({
  isOpen,
  onClose,
  title,
  metric,
  change,
  insights,
  recommendations,
  deepDiveLink,
  deepDiveLinkText,
  type
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'revenue': return <DollarSign className="h-6 w-6 text-green-600" />;
      case 'risk': return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'pipeline': return <TrendingUp className="h-6 w-6 text-blue-600" />;
      case 'alerts': return <Brain className="h-6 w-6 text-purple-600" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'revenue': return 'from-green-50 to-emerald-50 border-green-200';
      case 'risk': return 'from-red-50 to-rose-50 border-red-200';
      case 'pipeline': return 'from-blue-50 to-sky-50 border-blue-200';
      case 'alerts': return 'from-purple-50 to-violet-50 border-purple-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-lg bg-gradient-to-br ${getColor()} border-2 shadow-2xl animate-scale-in`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getIcon()}
              <CardTitle className="text-xl font-bold text-gray-900">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Metric Display */}
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-gray-900 mb-1">{metric}</div>
            {change && (
              <div className="text-sm text-gray-600 font-medium">{change}</div>
            )}
          </div>

          {/* AI Insights */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              AI Insights
            </h4>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="bg-white/60 rounded-lg p-3 text-sm text-gray-700">
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Recommended Actions</h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Dive Link */}
          <div className="pt-4 border-t border-gray-200">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => {
                console.log(`Navigate to: ${deepDiveLink}`);
                // In a real app, this would navigate to the appropriate section
              }}
            >
              {deepDiveLinkText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricModal;
