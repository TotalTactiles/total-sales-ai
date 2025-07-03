
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Target, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { aiConfig } from '@/config/ai';

interface CoachingItem {
  id: string;
  type: 'objection_handling' | 'closing_technique' | 'product_knowledge' | 'communication';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  progress: number;
  priority: 'high' | 'medium' | 'low';
}

interface AICoachingPanelProps {
  className?: string;
}

const AICoachingPanel: React.FC<AICoachingPanelProps> = ({
  className = ''
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const coachingItems: CoachingItem[] = [
    {
      id: '1',
      type: 'objection_handling',
      title: 'Overcoming Price Objections',
      description: 'Master techniques to handle price concerns and demonstrate value',
      difficulty: 'intermediate',
      estimatedTime: 25,
      progress: 60,
      priority: 'high'
    },
    {
      id: '2',
      type: 'closing_technique',
      title: 'Assumptive Close Mastery',
      description: 'Learn to guide prospects naturally toward commitment',
      difficulty: 'advanced',
      estimatedTime: 35,
      progress: 20,
      priority: 'high'
    },
    {
      id: '3',
      type: 'product_knowledge',
      title: 'Feature-Benefit Mapping',
      description: 'Connect product features to customer pain points effectively',
      difficulty: 'beginner',
      estimatedTime: 15,
      progress: 80,
      priority: 'medium'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'objection_handling':
        return Target;
      case 'closing_technique':
        return GraduationCap;
      case 'product_knowledge':
        return BookOpen;
      default:
        return Target;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleStartCoaching = (item: CoachingItem) => {
    if (!aiConfig.enabled) {
      console.log(`Demo: Would start coaching session for ${item.title}`);
      return;
    }
    // Real coaching session would be implemented here
  };

  return (
    <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          AI Sales Coaching
          <Badge className="bg-white/20 text-white text-xs ml-auto">
            Personalized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {coachingItems.map((item) => {
            const IconComponent = getTypeIcon(item.type);
            return (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleStartCoaching(item)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {item.estimatedTime}min
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
        
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm"
          onClick={() => console.log('View all coaching modules')}
        >
          View All Coaching Modules
        </Button>
      </CardContent>
    </Card>
  );
};

export default AICoachingPanel;
