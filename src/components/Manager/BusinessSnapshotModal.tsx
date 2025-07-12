
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { TSAMChart } from '@/components/charts/TSAMChartTheme';
import { useNavigate } from 'react-router-dom';

interface BusinessSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: {
    id: string;
    title: string;
    value: string;
    subtitle: string;
    insights: string[];
    deepDive: string;
    chartData?: any[];
    chartType?: 'bar' | 'pie' | 'line';
    trend?: 'up' | 'down' | 'neutral';
  };
}

export const BusinessSnapshotModal: React.FC<BusinessSnapshotModalProps> = ({
  isOpen,
  onClose,
  snapshot
}) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    onClose();
    
    // Navigate based on snapshot type
    switch (snapshot.id) {
      case 'revenue-trend':
        navigate('/manager/reports');
        break;
      case 'objection-types':
        navigate('/manager/team');
        break;
      case 'follow-up-delays':
        navigate('/manager/team');
        break;
      case 'ai-alerts':
        navigate('/manager/ai');
        break;
      case 'goal-progress':
        navigate('/manager/business-ops');
        break;
      case 'activity-volume':
        navigate('/manager/team');
        break;
      default:
        navigate('/manager/reports');
    }
  };

  const getTrendIcon = () => {
    if (snapshot.trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (snapshot.trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[85vh] sm:max-w-xl lg:max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3 sm:space-y-4 flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="truncate">{snapshot.title}</span>
              {getTrendIcon()}
            </DialogTitle>
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              Real-time data
            </Badge>
          </div>
          
          <div className="text-center py-3 sm:py-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {snapshot.value}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">{snapshot.subtitle}</p>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Chart Section */}
            {snapshot.chartData && snapshot.chartType && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Trend Analysis</h4>
                <TSAMChart 
                  data={snapshot.chartData}
                  type={snapshot.chartType}
                  height={140}
                />
              </div>
            )}

            {/* Insights Section */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Key Insights</h4>
              <div className="space-y-2">
                {snapshot.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 sm:mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 gap-3 sm:gap-0">
              <p className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
              <Button onClick={handleReadMore} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read More
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
