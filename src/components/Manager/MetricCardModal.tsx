
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { TSAMChart } from '@/components/charts/TSAMChartTheme';
import { useNavigate } from 'react-router-dom';

interface MetricCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: {
    id: string;
    title: string;
    value: string;
    change: string;
    insights: string[];
    recommendations: string[];
    deepDiveLink: string;
    chartData?: any[];
  };
}

export const MetricCardModal: React.FC<MetricCardModalProps> = ({
  isOpen,
  onClose,
  metric
}) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    onClose();
    navigate(metric.deepDiveLink);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {metric.title}
            </DialogTitle>
            <Badge variant="outline" className="text-xs">
              Live metrics
            </Badge>
          </div>
          
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <p className="text-sm text-gray-600">{metric.change}</p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chart Section */}
          {metric.chartData && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Performance Trend</h4>
              <TSAMChart 
                data={metric.chartData}
                type="line"
                height={160}
              />
            </div>
          )}

          {/* Insights Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Current Insights</h4>
              <div className="space-y-2">
                {metric.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Recommendations</h4>
              <div className="space-y-2">
                {metric.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Updated in real-time
            </p>
            <Button onClick={handleReadMore} className="bg-purple-600 hover:bg-purple-700">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
