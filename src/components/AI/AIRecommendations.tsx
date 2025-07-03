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
  const recommendations: AIRecommendation[] = [{
    id: '1',
    type: 'call',
    title: 'Call Sarah Johnson',
    description: 'High-value lead showing strong interest. Optimal call window: 2-4 PM',
    priority: 'high',
    estimatedTime: '15 min',
    leadName: 'Sarah Johnson',
    confidence: 92
  }, {
    id: '2',
    type: 'email',
    title: 'Follow up with TechCorp',
    description: 'Send personalized proposal based on their specific requirements',
    priority: 'high',
    estimatedTime: '10 min',
    leadName: 'Mike Chen',
    confidence: 87
  }, {
    id: '3',
    type: 'follow_up',
    title: 'Schedule demo with StartupXYZ',
    description: 'They\'ve reviewed the proposal and requested a product demonstration',
    priority: 'medium',
    estimatedTime: '5 min',
    leadName: 'Alex Rivera',
    confidence: 78
  }];
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
  return;
};
export default AIRecommendations;