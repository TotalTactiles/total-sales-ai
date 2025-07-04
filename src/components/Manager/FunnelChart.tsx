
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Users, ArrowRight } from 'lucide-react';

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  percentage: number;
  conversionRate?: number;
  color: string;
}

const FunnelChart: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const funnelStages: FunnelStage[] = [
    { id: '1', name: 'Leads', count: 1240, percentage: 100, color: 'bg-blue-500' },
    { id: '2', name: 'Contacted', count: 892, percentage: 72, conversionRate: 72, color: 'bg-blue-600' },
    { id: '3', name: 'Qualified', count: 186, percentage: 15, conversionRate: 21, color: 'bg-blue-700' },
    { id: '4', name: 'Proposal Sent', count: 89, percentage: 7, conversionRate: 48, color: 'bg-blue-800' },
    { id: '5', name: 'Negotiation', count: 67, percentage: 5, conversionRate: 75, color: 'bg-blue-900' },
    { id: '6', name: 'Closed Won', count: 45, percentage: 4, conversionRate: 67, color: 'bg-green-600' }
  ];

  const getStageWidth = (percentage: number) => {
    return Math.max(percentage, 10); // Minimum 10% width for visibility
  };

  const handleStageClick = (stageId: string) => {
    setSelectedStage(selectedStage === stageId ? null : stageId);
  };

  return (
    <div className="space-y-6">
      {/* Funnel Visualization */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Conversion Funnel Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnelStages.map((stage, index) => (
              <div key={stage.id} className="relative">
                <div
                  className={`${stage.color} text-white rounded-lg p-4 cursor-pointer hover:opacity-90 transition-all duration-200 ${
                    selectedStage === stage.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  style={{ width: `${getStageWidth(stage.percentage)}%` }}
                  onClick={() => handleStageClick(stage.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{stage.name}</h4>
                      <p className="text-xs opacity-90">{stage.count.toLocaleString()} leads</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{stage.percentage}%</div>
                      {stage.conversionRate && (
                        <div className="text-xs opacity-90">
                          {stage.conversionRate}% conv.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < funnelStages.length - 1 && (
                  <div className="flex items-center justify-center my-2">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stage Details */}
      {selectedStage && (
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">
              Stage Details: {funnelStages.find(s => s.id === selectedStage)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Associated Reps</h4>
                <div className="mt-2 space-y-1">
                  <div className="text-sm">Sarah Johnson - 45 leads</div>
                  <div className="text-sm">Michael Chen - 32 leads</div>
                  <div className="text-sm">Emily Rodriguez - 38 leads</div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900">Top Drop-off Reasons</h4>
                <div className="mt-2 space-y-1">
                  <div className="text-sm">Budget constraints (32%)</div>
                  <div className="text-sm">Timeline mismatch (28%)</div>
                  <div className="text-sm">Competition (22%)</div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Performance Metrics</h4>
                <div className="mt-2 space-y-1">
                  <div className="text-sm">Avg. time in stage: 5.2 days</div>
                  <div className="text-sm">Best performer: Sarah J.</div>
                  <div className="text-sm">Conversion trend: +12%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FunnelChart;
