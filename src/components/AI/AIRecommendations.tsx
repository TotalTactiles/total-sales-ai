
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, Phone, Mail, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AIRecommendationsProps {
  onRecommendationClick?: (recommendation: any) => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ onRecommendationClick }) => {
  const { profile } = useAuth();

  const recommendations = [
    {
      id: '1',
      title: 'Follow up with Sarah Chen',
      description: 'High-value lead went cold after demo. ROI calculator mention has 67% success rate with CFOs.',
      urgency: 'high' as const,
      leadName: 'Sarah Chen',
      company: 'TechCorp',
      daysActive: 0,
      type: 'follow_up'
    },
    {
      id: '2',
      title: 'Send proposal to Mike Rodriguez',
      description: 'Decision maker confirmed budget. Use enterprise case study for similar company size.',
      urgency: 'high' as const,
      leadName: 'Mike Rodriguez',
      company: 'StartupX',
      daysActive: 0,
      type: 'proposal'
    },
    {
      id: '3',
      title: 'Schedule demo with Lisa Wang',
      description: 'Qualified lead requested demo. Focus on security features mentioned in last call.',
      urgency: 'medium' as const,
      leadName: 'Lisa Wang',
      company: 'Enterprise Co',
      daysActive: 1,
      type: 'demo'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow_up': return Phone;
      case 'proposal': return Mail;
      case 'demo': return Calendar;
      default: return AlertCircle;
    }
  };

  const handleRecommendationClick = (recommendation: any) => {
    if (onRecommendationClick) {
      onRecommendationClick(recommendation);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          AI Action Center
          <Badge variant="secondary" className="ml-auto">
            {recommendations.length} recommendations
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => {
          const IconComponent = getTypeIcon(rec.type);
          return (
            <div
              key={rec.id}
              onClick={() => handleRecommendationClick(rec)}
              className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{rec.title}</span>
                    {rec.daysActive > 0 && (
                      <Badge variant="outline" className="text-orange-600 text-xs">
                        {rec.daysActive} days active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-blue-800 mb-2">{rec.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getUrgencyColor(rec.urgency)} variant="outline">
                      {rec.urgency} priority
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {rec.leadName} • {rec.company}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="ml-3">
                  Act Now
                </Button>
              </div>
            </div>
          );
        })}
        
        {recommendations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No AI recommendations at the moment.</p>
            <p className="text-sm">Check back later for personalized suggestions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
