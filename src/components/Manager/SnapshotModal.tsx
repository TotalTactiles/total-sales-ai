
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp,
  ExternalLink,
  Clock,
  DollarSign,
  AlertTriangle,
  Target,
  Brain,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from 'recharts';

interface SnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: {
    id: string;
    title: string;
    value: string;
    subtitle: string;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
    textColor: string;
    insights: string[];
    deepDive: string;
    chartData?: any[];
    chartType?: 'bar' | 'line' | 'pie';
  };
}

const SnapshotModal: React.FC<SnapshotModalProps> = ({ isOpen, onClose, snapshot }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    onClose();
    navigate(snapshot.deepDive);
  };

  const renderChart = () => {
    if (!snapshot.chartData) return null;

    const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

    switch (snapshot.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={snapshot.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <RechartsLineChart data={snapshot.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={snapshot.chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {snapshot.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const IconComponent = snapshot.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`${snapshot.bgColor} ${snapshot.textColor} p-2 rounded-lg`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{snapshot.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{snapshot.subtitle}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Metric */}
          <div className="text-center py-4">
            <div className={`text-4xl font-bold ${snapshot.textColor} mb-2`}>
              {snapshot.value}
            </div>
            <Badge variant="outline" className="flex items-center gap-1 w-fit mx-auto">
              <Clock className="h-3 w-3" />
              Updated 5 minutes ago
            </Badge>
          </div>

          {/* Chart Visualization */}
          {snapshot.chartData && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Trend Analysis
              </h4>
              {renderChart()}
            </div>
          )}

          {/* Key Insights */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Key Insights
            </h4>
            {snapshot.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleReadMore} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              📘 Read More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SnapshotModal;
