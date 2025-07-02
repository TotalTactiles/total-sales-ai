
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Phone, Mail, Calendar, TrendingUp, Clock } from 'lucide-react';
import { aiConfig } from '@/config/ai';

interface AIRecommendation {
  id: string;
  type: 'call' | 'email' | 'follow_up' | 'research';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  leadName?: string;
  confidence: number;
}

interface AIRecommendationsProps {
  className?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ className = '' }) => {
  // Mock recommendations for demo
  const recommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'call',
      title: 'Call Sarah Johnson',
      description: 'High-value lead showing strong interest. Optimal call window: 2-4 PM',
      priority: 'high',
      estimatedTime: '15 min',
      leadName: 'Sarah Johnson',
      confidence: 92
    },
    {
      id: '2',
      type: 'email',
      title: 'Follow up with TechCorp',
      description: 'Send personalized proposal based on their specific requirements',
      priority: 'high',
      estimatedTime: '10 min',
      leadName: 'Mike Chen',
      confidence: 87
    },
    {
      id: '3',
      type: 'follow_up',
      title: 'Schedule demo with StartupXYZ',
      description: 'They\'ve reviewed the proposal and requested a product demonstration',
      priority: 'medium',
      estimatedTime: '5 min',
      leadName: 'Alex Rivera',
      confidence: 78
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'follow_up': return Calendar;
      default: return TrendingUp;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRecommendationAction = (rec: AIRecommendation) => {
    if (!aiConfig.enabled) {
      console.log(`Demo: Would execute ${rec.type} action for ${rec.title}`);
      return;
    }
    // Real AI action would be implemented here
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Recommendations
          {!aiConfig.enabled && (
            <Badge variant="outline" className="text-xs">Demo Mode</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const TypeIcon = getTypeIcon(rec.type);
            return (
              <div key={rec.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rec.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {rec.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleRecommendationAction(rec)}
                    className="ml-2"
                  >
                    Start
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
