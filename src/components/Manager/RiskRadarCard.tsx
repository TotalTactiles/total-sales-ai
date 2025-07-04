
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Users, DollarSign } from 'lucide-react';

interface RiskItem {
  id: string;
  type: 'high-stakes' | 'rep-performance' | 'lead-source' | 'pipeline';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  value?: string;
}

const RiskRadarCard: React.FC = () => {
  const riskItems: RiskItem[] = [
    {
      id: '1',
      type: 'high-stakes',
      title: 'Stalled Enterprise Deal',
      description: 'GlobalTech - $50K, 5 days stalled',
      severity: 'high',
      value: '$50K'
    },
    {
      id: '2',
      type: 'rep-performance',
      title: 'Michael Performance Drop',
      description: '25% below target, declining',
      severity: 'high'
    },
    {
      id: '3',
      type: 'lead-source',
      title: 'Meta Ads Overload',
      description: '75% leads to 2 reps only',
      severity: 'medium'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'high-stakes': return DollarSign;
      case 'rep-performance': return TrendingDown;
      case 'lead-source': return Users;
      default: return AlertTriangle;
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Risk Radar
          <Badge className="bg-red-100 text-red-800 text-xs ml-auto">
            {riskItems.length} Issues
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {riskItems.map((item) => {
            const IconComponent = getTypeIcon(item.type);
            return (
              <div key={item.id} className={`p-3 rounded-lg border ${getSeverityColor(item.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <h4 className="font-medium text-sm">{item.title}</h4>
                  </div>
                  {item.value && (
                    <span className="font-semibold text-sm">{item.value}</span>
                  )}
                </div>
                <p className="text-xs opacity-80 ml-6">{item.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskRadarCard;
