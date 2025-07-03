
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

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  className = ''
}) => {
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
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      case 'follow_up':
        return Calendar;
      default:
        return TrendingUp;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Recommendations
          <Badge className="bg-white/20 text-white text-xs ml-auto">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const IconComponent = getTypeIcon(rec.type);
            return (
              <div
                key={rec.id}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleRecommendationAction(rec)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <IconComponent className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{rec.title}</h4>
                      <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {rec.estimatedTime}
                      </span>
                      <span className="text-purple-600 font-medium">
                        {rec.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm"
          onClick={() => console.log('View all AI recommendations')}
        >
          View All Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
