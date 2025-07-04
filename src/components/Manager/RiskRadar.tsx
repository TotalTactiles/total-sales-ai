import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Users } from 'lucide-react';
interface RiskItem {
  id: string;
  type: 'high-stakes' | 'rep-performance' | 'lead-source';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  value?: string;
}
const RiskRadar: React.FC = () => {
  const riskItems: RiskItem[] = [{
    id: '1',
    type: 'high-stakes',
    title: 'Stalled Enterprise Deal',
    description: 'GlobalTech Networks - $50K deal stalled for 5 days',
    severity: 'high',
    value: '$50,000'
  }, {
    id: '2',
    type: 'rep-performance',
    title: 'Michael Chen Performance',
    description: '25% below target, mood score declining',
    severity: 'high'
  }, {
    id: '3',
    type: 'lead-source',
    title: 'Meta Ads Overload',
    description: '75% of leads assigned to 2 reps',
    severity: 'medium'
  }];
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'high-stakes':
        return <AlertTriangle className="h-4 w-4" />;
      case 'rep-performance':
        return <TrendingDown className="h-4 w-4" />;
      case 'lead-source':
        return <Users className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  return;
};
export default RiskRadar;