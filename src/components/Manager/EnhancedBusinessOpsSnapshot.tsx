
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Brain,
  Target,
  DollarSign,
  Phone,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { MetricCard, ChartWrapper } from '@/components/charts/ChartTheme';
import SnapshotModal from './SnapshotModal';

interface EnhancedBusinessOpsSnapshotProps {
  className?: string;
}

const EnhancedBusinessOpsSnapshot: React.FC<EnhancedBusinessOpsSnapshotProps> = ({ className = '' }) => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);

  const snapshots = [
    {
      id: 'revenue-trends',
      title: 'Revenue Trends',
      value: '$2.4M',
      subtitle: '+15.2% vs last month',
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      insights: [
        'Q4 trending 23% above target',
        'Enterprise deals driving growth',
        'SMB conversion improving 12%'
      ],
      deepDive: '/manager/reports',
      chartData: [
        { name: 'Jan', value: 1.8 },
        { name: 'Feb', value: 2.1 },
        { name: 'Mar', value: 1.9 },
        { name: 'Apr', value: 2.3 },
        { name: 'May', value: 2.2 },
        { name: 'Jun', value: 2.4 }
      ],
      chartType: 'line' as const
    },
    {
      id: 'pipeline-health',
      title: 'Pipeline Health',
      value: '87%',
      subtitle: 'Quality Score',
      icon: Activity,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      insights: [
        'High-quality leads increased 23%',
        'Conversion rate above industry average',
        'Lead scoring accuracy improved'
      ],
      deepDive: '/manager/pipeline',
      chartData: [
        { name: 'Qualified', value: 45 },
        { name: 'Proposal', value: 30 },
        { name: 'Negotiation', value: 15 },
        { name: 'Closed Won', value: 10 }
      ],
      chartType: 'pie' as const
    },
    {
      id: 'team-performance',
      title: 'Team Performance',
      value: '94%',
      subtitle: 'Goal Achievement',
      icon: Target,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      insights: [
        'All reps exceeding monthly targets',
        'Average deal size increased 18%',
        'Call-to-close ratio improved'
      ],
      deepDive: '/manager/team',
      chartData: [
        { name: 'Sarah', value: 98 },
        { name: 'Mike', value: 92 },
        { name: 'Emma', value: 89 },
        { name: 'James', value: 96 }
      ],
      chartType: 'bar' as const
    },
    {
      id: 'ai-insights',
      title: 'AI Insights',
      value: '12 Active',
      subtitle: '3 High Priority',
      icon: Brain,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      insights: [
        'Hot leads going cold detected',
        'Optimal calling times identified',
        'Burnout risk alerts active'
      ],
      deepDive: '/manager/ai',
      chartData: [
        { name: 'High', value: 3 },
        { name: 'Medium', value: 5 },
        { name: 'Low', value: 4 }
      ],
      chartType: 'pie' as const
    }
  ];

  return (
    <>
      <Card className={`border-0 bg-white/95 backdrop-blur-sm shadow-xl ${className}`}>
        <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Business Operations Snapshot</h3>
              <p className="text-indigo-100 text-sm mt-1">
                AI-powered insights aligned with your business goals
              </p>
            </div>
            <Badge className="bg-white/20 text-white text-xs">
              Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {snapshots.map((snapshot) => (
              <MetricCard
                key={snapshot.id}
                title={snapshot.title}
                value={snapshot.value}
                change={snapshot.subtitle}
                icon={<snapshot.icon className="h-8 w-8" />}
                gradient={snapshot.gradient}
                onClick={() => setSelectedSnapshot(snapshot)}
              />
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Advanced Analytics Available
                </span>
              </div>
              <Button variant="outline" size="sm">
                View Full Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSnapshot && (
        <SnapshotModal
          isOpen={!!selectedSnapshot}
          onClose={() => setSelectedSnapshot(null)}
          snapshot={selectedSnapshot}
        />
      )}
    </>
  );
};

export default EnhancedBusinessOpsSnapshot;
