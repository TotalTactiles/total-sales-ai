
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    title: string;
    value: string;
    subtitle: string;
    insights: string[];
    recommendations: string[];
    chartData?: any[];
    chartType?: 'line' | 'bar' | 'pie';
    trend?: 'up' | 'down' | 'neutral';
  };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const AIInsightsModal: React.FC<AIInsightsModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const getTrendIcon = () => {
    if (data.trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (data.trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <BarChart3 className="h-4 w-4 text-blue-600" />;
  };

  const renderChart = () => {
    if (!data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0) {
      return null;
    }

    switch (data.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              {data.title}
              {getTrendIcon()}
            </DialogTitle>
            <Badge variant="outline" className="text-xs">
              AI Analysis
            </Badge>
          </div>
          
          <div className="text-center py-3">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {data.value}
            </div>
            <p className="text-sm text-gray-600">{data.subtitle}</p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chart Section */}
          {data.chartData && data.chartData.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Performance Trend</h4>
              {renderChart()}
            </div>
          )}

          {/* AI Insights Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">🤖 AI Insights</h4>
            <div className="space-y-2">
              {data.insights && data.insights.length > 0 ? (
                data.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    {insight}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No insights available</div>
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">💡 AI Recommendations</h4>
            <div className="space-y-2">
              {data.recommendations && data.recommendations.length > 0 ? (
                data.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    {rec}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No recommendations available</div>
              )}
            </div>
          </div>

          {/* Action Section */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="h-4 w-4 mr-2" />
              Close Analysis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
