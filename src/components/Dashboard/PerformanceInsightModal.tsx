
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Brain, Target, X } from 'lucide-react';

interface PerformanceInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: any;
}

const PerformanceInsightModal: React.FC<PerformanceInsightModalProps> = ({
  isOpen,
  onClose,
  cardData
}) => {
  // Mock data for charts based on card type
  const getChartData = () => {
    if (cardData?.id === 'calls') {
      return {
        trend: [
          { day: 'Mon', calls: 8, target: 12 },
          { day: 'Tue', calls: 15, target: 12 },
          { day: 'Wed', calls: 10, target: 12 },
          { day: 'Thu', calls: 18, target: 12 },
          { day: 'Fri', calls: 12, target: 12 },
        ],
        distribution: [
          { name: 'Connected', value: 65, color: '#10b981' },
          { name: 'Voicemail', value: 25, color: '#f59e0b' },
          { name: 'No Answer', value: 10, color: '#ef4444' },
        ]
      };
    } else if (cardData?.id === 'revenue') {
      return {
        trend: [
          { month: 'Jan', revenue: 32000, target: 40000 },
          { month: 'Feb', revenue: 38000, target: 40000 },
          { month: 'Mar', revenue: 45000, target: 40000 },
          { month: 'Apr', revenue: 42000, target: 40000 },
          { month: 'May', revenue: 48000, target: 40000 },
        ],
        distribution: [
          { name: 'New Business', value: 60, color: '#3b82f6' },
          { name: 'Upsells', value: 30, color: '#8b5cf6' },
          { name: 'Renewals', value: 10, color: '#06b6d4' },
        ]
      };
    }
    return { trend: [], distribution: [] };
  };

  const chartData = getChartData();

  const getAIInsights = () => {
    const insights = [
      "Your call performance is 20% above target this week",
      "Best calling times: 10-11 AM and 2-3 PM show highest connection rates",
      "Consider focusing on prospects from tech industry - 40% higher conversion",
      "Your follow-up timing is optimal at 2-day intervals"
    ];
    return insights;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Performance Insights: {cardData?.title}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Current Value</p>
                    <p className="text-2xl font-bold text-blue-900">{cardData?.value}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Trend</p>
                    <p className="text-lg font-semibold text-green-900">{cardData?.trend}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">AI Score</p>
                    <p className="text-2xl font-bold text-purple-900">87%</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={cardData?.id === 'calls' ? 'day' : 'month'} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey={cardData?.id === 'calls' ? 'calls' : 'revenue'} stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Breakdown Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData.distribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getAIInsights().map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <Badge variant="secondary" className="mt-0.5">{index + 1}</Badge>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Apply AI Recommendations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceInsightModal;
